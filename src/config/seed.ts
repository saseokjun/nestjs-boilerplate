import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from 'user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRank } from 'common/types/userRank';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    const repository = dataSource.getRepository(UserEntity);
    await repository.insert({
      name: process.env.ADMIN_NAME,
      password: hashedPassword,
      email: process.env.ADMIN_EMAIL,
      phone: process.env.ADMIN_PHONE,
      rank: UserRank.ADMIN,
      isActivate: true,
    });
  }
}
