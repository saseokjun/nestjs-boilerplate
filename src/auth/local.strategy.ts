import { BadRequestException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { LoginUserCommand } from 'auth/command/login-user.command';
import { CommandBus } from '@nestjs/cqrs';
import { SessionUser } from 'common/types/sessionUser';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private commandBus: CommandBus) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<SessionUser> {
    const command = new LoginUserCommand(email, password);

    const user = await this.commandBus.execute(command);
    if (!user) {
      throw new BadRequestException();
    }
    const { password: pwd, createAt, updateAt, company, ...rest } = user;
    return rest;
  }
}
