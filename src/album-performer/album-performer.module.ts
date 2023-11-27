import { Module } from '@nestjs/common';
import { AlbumPerformerService } from './album-performer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumEntity } from '../album/album.entity';
import { AlbumPerformerController } from './album-performer.controller';

@Module({
  providers: [AlbumPerformerService],
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])],
  controllers: [AlbumPerformerController],
})
export class AlbumPerformerModule {}
