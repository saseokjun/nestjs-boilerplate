import { Controller, Post, UseGuards, Req, Get, Res, HttpCode, Redirect } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRank } from 'common/types/userRank';
import { HttpDecorator } from 'decorators/http.decorator';

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
  async login() {
    return Redirect('/', 302);
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
