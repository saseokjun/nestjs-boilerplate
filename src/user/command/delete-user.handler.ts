import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { Repository } from 'typeorm';
import { UserEntity } from 'user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRank } from 'common/types/userRank';

@Injectable()
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async execute(command: DeleteUserCommand) {
    const { userId: id } = command;

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Cannot find user');
    }

    if (user.rank > UserRank.MEMBER) {
      // 관리자 계정은 바로 삭제하지 않고 비활성화 처리함
      await this.userRepository.update(id, { isActivate: false });
    } else {
      await this.userRepository.delete({ id });
    }
  }
}
