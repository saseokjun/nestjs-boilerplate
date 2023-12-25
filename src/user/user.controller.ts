import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRank } from 'common/types/userRank';
import { CreateUserCommand } from './command/create-user.command';
import { Request, Response } from 'express';
import { HttpDecorator } from 'decorators/http.decorator';
import { ApproveUserCommand } from './command/approve-user.command';
import { GetUserQuery } from './query/get-user.query';
import { UpdateUserCommand } from './command/update-user.command';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRankCommand } from './command/update-user-rank.command';
import { DeleteUserCommand } from './command/delete-user.command';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @HttpCode(201)
  @ApiOperation({
    summary: '가입 신청',
  })
  @Post('/register')
  async createUser(@Body() dto: CreateUserDto) {
    const { name, email, password, phone } = dto;
    const command = new CreateUserCommand(name, email, password, phone);
    return await this.commandBus.execute(command);
  }

  @ApiOperation({
    summary: '회원 승인',
  })
  @HttpDecorator(UserRank.MANAGER)
  @Patch('/approve/:userId')
  async approveUser(@Param('userId') userId: string) {
    const command = new ApproveUserCommand(userId);
    return await this.commandBus.execute(command);
  }

  @Get('/me')
  @HttpDecorator(UserRank.MEMBER)
  async getMe(@Req() req: Request) {
    // 내 정보 가져오기. 세션에 저장된 값을 불러옴
    return {
      ...req.user,
    };
  }

  @ApiOperation({
    summary: '회원 정보 가져오기',
  })
  @HttpDecorator(UserRank.MANAGER)
  @Get('/:userId')
  async getUser(@Param('userId') userId: string) {
    const query = new GetUserQuery(userId);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({
    summary: '내 정보 변경',
  })
  @HttpDecorator(UserRank.MEMBER)
  @Patch('/me')
  async updateMe(@Body() dto: UpdateUserDto, @Req() request: Request) {
    const myId = request.user.id;
    const { name, password, phone } = dto;
    const command = new UpdateUserCommand(request, myId, name, password, phone);
    return await this.commandBus.execute(command);
  }

  @ApiOperation({
    summary: '회원 정보 변경',
  })
  @HttpDecorator(UserRank.MANAGER)
  @Patch('/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const { name, password, phone } = dto;
    const command = new UpdateUserCommand(request, userId, name, password, phone);
    return await this.commandBus.execute(command);
  }

  @ApiOperation({
    summary: '회원 등급 변경',
  })
  @HttpDecorator(UserRank.OWNER)
  @Patch('/:userId/rank')
  async updateUserRank(
    @Param('userId') userId: string,
    @Body() dto: { rank: UserRank },
    @Req() request: Request,
  ) {
    const { rank } = dto;
    const myRank = request.user.rank;
    const command = new UpdateUserRankCommand(userId, rank, myRank);
    return await this.commandBus.execute(command);
  }

  // TODO: 비밀번호 찾기

  @ApiOperation({
    summary: '회원 탈퇴(본인계정)',
  })
  @HttpDecorator(UserRank.MEMBER)
  @Delete('/me')
  async deleteMe(@Req() request: Request) {
    const myId = request.user.id;
    const command = new DeleteUserCommand(myId);
    await this.commandBus.execute(command);

    return Redirect('/auth/logout', 302);
  }

  @ApiOperation({
    summary: '회원 탈퇴(타인계정)',
  })
  @HttpDecorator(UserRank.MANAGER)
  @Delete('/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const command = new DeleteUserCommand(userId);
    return await this.commandBus.execute(command);
  }
}
