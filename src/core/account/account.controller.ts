import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDTO } from './dto/account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(@Body() accountDTO: AccountDTO): Promise<any> {
    return this.accountService.createAccount(accountDTO);
  }

  @Get(':id')
  async getAccountById(@Param('id') accountId: string): Promise<any> {
    return this.accountService.getAccountById(accountId);
  }

  @Patch(':id')
  async updateAccount(@Param('id') accountId: string, @Body() accountDTO: AccountDTO): Promise<any> {
    return this.accountService.updateAccount(accountId, accountDTO);
  }

  @Get()
  async getAllAccounts(): Promise<any> {
    return this.accountService.getAllAccounts();
  }

  @Delete(':id')
  async deleteAccount(@Param('id') accountId: string): Promise<any> {
    return this.accountService.deleteAccount(accountId);
  }
}
