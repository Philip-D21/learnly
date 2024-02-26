import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schema/account.schema';
import { AccountDTO } from './dto/account.dto';
import { TransactionService } from '../transaction/transaction.service';


@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
   // private transactionService: TransactionService
    ) {}

  async createAccount(accountDTO: AccountDTO): Promise<Account> {
    const createdAccount = new this.accountModel(accountDTO);
    return createdAccount.save();
  }

  async getAccountByNumber(accountNumber: string): Promise<Account | null> {
    return this.accountModel.findOne({ accountNumber }).exec();
  }

   
  async updateAccountBalance(accountNumber: string, newBalance: number): Promise<void> {
    const account = await this.accountModel.findOne({ accountNumber }).exec();

    if (!account) {
      throw new NotFoundException(`Account with number ${accountNumber} not found`);
    }

    account.balance = newBalance;
    await account.save();
  }

  async getAllAccounts(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }
  
  async deleteAccount(accountId: string): Promise<void> {
    const result = await this.accountModel.deleteOne({ _id: accountId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Account with ID ${accountId} not found.`);
    }
  }
}
