import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PerformerEntity } from './performer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerformerService {

    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,
    ) { }

    MAX_DESCRIPTION_LENGTH = 100;
    MAX_DESCRIPTION_LENGTH_ERROR = 'La descripción no puede superar los 100 caracteres';
    ALBUM_NOT_FOUND = 'El album no existe';

    async findAll(): Promise<PerformerEntity[]> {
        return await this.performerRepository.find({ relations: ['album'] });
    }

    async findOne(id: string): Promise<PerformerEntity> {
        const performer = await this.performerRepository.findOne({ where: { id }, relations: ['album'] });
        if (!performer) {
            throw new BusinessLogicException(this.ALBUM_NOT_FOUND, BusinessError.NOT_FOUND);
        }
        return performer;
    }

    async create(performer: PerformerEntity): Promise<PerformerEntity> {
        if (performer.descripcion.length > this.MAX_DESCRIPTION_LENGTH) {
            throw new BusinessLogicException(this.MAX_DESCRIPTION_LENGTH_ERROR, BusinessError.BAD_REQUEST);
        }
        return await this.performerRepository.save(performer);
    }
}
