import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from 'user/user.entity';
import { SessionUser } from 'common/types/sessionUser';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: UserEntity, done: (err: Error | null, user?: SessionUser) => void): void {
    const { id, name, email, phone, rank, isActivate } = user;
    done(null, { id, name, email, phone, rank, isActivate });
  }

  async deserializeUser(
    user: SessionUser,
    done: (err: Error | null, user?: SessionUser) => void,
  ): Promise<void> {
    done(null, user);
  }
}
