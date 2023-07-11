import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../frameworks/database/database.service';
import { User } from '../../../core/entities/user.entity';
import { ValidationPipe } from '@nestjs/common';

jest.setTimeout(15000);

describe('UsersController', () => {
  let dbConnection: any;
  let httpServer: any;
  let userRepository: Repository<User>;
  let app: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
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
      userRepository = dbConnection.getRepository(User);
      await userRepository.clear();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create a new User', () => {
    describe('with valid body', () => {
      it('shold return a new User', async () => {
        const response = await request(httpServer).post(`/api/v1/users`).send({
          email: 'testmailvalid@gmail.com',
          first_name: 'Jonh',
          last_name: 'Doe',
        });
        const userCreated = response.body;
        expect(response.status).toBe(201);
        expect(userCreated).toMatchObject({
          userCreated: {
            email: 'testmailvalid@gmail.com',
            first_name: 'Jonh',
            last_name: 'Doe',
          },
          emailSent: true,
        });
      });
    });

    describe('with body miss the email', () => {
      it('shold return BadRequesException', async () => {
        const response = await request(httpServer).post(`/api/v1/users`).field({
          first_name: 'Jonh',
          last_name: 'Doe',
        });
        const resp = response.body;
        expect(response.status).toBe(400);
        expect(resp).toHaveProperty('message');
        expect(resp).toHaveProperty('error');
        expect(resp).toHaveProperty('statusCode');
      });
    });

    describe('with body miss the first name', () => {
      it('shold return BadRequesException', async () => {
        const response = await request(httpServer).post(`/api/v1/users`).field({
          email: 'testmailvalid@gmail.com',
          last_name: 'Doe',
        });
        const resp = response.body;
        expect(response.status).toBe(400);
        expect(resp).toHaveProperty('message');
        expect(resp).toHaveProperty('error');
        expect(resp).toHaveProperty('statusCode');
      });
    });

    describe('with body miss the last name', () => {
      it('shold return BadRequesException', async () => {
        const response = await request(httpServer).post(`/api/v1/users`).field({
          first_name: 'Jonh',
          email: 'testmailvalid@gmail.com',
        });
        const resp = response.body;
        expect(response.status).toBe(400);
        expect(resp).toHaveProperty('message');
        expect(resp).toHaveProperty('error');
        expect(resp).toHaveProperty('statusCode');
      });
    });

    describe('get user by id', () => {
      describe('with valid id', () => {
        it('shold return a reqres user', async () => {
          const validId = 1;
          const response = await request(httpServer).get(
            `/api/v1/users/${validId}`,
          );
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('email');
          expect(response.body).toHaveProperty('first_name');
          expect(response.body).toHaveProperty('last_name');
          expect(response.body).toHaveProperty('avatar');
        });
      });
    });

    describe('get user by id', () => {
      describe('with invalid id', () => {
        it('shold return NotFoundError', async () => {
          const validId = 13;
          const response = await request(httpServer).get(
            `/api/v1/users/${validId}`,
          );
          expect(response.status).toBe(404);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('statusCode');
        });
      });
    });
  });
});
