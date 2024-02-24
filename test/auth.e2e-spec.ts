import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/core/auth/auth.controller';
import { AuthService } from '../src/core/auth/auth.service';
import { AuthDto } from '../src/core/auth/dto/auth.dto';
import { Response } from 'express';
import { brcResponse } from 'src/common/brc.response';
import * as request from 'supertest'
const { success } = brcResponse;

describe('AuthController (e2e)', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register ', () => {
    it('should register a new user', async () => {
      const authDto: AuthDto = {
        username: '',
        password: '',
        email: ''
      };
      const registerResult = { /* define the result of the registration */ };

      jest.spyOn(authService, 'register').mockResolvedValue(registerResult);

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authController.register(res as Response, authDto);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(success('New user created', registerResult));
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const authDto: AuthDto = {
        username: '',
        password: '',
        email: ''
      };
      const token = 'someToken';

      jest.spyOn(authService, 'login').mockResolvedValue(token);

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authController.login(res as Response, authDto);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(success('Login success', { token }));
    });
  });
});
