import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRank } from 'common/types/userRank';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserCommand } from './command/update-user.command';
import { UpdateUserRankCommand } from './command/update-user-rank.command';
import { DeleteUserCommand } from './command/delete-user.command';
import { ApproveUserCommand } from './command/approve-user.command';
import { GetUserQuery } from './query/get-user.query';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  const mockUsers: UserEntity[] = [
    {
      id: '1e79693e-5b5c-4463-99d3-36ddf02c4936',
      name: 'owner',
      email: 'owner@example.com',
      phone: '01022222222',
      rank: UserRank.OWNER,
      password: bcrypt.hashSync('1q2w3e4r', 12),
      isActivate: true,
      createAt: new Date(),
      updateAt: new Date(),
    },
    {
      id: 'eeca5e75-a9c9-4453-9273-c5e90c76ea6d',
      name: 'manager',
      email: 'manager@example.com',
      phone: '01033333333',
      rank: UserRank.MANAGER,
      password: bcrypt.hashSync('1q2w3e4r', 12),
      isActivate: true,
      createAt: new Date(),
      updateAt: new Date(),
    },
    {
      id: '2b30c3ef-fedc-4b98-bf35-d27f3a07681e',
      name: 'member',
      email: 'member@example.com',
      phone: '01044444444',
      rank: UserRank.MEMBER,
      password: bcrypt.hashSync('1q2w3e4r', 12),
      isActivate: true,
      createAt: new Date(),
      updateAt: new Date(),
    },
    {
      id: '167f91ca-c9cc-46d3-a0f1-e0f6572f0177',
      name: 'member2',
      email: 'member2@example.com',
      phone: '01055555555',
      rank: UserRank.MEMBER,
      password: bcrypt.hashSync('1q2w3e4r', 12),
      isActivate: false,
      createAt: new Date(),
      updateAt: new Date(),
    },
  ];
  const request = {
    user: {
      id: 'beb1b939-223b-4033-b83f-445729d42ef2',
      name: 'admin',
      email: 'admin@example.com',
      phone: '01011111111',
      rank: UserRank.ADMIN,
      isActivate: true,
    },
  } as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        CommandBus,
        QueryBus,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn((query) => {
              console.log(query);
              const user = mockUsers.find((u) => u.id === query.id);
              if (!user) {
                throw new NotFoundException();
              }
              console.log(user);
              return user;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'password',
        phone: '01012345678',
      };

      const commandBusExecuteSpy = jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await controller.createUser(createUserDto);

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new CreateUserCommand(
          createUserDto.name,
          createUserDto.email,
          createUserDto.password,
          createUserDto.phone,
        ),
      );
    });
  });

  describe('approveUser', () => {
    it('should approve a user', async () => {
      const commandBusExecuteSpy = jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await controller.approveUser('167f91ca-c9cc-46d3-a0f1-e0f6572f0177');

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new ApproveUserCommand('167f91ca-c9cc-46d3-a0f1-e0f6572f0177'),
      );
    });
  });

  describe('getMe', () => {
    it('should get the current user', async () => {
      const expectedResult = {
        id: 'beb1b939-223b-4033-b83f-445729d42ef2',
        name: 'admin',
        email: 'admin@example.com',
        phone: '01011111111',
        rank: UserRank.ADMIN,
        isActivate: true,
      };
      const expectedResponse = { ...expectedResult };

      jest.spyOn(controller, 'getMe').mockReturnValueOnce(Promise.resolve(expectedResult));

      const result = await controller.getMe(request);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getUser', () => {
    it('should get a user', async () => {
      const queryBusExecuteSpy = jest.spyOn(queryBus, 'execute').mockResolvedValueOnce({});

      const result = await controller.getUser('2b30c3ef-fedc-4b98-bf35-d27f3a07681e');

      expect(queryBusExecuteSpy).toHaveBeenCalledWith(
        new GetUserQuery('2b30c3ef-fedc-4b98-bf35-d27f3a07681e'),
      );

      expect(result).toEqual({
        id: '2b30c3ef-fedc-4b98-bf35-d27f3a07681e',
        name: 'member',
        email: 'member@example.com',
        phone: '01044444444',
        rank: UserRank.MEMBER,
        isActivate: true,
        createAt: new Date(),
        updateAt: new Date(),
      });
    });
  });

  describe('updateMe', () => {
    it('should update the current user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: undefined,
        password: undefined,
        phone: '01012345678',
      };

      const commandBusExecuteSpy = jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await controller.updateMe(updateUserDto, request);

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new UpdateUserCommand(
          request,
          'beb1b939-223b-4033-b83f-445729d42ef2',
          updateUserDto.name,
          updateUserDto.password,
          updateUserDto.phone,
        ),
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'test',
        password: 'newpassword',
        phone: '01098765432',
      };

      const commandBusExecuteSpy = jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await controller.updateUser('1e79693e-5b5c-4463-99d3-36ddf02c4936', updateUserDto, request);

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new UpdateUserCommand(
          request,
          '1e79693e-5b5c-4463-99d3-36ddf02c4936',
          updateUserDto.name,
          updateUserDto.password,
          updateUserDto.phone,
        ),
      );
    });
  });

  describe('updateUserRank', () => {
    it('should update the rank of a user', async () => {
      const commandBusExecuteSpy = jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await controller.updateUserRank(
        'eeca5e75-a9c9-4453-9273-c5e90c76ea6d',
        { rank: UserRank.MANAGER },
        request,
      );

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new UpdateUserRankCommand(
          'eeca5e75-a9c9-4453-9273-c5e90c76ea6d',
          UserRank.MANAGER,
          UserRank.OWNER,
        ),
      );
    });
  });

  describe('deleteMe', () => {
    it('should delete the current user', async () => {
      const commandBusExecuteSpy = jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await controller.deleteMe(request);

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new DeleteUserCommand('beb1b939-223b-4033-b83f-445729d42ef2'),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const commandBusExecuteSpy = jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({});

      await controller.deleteUser('2b30c3ef-fedc-4b98-bf35-d27f3a07681e');

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new DeleteUserCommand('2b30c3ef-fedc-4b98-bf35-d27f3a07681e'),
      );
    });
  });
});
