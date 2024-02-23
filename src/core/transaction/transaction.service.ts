import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Transaction, TransactionDocument } from "./schema/transaction.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TransactionDTO } from "./dto/transaction.dto";
import { Account, AccountDocument } from "../account/schema/account.schema";
import { BrcErr, Status } from "src/common/interface/main.interface";
import { AccountService } from "../account/account.service";
import { brcResponse } from "src/common/brc.response";

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
      // Validate source account existence and balance 
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
      }

      // Create the transaction
      const createdTransaction = await this.TransactionModel.create({
        ...transactionDTO,
        status: Status,
        TransactionDate: new Date(),
      });


      // Update source account balance
      if (transactionDTO.type === 'withdrawal' || transactionDTO.type === 'transfer') {
        sourceAccount.balance -= transactionDTO.amount;
        await this.TransactionModel.create(sourceAccount);
      }

      // Update destination account balance for transfer
      if (transactionDTO.type === 'transfer') {
        const destinationAccount = await this.accountService.getAccountById(transactionDTO.destinationAccountId);
        destinationAccount.balance += transactionDTO.amount;
        await this.accountModel.create(destinationAccount);
      }

      return createdTransaction.save();

    } catch (error) {
      error.location = 'createTransaction method';
      this.resHandler.error(error);
    }
  }

  async getAllTransactions(): Promise<any> {
    try {
      const transactions = await this.TransactionModel.find().exec();
      return { transactions, message: "Transactions retrieved successfully" };
    } catch (error) {
      error.location = 'getAllTransactions method';
      this.resHandler.error(error);
    }
  }

  private async checkAccountExists(accountId: string): Promise<boolean> {
    const account = await this.accountModel.findById(accountId).exec();
    return !!account;
  }
}
