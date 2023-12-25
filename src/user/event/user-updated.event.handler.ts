import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserUpdatedEvent } from './user-updated.event';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedEventHandler implements IEventHandler<UserUpdatedEvent> {
  constructor() {}

  async handle(event: UserUpdatedEvent) {
    const { user, request } = event;
    const { password, createAt, updateAt, ...rest } = user;

    // request.user = { ...rest };
    request.session.passport.user = { ...rest };
  }
}
