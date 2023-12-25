import { UserEntity } from 'user/user.entity';

export type SessionUser = Pick<
  UserEntity,
  'id' | 'name' | 'email' | 'phone' | 'rank' | 'isActivate'
>;
