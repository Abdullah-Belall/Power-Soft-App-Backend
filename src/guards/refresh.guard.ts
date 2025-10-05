import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { CustomRequest } from 'src/interfaces/custom-request.interface';

@Injectable()
export class RefreshGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const refreshToken = context.switchToHttp().getRequest<CustomRequest>()
      .cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    try {
      const verfiy: any = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      );
      delete verfiy.iat;
      delete verfiy.exp;
      if (verfiy) {
        context.switchToHttp().getRequest<CustomRequest>().user = verfiy;
        return true;
      }
      throw new UnauthorizedException('Invaild Token.');
    } catch {
      throw new UnauthorizedException('Invaild Token.');
    }
  }
}
