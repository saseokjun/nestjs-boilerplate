import { UseGuards, applyDecorators } from '@nestjs/common';
import { UserRank } from 'common/types/userRank';
import { Rank } from './rank.decorator';
import { AuthenticatedGuard } from 'guards/authenticated.guard';
import { RankGuard } from 'guards/rank.guard';
import { ActivateGuard } from 'guards/activate.guard';

export function HttpDecorator(rank: UserRank): MethodDecorator {
  return applyDecorators(Rank(rank), UseGuards(AuthenticatedGuard, ActivateGuard, RankGuard));
}
