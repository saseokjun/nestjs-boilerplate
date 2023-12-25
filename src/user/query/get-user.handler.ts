import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'user/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async execute(
    query: GetUserQuery,
  ): Promise<Omit<UserEntity, 'password' | 'createAt' | 'updateAt'>> {
    const { userId: id } = query;

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    const { password, createAt, updateAt, ...rest } = user;

    return {
      ...rest,
    };
  }
}
