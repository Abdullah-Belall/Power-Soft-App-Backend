import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersDBService } from './DB_Services/orders_DB.service';
import { customerTokenInterface } from 'src/customers/interfaces/customer.interface';
import { SupportersService } from 'src/supporters/supporters.service';
import { StatusDBService } from './DB_Services/status_DB.service';
import { SupporterEntity } from 'src/supporters/entities/supporter.entity';
import { OrderStatusEnum, PrivateStatusEnum } from './enums/order_enums';
import { CustomerOrderNotesDBService } from './DB_Services/customer_order_notes_DB.service';
import { AddOrderNoteDto } from './dto/add-order-note.dto';
import { Brackets } from 'typeorm';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { CustomersDBService } from 'src/customers/DB_services/customers_db.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly OrdersDBService: OrdersDBService,
    private readonly customersDBService: CustomersDBService,
    private readonly supportersService: SupportersService,
    private readonly statusDBService: StatusDBService,
    private readonly customerOrderNotesDBService: CustomerOrderNotesDBService,
  ) {}
  async createOrder(
    { id }: customerTokenInterface,
    createOrderDto: CreateOrderDto,
  ) {
    const customer = await this.customersDBService.findOneCustomer({ id });
    const supporter =
      (await this.supportersService.autoPickSupporter()) as SupporterEntity;
    const order = this.OrdersDBService.createOrderInstance({
      customer,
      supporter,
      ...createOrderDto,
    });
    const savedOrder = await this.OrdersDBService.saveOrder(order);
    const orderStatus = this.statusDBService.createStatusInstance({
      order: savedOrder,
      status: OrderStatusEnum.PENDING,
    });
    await this.statusDBService.saveStatus(orderStatus);
    return {
      done: true,
    };
  }
  async addOrderNote(
    { id }: customerTokenInterface,
    order_id: string,
    { note }: AddOrderNoteDto,
  ) {
    const ordersRepo = this.OrdersDBService.getOrdersRepo();
    const order = await ordersRepo.findOne({
      where: {
        id: order_id,
        customer: {
          id,
        },
      },
    });
    if (!order) {
      throw new NotFoundException('no order found with those info.');
    }
    const noteIntance =
      this.customerOrderNotesDBService.createCustomerOrderNoteInstance({
        order,
        note,
      });
    await this.customerOrderNotesDBService.saveCustomerOrderNoteInstance(
      noteIntance,
    );
    return {
      done: true,
    };
  }
  async getCustomerOrders(id: string) {
    const ordersRepo = this.OrdersDBService.getOrdersRepo();
    const [orders, total] = await ordersRepo.findAndCount({
      where: {
        customer: {
          id,
        },
      },
      relations: ['status'],
    });
    return {
      orders,
      total,
    };
  }
  async findCustomerOrder(customer_id: string, order_id: string) {
    const order = await this.OrdersDBService.findOneOrder({
      where: {
        id: order_id,
        customer: { id: customer_id },
      },
      relations: ['status', 'customer_order_notes'],
    });
    if (!order) {
      throw new NotFoundException('no order found with those info.');
    }
    return {
      done: true,
      order,
    };
  }
  async addCustomerComment(
    order_id: string,
    customer_id: string,
    note: string,
  ) {
    const order = await this.OrdersDBService.findOneOrder({
      where: {
        id: order_id,
        customer: {
          id: customer_id,
        },
      },
    });
    if (!order) {
      throw new NotFoundException('No order found with those info');
    }
    const noteInstanse =
      this.customerOrderNotesDBService.createCustomerOrderNoteInstance({
        order,
        note,
      });
    await this.customerOrderNotesDBService.saveCustomerOrderNoteInstance(
      noteInstanse,
    );
    return {
      done: true,
    };
  }
  async getSupporterOrders(
    id: string,
    searchwith?: string,
    status?: OrderStatusEnum,
  ) {
    const ordersRepo = this.OrdersDBService.getOrdersRepo();
    const qb = ordersRepo
      .createQueryBuilder('order')
      .leftJoin('order.customer', 'customer')
      .addSelect([
        'customer.id',
        'customer.first_name',
        'customer.last_name',
        'customer.created_at',
      ])
      .leftJoin('order.supporter', 'supporter')
      .where('supporter.id = :id', { id });

    if (searchwith) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('order.company_name ILIKE :termStart', {
            termStart: `${searchwith.toLowerCase()}%`,
          })
            .orWhere('order.company_name ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('order.company_phone ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('order.company_phone ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('order.details ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('order.details ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('customer.first_name ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('customer.first_name ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('customer.last_name ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('customer.last_name ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            });
        }),
      );
    }

    if (status) {
      qb.andWhere('order.curr_status = :status', { status });
    }
    const [orders, total] = await qb
      .orderBy('order.created_at', 'DESC')
      .getManyAndCount();
    return { orders, total };
  }
  async findSupporterOrder(supporter_id: string, order_id: string) {
    const order = await this.OrdersDBService.findOneOrder({
      where: {
        id: order_id,
        supporter: { id: supporter_id },
      },
      relations: ['status', 'customer', 'customer_order_notes'],
      select: {
        status: true,
        customer: {
          id: true,
          first_name: true,
          last_name: true,
          user_name: true,
          phone: true,
          created_at: true,
        },
        customer_order_notes: true,
      },
    });
    if (!order) {
      throw new NotFoundException('no order found with those info.');
    }
    return {
      done: true,
      order,
    };
  }
  async changeOrderStatus(
    supporter_id: string,
    order_id: string,
    { status, note }: ChangeOrderStatusDto,
  ) {
    const order = await this.OrdersDBService.findOneOrder({
      where: {
        id: order_id,
        supporter: {
          id: supporter_id,
        },
      },
    });
    if (!order) {
      throw new NotFoundException('No Order Found With Those Info>');
    }
    if (order.curr_status === status) {
      return {
        done: true,
      };
    }
    const statusIntanse = this.statusDBService.createStatusInstance({
      order,
      status,
      note,
    });
    await this.statusDBService.saveStatus(statusIntanse);
    await this.OrdersDBService.saveOrder({ ...order, curr_status: status });
    return {
      done: true,
    };
  }
  async changePrivOrderStatus(
    supporter_id: string,
    order_id: string,
    private_status: PrivateStatusEnum,
  ) {
    const order = await this.OrdersDBService.findOneOrder({
      where: {
        id: order_id,
        supporter: {
          id: supporter_id,
        },
      },
    });
    if (!order) {
      throw new NotFoundException('No Order Found With Those Info>');
    }
    if (order.private_status === private_status) {
      return {
        done: true,
      };
    }
    await this.OrdersDBService.saveOrder({
      ...order,
      private_status: private_status,
    });
    return {
      done: true,
    };
  }
  async getManagerOrders(searchwith?: string, status?: OrderStatusEnum) {
    const ordersRepo = this.OrdersDBService.getOrdersRepo();
    const qb = ordersRepo
      .createQueryBuilder('order')
      .leftJoin('order.customer', 'customer')
      .addSelect([
        'customer.id',
        'customer.first_name',
        'customer.last_name',
        'customer.created_at',
      ])
      .leftJoin('order.supporter', 'supporter')
      .addSelect([
        'supporter.id',
        'supporter.first_name',
        'supporter.last_name',
      ]);
    if (searchwith) {
      qb.where(
        new Brackets((qb) => {
          qb.where('order.company_name ILIKE :termStart', {
            termStart: `${searchwith.toLowerCase()}%`,
          })
            .orWhere('order.company_name ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('order.company_phone ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('order.company_phone ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('order.details ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('order.details ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('customer.first_name ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('customer.first_name ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('customer.last_name ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('customer.last_name ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('supporter.first_name ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('supporter.first_name ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            })
            .orWhere('supporter.last_name ILIKE :termStart', {
              termStart: `${searchwith.toLowerCase()}%`,
            })
            .orWhere('supporter.last_name ILIKE :termEnd', {
              termEnd: `%${searchwith.toLowerCase()}`,
            });
        }),
      );
    }
    if (status) {
      qb.andWhere('order.curr_status = :status', { status });
    }
    const [orders, total] = await qb
      .orderBy('order.created_at', 'DESC')
      .getManyAndCount();
    return { orders, total };
  }
}
