import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Transaction, TransactionDocument } from "./schema/transaction.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { TransactionDTO } from "./dto/transaction.dto";
import { brcResponse } from "src/common/brc.response";
import { AccountService } from "../account/account.service";
import { Account, AccountDocument } from "../account/schema/account.schema";
import { Status, TransactionType } from "src/common/interface/main.interface";
import { StartupSnapshot } from "v8";

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private TransactionModel: Model<TransactionDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private accountService: AccountService
  ) {}

  private resHandler = brcResponse;

  async createTransaction(transactionDTO: TransactionDTO): Promise<any> {
    const session = await this.TransactionModel.startSession();
    
    try {
      await session.withTransaction(async () => {
        const { accountNumber, amount, balanceBefore, purpose, reference, summary } = transactionDTO;

        // Retrieve the account and check if it exists
        const account = await this.accountService.getAccountByNumber(accountNumber);
        if (!account) {
          throw new NotFoundException(`Account with number ${accountNumber} not found`);
        }

        // Update the account balance and create the transaction
        const newBalance = account.balance + amount;
        await this.accountService.updateAccountBalance(accountNumber, newBalance);

        transactionDTO.balanceAfter = newBalance;

        const createdTransaction = new this.TransactionModel(transactionDTO);
        await createdTransaction.save({ session });

        // Commit the transaction
        await session.commitTransaction();
      });
    } catch (error) {
      error.location = 'createTransaction method';
      throw error;
    } finally {
      // End the session after the transaction is committed or aborted
      session.endSession();
    }
  }

  async getAllTransactions(): Promise<any> {
    try {
      const transactions = await this.TransactionModel.find().exec();
      return { transactions, message: "Transactions retrieved successfully" };
    } catch (error) {
      error.location = 'getAllTransactions method';
      throw error;
    }
  }

  async getTransactionsByAccountNumber(accountNumber: string): Promise<any> {
    try {
      const transactions = await this.TransactionModel.find({ accountNumber }).exec();

      return { transactions, message: "Transactions retrieved successfully" };
    } catch (error) {
      error.location = 'getTransactionsByAccountNumber method';
      throw error;
    }
  }

  async creditAccount({ amount, username, purpose, reference, summary, session }: {
    amount: number;
    username: string;
    purpose: TransactionType;
    reference: string;
    summary: string;
    status: Status;
    session: ClientSession;
  }): Promise<any> {
    try {
      const account = await this.accountModel.findOne({ username });

      if (!account) {
        return {
          status: false,
          message: `User ${username} doesn't exist`,
        };
      }

      const updatedAccount = await this.accountModel.findOneAndUpdate(
        { username },
        { $inc: { balance: amount } },
        { session },
      );

      const transactionDTO: TransactionDTO = {
        accountNumber: updatedAccount.accountNumber,
        amount,
        balanceBefore: account.balance,
        purpose,
        reference,
        summary,
        balanceAfter: 0,
        transactionDate: new Date(),
        
      };

      await this.createTransaction(transactionDTO);

      console.log('Credit successful');

      return {
        status: true,
        message: 'Credit successful',
        data: { updatedAccount },
      };
    } catch (error) {
      console.error(`Error in creditAccount: ${error.message}`);
      return {
        status: false,
        message: 'Failed to credit account',
        error: error.message,
      };
    }
  }

  async debitAccount({ amount, accountNumber, purpose, reference, summary, session }: {
    amount: number;
    accountNumber: string;
    purpose: TransactionType
    reference: string;
    summary: string;
    status: Status
    session: ClientSession;
  }): Promise<any> {
    try {
      const account = await this.accountModel.findOne({ accountNumber });

      if (!account) {
        return {
          status: false,
          message: `User ${accountNumber} doesn't exist`,
        };
      }

      if (Number(account.balance) < amount) {
        return {
          status: false,
          message: `User ${accountNumber} has insufficient balance`,
        };
      }

      const updatedAccount = await this.accountModel.findOneAndUpdate(
        { accountNumber },
        { $inc: { balance: -amount } },
        { session },
      );

      const transactionDTO: TransactionDTO = {
        accountNumber: updatedAccount.accountNumber,
        amount,
        balanceBefore: account.balance,
        purpose,
        reference,
        summary,
        balanceAfter: 0,
        transactionDate: undefined
      };

      await this.createTransaction(transactionDTO);

      console.log('Debit successful');
      return {
        status: true,
        message: 'Debit successful',
        data: { updatedAccount },
      };
    } catch (error) {
      console.error(`Error in debitAccount: ${error.message}`);
      return {
        status: false,
        message: 'Failed to debit account',
        error: error.message,
      };
    }
  }
}
