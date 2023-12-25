import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './user.controller';
import { CreateUserHandler } from './command/create-user.handler';
import { GetUserHandler } from './query/get-user.handler';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApproveUserHandler } from './command/approve-user.handler';
import { UpdateUserRankHandler } from './command/update-user-rank.handler';
import { UpdateUserHandler } from './command/update-user.handler';
import { DeleteUserHandler } from './command/delete-user.handler';
import { UserUpdatedEventHandler } from './event/user-updated.event.handler';
import { UserDeletedEventHandler } from './event/user-deleted.event.handler';

const commandHandlers = [
  CreateUserHandler,
  ApproveUserHandler,
  UpdateUserHandler,
  UpdateUserRankHandler,
  DeleteUserHandler,
];

const queryHandlers = [GetUserHandler];

const eventHandlers = [UserUpdatedEventHandler, UserDeletedEventHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers],
})
export class UserModule {}
