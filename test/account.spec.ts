import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../src/core/account/account.controller';
import { AccountService } from '../src/core/account/account.service';
import { AccountDTO } from '../src/core/account/dto/account.dto';



describe('AccountController', () => {
    let accountController: AccountController;
    let accountService: AccountService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AccountController],
        providers: [AccountService],
      }).compile();
  
      accountController = module.get<AccountController>(AccountController);
      accountService = module.get<AccountService>(AccountService);
    });
  
    it('should be defined', () => {
      expect(accountController).toBeDefined();
    });
  
    describe('createAccount', () => {
      it('should create an account', async () => {
        const accountDTO: AccountDTO = {
          userId: 'someUserId',
          accountNumber: '1234567890',
          // other properties as needed
        };
  
        const expectedResult = {
          message: 'Account created successfully',
          data: {
            accountId: 'generatedAccountId',
            // other properties as needed
          },
        };
  
        jest.spyOn(accountService, 'createAccount').mockResolvedValue(expectedResult);
  
        expect(await accountController.createAccount(accountDTO)).toBe(expectedResult);
      });
    });
  
    describe('getAccountById', () => {
      it('should get an account by ID', async () => {
        const accountId = 'someAccountId';
  
        const expectedResult = {
          accountId: 'someAccountId',
          userId: 'someUserId',
          accountNumber: '1234567890',
          balance: 0,
          isSavingsAccount: false,
          // other properties as needed
        };
  
        jest.spyOn(accountService, 'getAccountById').mockResolvedValue(expectedResult);
  
        expect(await accountController.getAccountById(accountId)).toBe(expectedResult);
      });
    });
  
    describe('updateAccount', () => {
      it('should update an account', async () => {
        const accountId = 'someAccountId';
        const updateAccountDTO: AccountDTO = {
            userId: '',
            accountNumber: ''
        };
  
        const expectedResult = {
          message: 'Account updated successfully',
          data: {
            accountId: 'someAccountId',
            // Updated properties as needed
          },
        };
  
        jest.spyOn(accountService, 'updateAccount').mockResolvedValue(expectedResult);
  
        expect(await accountController.updateAccount(accountId, updateAccountDTO)).toBe(expectedResult);
      });
    });
  
    describe('getAllAccounts', () => {
      it('should get all accounts', async () => {
        const getAllAccountsExpectedResult = [
          {
            accountId: 'accountId1',
            userId: 'userId1',
            accountNumber: '1234567891',
            balance: 100.50,
            isSavingsAccount: true,
            // other properties as needed
          },
          {
            accountId: 'accountId2',
            userId: 'userId2',
            accountNumber: '1234567892',
            balance: 50.25,
            isSavingsAccount: false,
            // other properties as needed
          },
          // Other accounts as needed
        ];
  
        jest.spyOn(accountService, 'getAllAccounts').mockResolvedValue(getAllAccountsExpectedResult);
  
        expect(await accountController.getAllAccounts()).toBe(getAllAccountsExpectedResult);
      });
    });
  
    describe('deleteAccount', () => {
      it('should delete an account', async () => {
        const accountId = 'someAccountId';
  
        const deleteAccountExpectedResult = {
          message: 'Account deleted successfully',
          data: {
            accountId: 'deletedAccountId',
          },
        };
  
        jest.spyOn(accountService, 'deleteAccount').mockResolvedValue(deleteAccountExpectedResult);
  
        expect(await accountController.deleteAccount(accountId)).toBe(deleteAccountExpectedResult);
      });
    });
  });