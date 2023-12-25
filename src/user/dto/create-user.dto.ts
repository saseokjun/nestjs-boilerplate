import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRank } from 'common/types/userRank';

export class CreateUserDto {
  @ApiProperty({ description: '이름', example: '홍길동' })
  @Transform((params) => params.value.trim())
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[가-힣A-z ]{2,20}$/)
  readonly name: string;

  @ApiProperty({ description: '이메일(로그인시 사용)', example: 'mail@gmail.com' })
  @Transform((params) => params.value.trim())
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @ApiProperty({ description: '로그인 비밀번호', example: 'password' })
  @Transform((params) => params.value.trim())
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: '휴대폰번호', example: '01012345678' })
  @Transform((params) => params.value.trim())
  @IsString()
  @Matches(/\d{10,11}/)
  readonly phone: string;
}
