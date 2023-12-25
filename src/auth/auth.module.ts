import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginUserHandler } from './command/login-user.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'user/user.entity';

const commandHandlers = [LoginUserHandler];

@Module({
  imports: [
    PassportModule.register({ session: true }),
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [LocalStrategy, LocalSerializer, ...commandHandlers],
  controllers: [AuthController],
})
export class AuthModule {}
