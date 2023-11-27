import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AlbumPerformerService {

    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,

        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
    ) { }
    
    ALBUM_NOT_FOUND = 'El album no existe';
    PERFORMER_NOT_FOUND = 'El performer no existe';
    MAX_PERFORMERS = 3;
    MAX_PERFORMERS_ERROR = 'No se pueden asignar más de 3 performers a un album';

    async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({where:{id:albumId}});
        if (!album) {
            throw new BusinessLogicException(this.ALBUM_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        const performer = await this.performerRepository.findOne({where:{id:performerId}});
        if (!performer) {
            throw new BusinessLogicException(this.PERFORMER_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        if (album.performers === undefined) {
            album.performers = [];
        }
        if (album.performers.length >= this.MAX_PERFORMERS) {
            throw new BusinessLogicException(this.MAX_PERFORMERS_ERROR, BusinessError.BAD_REQUEST);
        }
        album.performers.push(performer);
        return await this.albumRepository.save(album);
    }

}
