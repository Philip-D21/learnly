import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Transaction, TransactionSchema } from "./schema/transaction.schema";
import { AccountModule } from "../account/account.module";  
import { AccountService } from "../account/account.service";
import { Account, AccountSchema } from "../account/schema/account.schema";


@Module({
  imports: [
    AccountModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        global: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Account.name, schema: AccountSchema}
    ]),
     
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})

export class TransactionModule {}