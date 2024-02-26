import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/core/auth/auth.controller';
import { AuthService } from '../src/core/auth/auth.service';
import { AuthDto } from '../src/core/auth/dto/auth.dto';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        password: 'testpassword',
        email: ''
      };

      jest.spyOn(authService, 'register').mockImplementation(async () => {
        return { userId: '123', username: 'testuser' }; // Mock response
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(authDto)
        .expect(201);

      expect(response.body.message).toBe('New user created');
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /auth/login', () => {
    it('should log in a user and return a token', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        password: 'testpassword',
        email: ''
      };

      jest.spyOn(authService, 'login').mockImplementation(async () => 'mockedtoken'); // Mock response

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authDto)
        .expect(200);

      expect(response.body.message).toBe('Login success');
      expect(response.body.data.token).toBe('mockedtoken');
    });
  });
});
