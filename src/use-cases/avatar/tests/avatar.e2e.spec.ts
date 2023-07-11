import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../frameworks/database/database.service';
import { ValidationPipe } from '@nestjs/common';
import { Avatar } from '../../../core/entities/avatar.entity';
import { ReqresApiService } from '../../../services/reqres-api/reqres-api.service';
import { ReqresProvider } from '../../../services/reqres-api/reqres-api.provider';

jest.setTimeout(15000);

describe('AvatarsController', () => {
  let dbConnection: any;
  let httpServer: any;
  let avatarRepository: Repository<Avatar>;
  let app: any;
  const validUserId = 1;
  const invalidUserId = 13;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ReqresApiService, ReqresProvider],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  beforeAll(async () => {
    const environment = process.env.NODE_ENV;
    if (environment === 'test') {
      avatarRepository = dbConnection.getRepository(Avatar);
      await avatarRepository.clear();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('findAvatar', () => {
    describe('with valid user id', () => {
      it('should return a Avatar', async () => {
        const response = await request(httpServer).get(
          `/api/v1/users/${validUserId}/avatar`,
        );
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('avatar');
      });
    });
  });

  describe('findAvatar', () => {
    describe('with invalid user id', () => {
      it('should return a NotFoundError', async () => {
        const response = await request(httpServer).get(
          `/api/v1/users/${invalidUserId}/avatar`,
        );
        expect(response).toBeDefined();
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('statusCode');
      });
    });
  });

  describe('deleteAvatar', () => {
    describe('with valid user id', () => {
      it('should return a AvatarDeleted', async () => {
        const otherValidId = 2;
        const newAvatar = {
          userId: otherValidId,
          hash: 'hashImage',
        };
        avatarRepository = dbConnection.getRepository(Avatar);
        await avatarRepository.save(newAvatar);
        const response = await request(httpServer).delete(
          `/api/v1/users/${otherValidId}/avatar`,
        );
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('avatarDeleted');
        expect(response.body).toHaveProperty('imageDeleted');
      });
    });
  });

  describe('findAvatar', () => {
    describe('with invalid user id', () => {
      it('should return a NotFoundError', async () => {
        const response = await request(httpServer).delete(
          `/api/v1/users/${invalidUserId}/avatar`,
        );
        expect(response).toBeDefined();
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('statusCode');
      });
    });
  });
});
