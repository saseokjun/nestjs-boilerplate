import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserRank } from 'common/types/userRank';
import { UserEntity } from 'user/user.entity';

@Injectable()
export class RankGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rank = this.reflector.get<UserRank>('rank', context.getHandler());

    if (rank > 0) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();
    const user = <UserEntity>req.user;

    return Number(rank) <= Number(user.rank); // 유저 권한이 실행 가능 권한보다 크거나 같으면 true
  }
}
