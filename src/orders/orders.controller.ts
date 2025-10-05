import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { TokenInterface } from 'src/interfaces/token.Interface';
import { User } from 'src/decoratores/user.decorator';
import { CustomerGuard } from 'src/guards/customer.guard';
import { AddCustomerNoteDto } from './dto/add-customer-note.dto';
import { SupporterGuard } from 'src/guards/supporter.guard';
import { OrderStatusEnum } from './enums/order_enums';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { ChangePrivStatusDto } from './dto/change-priv-status.dto';
import { ManagerGuard } from 'src/guards/manager.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @UseGuards(CustomerGuard)
  @Post('create')
  async createOrder(
    @User() user: TokenInterface,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.createOrder(user, createOrderDto);
  }

  @UseGuards(CustomerGuard)
  @Get(':id/customer')
  async findCustomerOrder(
    @User() { id }: TokenInterface,
    @Param('id') order_id: string,
  ) {
    return await this.ordersService.findCustomerOrder(id, order_id);
  }

  @UseGuards(CustomerGuard)
  @Get('customer')
  async getCustomerOrders(@User() { id }: TokenInterface) {
    return await this.ordersService.getCustomerOrders(id, 'customer');
  }

  @UseGuards(CustomerGuard)
  @Post(':id/note')
  async addCustomerComment(
    @User() { id }: TokenInterface,
    @Param('id') order_id: string,
    @Body() { note }: AddCustomerNoteDto,
  ) {
    return await this.ordersService.addCustomerComment(order_id, id, note);
  }

  @UseGuards(SupporterGuard)
  @Get('supporter')
  async getSupporterOrders(
    @User() { id }: TokenInterface,
    @Query('status') status: OrderStatusEnum,
    @Query('searchwith') searchwith: string,
  ) {
    return await this.ordersService.getSupporterOrders(id, searchwith, status);
  }

  @UseGuards(ManagerGuard)
  @Get('manager')
  async getManagerOrders(
    @Query('status') status: OrderStatusEnum,
    @Query('searchwith') searchwith: string,
  ) {
    return await this.ordersService.getManagerOrders(searchwith, status);
  }

  @UseGuards(SupporterGuard)
  @Get(':id/supporter')
  async findSupporterOrder(
    @User() { id }: TokenInterface,
    @Param('id') order_id: string,
  ) {
    return await this.ordersService.findSupporterOrder(id, order_id);
  }

  @UseGuards(SupporterGuard)
  @Post(':id/change-status')
  async ChangeOrderStatus(
    @User() { id }: TokenInterface,
    @Param('id') order_id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return await this.ordersService.changeOrderStatus(
      id,
      order_id,
      changeOrderStatusDto,
    );
  }

  @UseGuards(SupporterGuard)
  @Post(':id/change-private-status')
  async changePrivOrderStatus(
    @User() { id }: TokenInterface,
    @Param('id') order_id: string,
    @Body() changeOrderStatusDto: ChangePrivStatusDto,
  ) {
    return await this.ordersService.changePrivOrderStatus(
      id,
      order_id,
      changeOrderStatusDto.private_status,
    );
  }
  @UseGuards(ManagerGuard)
  @Get('customer/:id')
  async getCustomerOrdersForManager(@Param('id') id: string) {
    return await this.ordersService.getCustomerOrders(id, 'manager');
  }
}
