import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDTO } from './dto/transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
 async createTransaction(@Body() transactionDTO: TransactionDTO): Promise<any> {
    return await this.transactionService.createTransaction(transactionDTO)
      .then(() => ({ status: true, message: 'Transaction created successfully' }))
      .catch((error) => ({ status: false, message: `Failed to create transaction. ${error.message}` }));
  }

  @Get()
  async getAllTransactions(): Promise<any> {
    return  await this.transactionService.getAllTransactions()
      .catch((error) => ({ status: false, message: `Failed to retrieve transactions. ${error.message}` }));
  }

  @Get(':accountNumber')
  async getTransactionsByAccountNumber(@Param('accountNumber') accountNumber: string): Promise<any> {
    return await this.transactionService.getTransactionsByAccountNumber(accountNumber)
      .catch((error) => ({ status: false, message: `Failed to retrieve transactions. ${error.message}` }));
  }

  @Post('credit')
 async creditAccount(@Body() creditDTO: any): Promise<any> {
    return await this.transactionService.creditAccount(creditDTO)
      .catch((error) => ({ status: false, message: `Failed to credit account. ${error.message}` }));
  }

  @Post('debit')
 async debitAccount(@Body() debitDTO: any): Promise<any> {
    return await this.transactionService.debitAccount(debitDTO)
      .catch((error) => ({ status: false, message: `Failed to debit account. ${error.message}` }));
  }
}
