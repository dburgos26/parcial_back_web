import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { TrackEntity } from './track.entity';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';

@Injectable()
export class TrackService {

    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,

        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
    ) { }
    
    POSITIVE_DURATION = 'La duración debe ser positiva';
    TRACK_NOT_FOUND = 'La canción no existe';
    ALBUM_NOT_FOUND = 'El album no existe';

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: ['album'] });
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track = await this.trackRepository.findOne({ where: { id }, relations: ['album'] });
        if (!track) {
            throw new BusinessLogicException(this.TRACK_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        return track;
    }

    async create(track: TrackEntity): Promise<TrackEntity> {
        if (track.duracion < 0) {
            throw new BusinessLogicException(this.POSITIVE_DURATION, BusinessError.BAD_REQUEST);
        }
        const album = await this.albumRepository.findOne({where:{id:track.album.id}});
        if (!album) {
            throw new BusinessLogicException(this.ALBUM_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        return await this.trackRepository.save(track);
    }
}
