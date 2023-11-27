import { Test, TestingModule } from '@nestjs/testing';
import { PerformerService } from './performer.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performerList: PerformerEntity[] = [];

  let MAX_DESCRIPTION_LENGTH_ERROR = 'La descripción no puede superar los 100 caracteres';
  let PERFORMER_NOT_FOUND = 'El performer no existe';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performerList = [];
    for(let i = 0; i < 5; i++){
      const performer = await repository.save({
        nombre: faker.lorem.sentence(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentence()
      });
      performerList.push(performer);
    }
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a performer', async () => {
    const performer = {
      id:"",
      nombre: faker.lorem.sentence(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence(),
      albums: []
    }
    const newPerformer = await service.create(performer);
    expect(newPerformer).not.toBeNull();

    const storedPerformer = await repository.findOne({where: {id: newPerformer.id}});
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.nombre).toEqual(performer.nombre);
    expect(storedPerformer.imagen).toEqual(performer.imagen);
    expect(storedPerformer.descripcion).toEqual(performer.descripcion);
  });

  it('should throw an error when the description is too long', async () => {
    const performer = {
      id:"",
      nombre: faker.lorem.sentence(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraphs(10),
      albums: []
    }
    await expect(() => service.create(performer)).rejects.toHaveProperty('message',MAX_DESCRIPTION_LENGTH_ERROR);
  });

  it('should return a list of performers', async () => {
    const performers = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers.length).toEqual(performerList.length);
  });

  it('should return a performer by id', async () => {
    const performer = await service.findOne(performerList[0].id);
    expect(performer).not.toBeNull();
    expect(performer.id).toEqual(performerList[0].id);
    expect(performer.nombre).toEqual(performerList[0].nombre);
    expect(performer.imagen).toEqual(performerList[0].imagen);
    expect(performer.descripcion).toEqual(performerList[0].descripcion);
  });

  it('should throw an error when the performer does not exist', async () => {
    await expect(() => service.findOne('invalid-id')).rejects.toHaveProperty('message',PERFORMER_NOT_FOUND);
  });

});
