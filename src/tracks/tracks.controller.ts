import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @ApiCreatedResponse({ type: TrackEntity })
  async create(@Body() createTrackDto: CreateTrackDto) {
    return new TrackEntity(await this.tracksService.create(createTrackDto));
  }

  @Get()
  @ApiOkResponse({ type: TrackEntity, isArray: true })
  async findAll() {
    const tracks = await this.tracksService.findAll();
    return tracks.map((track) => new TrackEntity(track));
  }

  @Get(':id')
  @ApiOkResponse({ type: TrackEntity })
  async findOne(@Param('id') id: string) {
    return new TrackEntity(await this.tracksService.findOne(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: TrackEntity })
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return new TrackEntity(await this.tracksService.update(id, updateTrackDto));
  }

  @Delete(':id')
  @ApiOkResponse({ type: TrackEntity })
  async remove(@Param('id') id: string) {
    return new TrackEntity(await this.tracksService.remove(id));
  }
}
