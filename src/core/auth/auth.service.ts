import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocumnent } from './schema/auth.schema';
import { AuthDto } from './dto/auth.dto';
import { BrcErr, JwtPayloadI, Role } from 'src/common/interface/main.interface';
import { brcResponse } from 'src/common/brc.response';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocumnent>,
    private jwtService: JwtService,
  ) {}

  private resHandler = brcResponse;

  async register(authDto: AuthDto): Promise<any> {
    try {
      if (await this.userModel.findOne({ email: authDto.email }).lean()) {
        const err: BrcErr = {
          message: 'This email exists!!!',
          status: 400,
        };
        this.resHandler.error(err);
      }
      authDto.password = hashSync(authDto.password, genSaltSync());

      const user = await this.userModel.create(authDto);

      const payload: JwtPayloadI = {
        userId: user._id,
        userRole: Role.User,
        userName: user.username,
      };

      const accessToken: string = await this.jwtService.signAsync(payload);
      return { user, accessToken };
    } catch (error) {
      error.location = 'auth.signup method';
      this.resHandler.error(error);
    }
  }

  async login(authDto: AuthDto): Promise<any> {
    try {
      const user = await this.userModel
        .findOne({ email: authDto.email })
        .lean();

      if (!user) {
        const err: BrcErr = {
          message: 'Invalid user',
          status: 404,
        };

        this.resHandler.error(err);
      }

      // compare password
      if (!compareSync(authDto.password, user.password)) {
        const err: BrcErr = {
          message: 'Invalid Password supplied!',
          status: 400,
        };
        this.resHandler.error(err);
      }

      const payload: JwtPayloadI = {
        userId: user._id,
        userRole: Role.User,
        userName: user.username,
      };

       return await this.jwtService.signAsync(payload)
       
    } catch (error) {
      error.location = 'auth.signup method';
      this.resHandler.error(error);
    }
  }
}
