import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from 'common/abstract.entity';
import { UserRank } from 'common/types/userRank';

@Entity('users')
@Index(['email'], { unique: true })
export class UserEntity extends AbstractEntity {
  @Column()
  name: string; // 유저 이름

  @Column({ nullable: false })
  email: string; // 로그인시 사용할 메일 주소

  @Column()
  password: string; // 로그인 비밀번호

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRank,
  })
  rank: UserRank;

  @Column()
  isActivate: boolean;
}
