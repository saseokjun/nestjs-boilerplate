import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApproveUserCommand } from './approve-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'user/user.entity';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
@CommandHandler(ApproveUserCommand)
export class ApproveUserHandler implements ICommandHandler<ApproveUserCommand> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
  async execute(command: ApproveUserCommand) {
    const { userId: id } = command;

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Cannot find user');
    }

    await this.userRepository.update(id, { isActivate: true });
  }
}
