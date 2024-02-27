import { Controller, Post, Body, Get, Param, HttpStatus, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDTO } from './dto/account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async createAccount(@Body() accountDTO: AccountDTO): Promise<any> {
    const createdAccount = await this.accountService.createAccount(accountDTO);
    return { status: true, message: 'Account created successfully', data: { createdAccount } };
  }

  @Get(':accountNumber')
  async getAccountByNumber(@Param('accountNumber') accountNumber: string): Promise<any> {
    const account = await this.accountService.getAccountByNumber(accountNumber);
    return {
      status: account ? true : false,
      data: { account },
      message: account ? undefined : `Account with number ${accountNumber} not found`,
    };
  }

  @Get()
  async getAllAccounts(): Promise<any> {
    const accounts = await this.accountService.getAllAccounts();
    return { status: true, data: { accounts } };
  }

  
  @Delete(':accountId')
  async deleteAccount(@Param('accountId') accountId: string): Promise<any> {
    await this.accountService.deleteAccount(accountId);
    return { status: true, message: 'Account deleted successfully' };
  }
}
