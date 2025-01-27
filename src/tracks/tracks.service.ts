import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}
  create(createTrackDto: CreateTrackDto) {
    return this.prisma.track.create({
      data: createTrackDto,
    });
  }

  findAll() {
    return this.prisma.track.findMany();
  }

  findOne(id: string) {
    return this.prisma.track.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    return this.prisma.track.update({ where: { id }, data: updateTrackDto });
  }

  remove(id: string) {
    return this.prisma.track.delete({ where: { id } });
  }
}
