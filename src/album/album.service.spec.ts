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
        fecha_lanzamiento: faker.date.past(),
        caratula: faker.image.url(),
        descripcion: faker.lorem.sentence()
      });
      albumList.push(album);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an album', async () => {
    const album = {
      id:"",
      nombre: faker.lorem.sentence(),
      fecha_lanzamiento: faker.date.past(),
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

  it('should throw an error when creating an album with empty description', async () => {
    const album = {
      id:"",
      nombre: faker.lorem.sentence(),
      fecha_lanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      descripcion: "",
      tracks: [],
      performers: []
    }
    await expect(() => service.create(album)).rejects.toHaveProperty('message','La descripción no puede estar vacía');
  });

  it('should throw an error when creating an album with empty name', async () => {
    const album = {
      id:"",
      nombre: "",
      fecha_lanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }
    await expect(() => service.create(album)).rejects.toHaveProperty('message','El nombre no puede estar vacío');
  });

  it('should return a list of albums', async () => {
    const albums = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums.length).toEqual(albumList.length);
  });

  it('should return an album', async () => {
    const album = await service.findOne(albumList[0].id);
    expect(album).not.toBeNull();
    expect(album.id).toEqual(albumList[0].id);
    expect(album.nombre).toEqual(albumList[0].nombre);
    expect(album.fecha_lanzamiento).toEqual(albumList[0].fecha_lanzamiento);
    expect(album.caratula).toEqual(albumList[0].caratula);
    expect(album.descripcion).toEqual(albumList[0].descripcion);
  });

  it('should throw an error when album is not found', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty('message','El album no existe');
  });

  it('should delete an album', async () => {
    const album = albumList[0];
    await service.delete(album.id);
    const storedAlbum = await repository.findOne({where: {id: album.id}});
    expect(storedAlbum).toBeNull();
  });

  it('should throw an error when album is not found', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty('message','El album no existe');
  });

});
