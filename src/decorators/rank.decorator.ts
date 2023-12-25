import { SetMetadata } from '@nestjs/common';
import { UserRank } from 'common/types/userRank';

export const Rank = (...rank: UserRank[]) => SetMetadata('rank', rank);
