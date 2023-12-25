import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ActivateGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest().user;
    if (!user.isActivate) {
      throw new UnauthorizedException('User is not activated');
    }
    return true;
  }
}
