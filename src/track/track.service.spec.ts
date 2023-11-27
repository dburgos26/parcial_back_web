import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AlbumEntity } from '../album/album.entity';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let album: AlbumEntity;
  let trackList: TrackEntity[] = [];

  let POSITIVE_DURATION = 'La duración debe ser positiva';
  let TRACK_NOT_FOUND = 'La canción no existe';
  let ALBUM_NOT_FOUND = 'El album no existe';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    trackList = [];
    album = await albumRepository.save({
      nombre: faker.lorem.sentence(),
      fecha_lanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    });
    for(let i = 0; i < 5; i++){
      const track = await repository.save({
        nombre: faker.lorem.sentence(),
        duracion: faker.number.int(),
        album: album
      });
      trackList.push(track);
    }
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a track', async () => {
    const track = {
      id:"",
      nombre: faker.lorem.sentence(),
      duracion: faker.number.int(),
      album: album
    }
    const newTrack = await service.create(track);
    expect(newTrack).not.toBeNull();

    const storedTrack = await repository.findOne({where: {id: newTrack.id}});
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.nombre).toEqual(track.nombre);
    expect(storedTrack.duracion).toEqual(track.duracion);
  });

  it('should throw an error when creating a track with negative duration', async () => {
    const track = {
      id:"",
      nombre: faker.lorem.sentence(),
      duracion: -1,
      album: album
    }
    await expect(service.create(track)).rejects.toHaveProperty('message',POSITIVE_DURATION);
  });

  it('should throw an error when creating a track with empty album', async () => {
    const album = {
      id:"0",
      nombre: faker.lorem.sentence(),
      fecha_lanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }
    const track = {
      id:"",
      nombre: faker.lorem.sentence(),
      duracion: faker.number.int(),
      album: album
    }
    await expect(service.create(track)).rejects.toHaveProperty('message',ALBUM_NOT_FOUND);
  });

  it('should find all tracks', async () => {
    const tracks = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks.length).toEqual(trackList.length);
  });

  it('should find one track', async () => {
    const track = await service.findOne(trackList[0].id);
    expect(track).not.toBeNull();
    expect(track.id).toEqual(trackList[0].id);
  });

  it('should throw an error when finding a track that does not exist', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty('message',TRACK_NOT_FOUND);
  });


});
