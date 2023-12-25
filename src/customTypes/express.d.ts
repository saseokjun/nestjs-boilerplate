import { SessionUser } from 'common/types/sessionUser';

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}
