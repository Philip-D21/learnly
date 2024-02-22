import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { RoleGuard } from './common/guard/roles.guard';
import { AccountModule } from './core/account/account.module';
import { TransactionModule } from './core/transaction/transaction.module';
import { AuthModule } from './core/auth/auth.module';

 
@Module({
  imports:  [
    AccountModule,
    TransactionModule,
    AuthModule,
    MongooseModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: async (config:ConfigService) => ({
      uri:config.get<string>('DB_URL')
    })
  }),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
    }),
    inject: [ConfigService],
  }),
  ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ],
})
export class AppModule {}
