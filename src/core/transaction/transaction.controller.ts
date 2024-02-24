import { Controller, Post, Get, Body, Req, Res, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDTO } from './dto/transaction.dto';
import { brcResponse } from 'src/common/brc.response';
import { Response } from "express";
const { success } = brcResponse;

@Controller('transactions')
export class TransactionController {
  resHandler: any;
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
  @Req() req: any,
  @Res() res: Response,
  @Body() transactionDTO: TransactionDTO): Promise<Response> {
   const transaction = await  this.transactionService.createTransaction(transactionDTO);

   return res.status(200).json(success('Transaction successful', { transaction }))
  }

  @Get()
  async getAllTransactions(
    @Req() req: any,
    @Res() res: Response
    ): Promise<Response> {

    const getAllTransactions = await this.transactionService.getAllTransactions()

    return res.status(200).json(success('Transaction successful', { getAllTransactions}))
  }


  @Get(':accountId')
  async getTransactionsByAccountId(@Param('accountId') accountId: string): Promise<any> {
    const result = await this.transactionService.getTransactionsByAccountId(accountId);
    return result;
  }
}
