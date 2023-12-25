import { ICommand } from '@nestjs/cqrs';
import { Request } from 'express';

export class UpdateUserCommand implements ICommand {
  constructor(
    readonly request: Request,
    readonly userId: string,
    readonly name?: string,
    readonly password?: string,
    readonly phone?: string,
  ) {}
}
