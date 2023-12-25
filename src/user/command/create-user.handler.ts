import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'user/user.entity';
import { UserRank } from 'common/types/userRank';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
  async execute(command: CreateUserCommand) {
    const { name, email, password, phone } = command;

    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.userRepository.save({
      id: uuid(),
      name,
      password: hashedPassword,
      email,
      phone,
      rank: UserRank.MEMBER, // 처음 생성시 등급은 MEMBER
      isActivate: false, // 처음 생성시에는 비활성계정
    });
  }
}
