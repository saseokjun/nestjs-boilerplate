import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'user/user.entity';

@Injectable()
@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
  async execute(command: LoginUserCommand) {
    const { email, password } = command;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException();
    }
    const isValidate = await bcrypt.compare(password, user.password);
    if (!isValidate) {
      throw new BadRequestException();
    }

    if (!user.isActivate) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
