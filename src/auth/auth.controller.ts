import { Controller, Post, UseGuards, Req, Get, Res, HttpCode, Redirect } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionUser } from 'common/types/sessionUser';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: '로그인',
  })
  @Post('login')
  async login(@Req() req: Request): Promise<SessionUser> {
    return req.user;
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    request.logout((err: Error) => {
      if (err) {
        throw err;
      } else {
        response.clearCookie('connect.sid'); // {httpOnly: true}
        request.session.destroy((err: Error) => {
          if (err) {
            throw err;
          }
          return Redirect('/', 302);
        });
      }
    });
  }
}
