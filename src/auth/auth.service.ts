import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { CustomersModule } from 'src/customers/customers.module';
import { customerTokenInterface } from 'src/customers/interfaces/customer.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenInterface } from 'src/interfaces/token.Interface';
import { SupportersDBService } from 'src/supporters/DB_Services/supporters_DB.service';
import { Response } from 'express';
import { CustomersDBService } from 'src/customers/DB_services/customers_db.service';
import { ManagersDBService } from 'src/managers/DB_Services/managers_DB.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly customersDBService: CustomersDBService,
    private readonly supportersDBService: SupportersDBService,
    private readonly managersDBService: ManagersDBService,
  ) {}
  async signIn({ user_name, password }: SignInDto, response: Response) {
    const repos = [
      {
        type: 'customer',
        repo: this.customersDBService.getCustomerRepo(),
      },
      {
        type: 'supporter',
        repo: this.supportersDBService.getSupportersRepo(),
      },
      {
        type: 'manager',
        repo: this.managersDBService.getManagersRepo(),
      },
    ];
    let isMatch;
    let userFound;
    for (const repo of repos) {
      const user = await repo.repo.findOne({ where: { user_name } });
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
        userFound = { id: user.id, user_name: user.user_name, role: repo.type };
        break;
      }
    }
    if (!userFound) {
      throw new NotFoundException('User not found.');
    }
    if (userFound && !isMatch) {
      throw new ConflictException('Password is not correct.');
    }
    const access_token = this.generateAccessToken(userFound);
    const refresh_token = this.generateRefreshToken(userFound);
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'high',
    });
    return {
      done: true,
      access_token,
      role: userFound.role,
    };
  }
  async refreshToken(tokenInterface: TokenInterface) {
    console.log('tokenInterface => ', tokenInterface);
    const access_token = this.generateAccessToken(tokenInterface);
    return {
      done: true,
      access_token,
      role: tokenInterface.role,
    };
  }
  private generateAccessToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: '30m',
    });
  }
  private generateRefreshToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: '7d',
    });
  }
}
