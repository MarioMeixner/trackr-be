import { ApiProperty } from '@nestjs/swagger';
import { Track } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export class TrackEntity implements Track {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  startTime: string | null;

  @ApiProperty({ required: false, nullable: true })
  endTime: string | null;

  @ApiProperty()
  duration: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ type: UserEntity })
  author: UserEntity;

  @ApiProperty()
  authorId: string;

  constructor(input: Partial<TrackEntity> | null) {
    if (input) {
      const { author, ...data } = input;
      Object.assign(this, data);

      if (author) {
        this.author = new UserEntity(author);
      }
    }
  }
}
