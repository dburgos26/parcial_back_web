import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ //llenar con los modulos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'pacialb2',
      entities: [], //llenar
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
