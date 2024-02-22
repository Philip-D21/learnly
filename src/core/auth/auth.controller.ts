import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { brcResponse } from 'src/common/brc.response';
import { Response } from "express";
import { Public } from "src/common/guard/decorator/public.decorator";


const { success } = brcResponse;


@Controller('auth')
export class AuthController {
   resHandler: any;
  constructor(
    private readonly authService: AuthService
    ) {}


  @Public(true)
  @Post('register')
  async register(@Res() res: Response,@Body() authDto: AuthDto): Promise<Response>{
    
    const data = await this.authService.register(authDto)

    return res.status(201).json(success('New user created', data))
  
  }
  

  @Public(true)
  @Post('login')
  async login(@Res() res: Response,@Body() authDto: AuthDto): Promise<Response> {
    
    const token: string = await this.authService.login(authDto);
    
    return res.status(200).json(success('Login success', { token }))
  }
}
