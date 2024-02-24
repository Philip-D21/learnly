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

  async getAccountById(accountId: string): Promise<Account | null> {
    return this.accountModel.findById(accountId).exec();
  }

  // async getAccountTransactions(accountId: string): Promise<any> {
  //   // Assuming you have a method to retrieve transactions by account ID in your TransactionService
  //   return this.transactionService.getTransactionsByAccountId(accountId);
  // }

  async updateAccount(accountId: string, accountDTO: AccountDTO): Promise<Account> {
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(accountId, accountDTO, { new: true })
      .exec();

    if (!updatedAccount) {
      throw new NotFoundException(`Account with ID ${accountId} not found.`);
    }

    return updatedAccount;
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
