import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumList: AlbumEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumList = [];
    for(let i = 0; i < 5; i++){
      const album = await repository.save({
        nombre: faker.lorem.sentence(),
        fecha_lanzamiento: new Date(),
        caratula: faker.image.url(),
        descripcion: faker.lorem.sentence()
      });
      albumList.push(album);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // create test
  it('should create an album', async () => {
    const album = {
      id:"",
      nombre: faker.lorem.sentence(),
      fecha_lanzamiento: new Date(),
      caratula: faker.image.url(),
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }
    const newAlbum = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum = await repository.findOne({where: {id: newAlbum.id}});
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.nombre).toEqual(album.nombre);
    expect(storedAlbum.fecha_lanzamiento).toEqual(album.fecha_lanzamiento);
    expect(storedAlbum.caratula).toEqual(album.caratula);
    expect(storedAlbum.descripcion).toEqual(album.descripcion);
  });

  // create test empty description error
  it('should throw an error when creating an album with empty description', async () => {
    const album = {
      id:"",
      nombre: faker.lorem.sentence(),
      fecha_lanzamiento: new Date(),
      caratula: faker.image.url(),
      descripcion: "",
      tracks: [],
      performers: []
    }
    await expect(() => service.create(album)).rejects.toHaveProperty('La descripción no puede estar vacía');
  });
});
