import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomRequest } from 'src/interfaces/custom-request.interface';

@Injectable()
export class SupporterGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest<CustomRequest>().user;
    if (user && user.role === 'supporter') {
      return true;
    }
    return false;
  }
}
