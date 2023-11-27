import { Test, TestingModule } from '@nestjs/testing';
import { AlbumPerformerService } from './album-performer.service';
import { Repository } from 'typeorm';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumEntity } from '../album/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let performerRepository: Repository<PerformerEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let album: AlbumEntity;
  let performerList: PerformerEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();

    performerList = [];
    for (let i = 0; i < 2; i++) {
      const performer:PerformerEntity = await performerRepository.save({
        nombre: faker.lorem.sentence(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.paragraph(),
        albums: []
      });
      performerList.push(performer);
    }
  
    album = await albumRepository.save({
      nombre: faker.lorem.sentence(),
      caratula: faker.image.url(),
      fecha_lanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      tracks: [],
      performers: performerList
    });

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a performer to an album', async () => {
    const performer:PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      albums: []
    });

    const album:AlbumEntity = await albumRepository.save({
      nombre: faker.lorem.sentence(),
      caratula: faker.image.url(),
      fecha_lanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      tracks: [],
      performers: []
    });

    const result = await service.addPerformerToAlbum(album.id, performer.id);
    expect(result.performers.length).toBe(1);
    expect(result.performers[0]).not.toBeNull();
    expect(result.performers[0].id).toBe(performer.id);
    expect(result.performers[0].nombre).toBe(performer.nombre);
    expect(result.performers[0].imagen).toBe(performer.imagen);
    expect(result.performers[0].descripcion).toBe(performer.descripcion);
  });
  
  it('should throw an error when adding a performer to an album that does not exist', async () => {
    await expect(service.addPerformerToAlbum("0",performerList[0].id)).rejects.toHaveProperty('message', 'El album no existe');
  });

  it('should throw an error when adding a performer that does not exist to an album', async () => {
    await expect(service.addPerformerToAlbum(album.id,"0")).rejects.toHaveProperty('message', 'El performer no existe');
  });

});
