import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schema/account.schema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction, TransactionSchema } from '../transaction/schema/transaction.schema';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema },
      //{ name: Transaction.name, schema: TransactionSchema}
    ]),
      
  ],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}