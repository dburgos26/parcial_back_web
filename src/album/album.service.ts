import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from './album.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AlbumService {

    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
        ) { }

    DESCRIOTION_NOT_EMPTY = 'La descripción no puede estar vacía';
    NAME_NOT_EMPTY = 'El nombre no puede estar vacío';
    ALBUM_NOT_FOUND = 'El album no existe';

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({ relations: ['tracks', 'performers'] });
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({where:{id}, relations: ['tracks', 'performers'] });
        if (!album) {
            throw new BusinessLogicException(this.ALBUM_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        return album;
    }

    async create(album: AlbumEntity): Promise<AlbumEntity> {
        if (!album.nombre) {
            throw new BusinessLogicException(this.NAME_NOT_EMPTY, BusinessError.BAD_REQUEST);
        }
        if (!album.descripcion) {
            throw new BusinessLogicException(this.DESCRIOTION_NOT_EMPTY, BusinessError.BAD_REQUEST);
        }
        return await this.albumRepository.save(album);
    }

    async delete(id: string){
        const album = await this.albumRepository.findOne({where:{id}});
        if (!album) {
            throw new BusinessLogicException(this.ALBUM_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        if (album.tracks !== undefined){
            if(album.tracks.length > 0){
                throw new BusinessLogicException('El album tiene tracks asociados', BusinessError.BAD_REQUEST);
            }
        }
        return await this.albumRepository.delete(album);
    }


}
