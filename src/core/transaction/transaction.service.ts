// transaction.service.ts
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Transaction, TransactionDocument } from "./schema/transaction.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TransactionDTO } from "./dto/transaction.dto";
import { brcResponse } from "src/common/brc.response";
import { AccountService } from "../account/account.service";
import { Account, AccountDocument } from "../account/schema/account.schema";

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private TransactionModel: Model<TransactionDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private accountService: AccountService
  ) {}

  private resHandler = brcResponse;

  async createTransaction(transactionDTO: TransactionDTO): Promise<Transaction> {
    try {
      const sourceAccount = await this.accountService.getAccountById(transactionDTO.sourceAccountId);

      if (!sourceAccount) {
        throw new NotFoundException(`Source account with ID ${transactionDTO.sourceAccountId} not found.`);
      }

      if (transactionDTO.type === 'withdrawal' && sourceAccount.balance < transactionDTO.amount) {
        throw new BadRequestException('Insufficient funds for withdrawal.');
      }

      // For transfer, validate destination account existence
      if (transactionDTO.type === 'transfer') {
        const destinationAccount = await this.accountService.getAccountById(transactionDTO.destinationAccountId);
        if (!destinationAccount) {
          throw new NotFoundException(`Destination account with ID ${transactionDTO.destinationAccountId} not found.`);
        }

        // Update destination account balance for transfer
        destinationAccount.balance += transactionDTO.amount;
        await (destinationAccount as AccountDocument).save(); // Save the destination account

        // Update source account balance for transfer
        sourceAccount.balance -= transactionDTO.amount;
        await (sourceAccount as AccountDocument).save(); // Save the source account
      }

      // Create the transaction
      const createdTransaction = await this.TransactionModel.create({
        ...transactionDTO,
        TransactionDate: new Date(),
      });

      return createdTransaction;

    } catch (error) {
      error.location = 'createTransaction method';
      throw error; 
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

  async getTransactionsByAccountId(accountId: string): Promise<any> {
    try {
      const transactions = await this.TransactionModel.find({
        $or: [
          { sourceAccountId: accountId },
          { destinationAccountId: accountId },
        ],
      }).exec();

      return { transactions, message: "Transactions retrieved successfully" };
    } catch (error) {
      error.location = 'getTransactionsByAccountId method';
      throw error;
    }
  }
}
