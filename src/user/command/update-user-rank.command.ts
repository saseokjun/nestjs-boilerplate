import { ICommand } from '@nestjs/cqrs';
import { UserRank } from 'common/types/userRank';

export class UpdateUserRankCommand implements ICommand {
  constructor(
    readonly userId: string,
    readonly rank: UserRank,
    readonly myRank: UserRank,
  ) {}
}
