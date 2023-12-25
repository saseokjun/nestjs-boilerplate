import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'user/user.entity';
import { UpdateUserCommand } from './update-user.command';
import { UserUpdatedEvent } from 'user/event/user-updated.event';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}
  async execute(command: UpdateUserCommand) {
    const { request, userId: id, name, password, phone } = command;

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Cannot find user');
    }
    let newName = user.name;
    let newPassword = user.password;
    let newPhone = user.phone;

    if (name) {
      newName = name;
    }
    if (password) {
      newPassword = await bcrypt.hash(password, 12);
    }
    if (phone) {
      newPhone = phone;
    }

    await this.userRepository.update(id, {
      name: newName,
      password: newPassword,
      phone: newPhone,
    });

    if (request.user.id === id) {
      // 내 정보가 변경된 경우 세션 업데이트 이벤트 실행
      const me = await this.userRepository.findOneBy({ id });
      this.eventBus.publish(new UserUpdatedEvent(me, request));
    }
  }
}
