import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ default: new Date() })
  date: Date;

  @ApiProperty({ required: false })
  startTime: string;

  @ApiProperty({ required: false })
  endTime: string;

  @ApiProperty()
  duration: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty()
  authorId: string;
}
