import { SessionUser } from 'common/types/sessionUser';
import session from 'express-session';
import { Request } from 'express';

declare module 'express-session' {
  export interface SessionData {
    passport?: {
      user: SessionUser;
    };
  }
}
