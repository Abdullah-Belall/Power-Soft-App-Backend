import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import type { Response } from 'express';
import { User } from 'src/decoratores/user.decorator';
import type { TokenInterface } from 'src/interfaces/token.Interface';
import { RefreshGuard } from 'src/guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-in')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(signInDto, response);
  }
  @UseGuards(RefreshGuard)
  @Get('refresh-token')
  async refreshToken(@User() tokenInterface: TokenInterface) {
    console.log(tokenInterface);
    return await this.authService.refreshToken(tokenInterface);
  }
}
