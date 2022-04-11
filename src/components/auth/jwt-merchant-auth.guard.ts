import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { USERROLE } from '../../enum/user/userrole.enum';

@Injectable()
export class JwtMerchantAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();
        return USERROLE.merchant == user.role;
      }
}
