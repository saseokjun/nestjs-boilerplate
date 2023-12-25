import { ICommand } from '@nestjs/cqrs';

export class ApproveUserCommand implements ICommand {
  constructor(readonly userId: string) {}
}
