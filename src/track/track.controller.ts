import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { TrackDto } from './track.dto';


@Controller('track')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {

    constructor(private readonly trackService: TrackService) { }

    @Get()
    async findAll() {
        return await this.trackService.findAll();
    }

    @Get(':trackId')
    async findOne(@Param('trackId') trackId: string) {
        return await this.trackService.findOne(trackId);
    }

    @Post()
    async create(@Body() trackDto: TrackDto) {
        const track = plainToInstance(TrackEntity, trackDto);
        return await this.trackService.create(track);
    }

}
