// auth.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import * as request from 'supertest';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should return a new user on successful registration', async () => {
      const authDto: AuthDto = {
          username: 'testuser',
          password: 'testpassword',
          email: ''
      };

      const expectedResult = {
        userId: 'generatedUserId',
        username: 'testuser',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      const response = await controller.register({} as Response, authDto);

      expect(response.status).toBe(201);
      expect(response.json).toHaveBeenCalledWith({
        message: 'New user created',
        data: expectedResult,
      });
    });
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const authDto: AuthDto = {
          username: 'testuser',
          password: 'testpassword',
          email: ''
      };

      const expectedToken = 'generatedToken';

      jest.spyOn(authService, 'login').mockResolvedValue(expectedToken);

      const response = await controller.login({} as Response, authDto);

      expect(response.status).toBe(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Login success',
        data: { token: expectedToken },
      });
    });
  });
});
