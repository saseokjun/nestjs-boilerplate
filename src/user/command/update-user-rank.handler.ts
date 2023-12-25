import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'user/user.entity';
import { UpdateUserRankCommand } from './update-user-rank.command';
import { UserRank } from 'common/types/userRank';

@Injectable()
@CommandHandler(UpdateUserRankCommand)
export class UpdateUserRankHandler implements ICommandHandler<UpdateUserRankCommand> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
  async execute(command: UpdateUserRankCommand) {
    const { userId: id, rank, myRank } = command;

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Cannot find user');
    }

    if (rank > myRank) {
      throw new BadRequestException('Cannot change to a higher rank than your own');
    }

    return await this.userRepository.update(id, {
      rank,
    });
  }
}
