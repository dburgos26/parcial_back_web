import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { AlbumDto } from './album.dto';

@Controller('album')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {

    constructor(private readonly albumService: AlbumService) { }

    @Get()
    async findAll() {
        return await this.albumService.findAll();
    }

    @Get(':albumId')
    async findOne(@Param('albumId') albumId: string) {
        return await this.albumService.findOne(albumId);
    }

    @Post()
    async create(@Body() albumDto: AlbumDto) {
        const album = plainToInstance(AlbumEntity, albumDto);
        return await this.albumService.create(album);
    }

    @Delete(':albumId')
    @HttpCode(204)
    async delete(@Param('albumId') albumId: string) {
        return await this.albumService.delete(albumId);
    }

}
