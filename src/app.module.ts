import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { PerformerModule } from './performer/performer.module';
import { AlbumEntity } from './album/album.entity';
import { TrackEntity } from './track/track.entity';
import { PerformerEntity } from './performer/performer.entity';
import { PerformerAlbumModule } from './performer-album/performer-album.module';



@Module({
  imports: [ AlbumModule, TrackModule, PerformerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'pacialb2',
      entities: [AlbumEntity, TrackEntity, PerformerEntity], 
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    PerformerAlbumModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
