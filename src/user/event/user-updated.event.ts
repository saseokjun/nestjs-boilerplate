import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from 'user/user.entity';
import { Request } from 'express';

export class UserUpdatedEvent implements IEvent {
  constructor(
    readonly user: UserEntity,
    readonly request: Request,
  ) {}
}
