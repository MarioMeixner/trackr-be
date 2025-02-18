import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity | null>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  email: string;

  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @Exclude()
  password: string | null;

  @Exclude()
  refreshToken: string | null;
}
