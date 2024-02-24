// import { Test, TestingModule } from '@nestjs/testing';
// import { AccountController } from '../src/core/account/account.controller';
// import { AccountService } from '../src/core/account/account.service';
// import { AccountDTO } from '../src/core/account/dto/account.dto';
// import * as request from 'supertest';


// describe('AccountController (e2e)', () => {
//     let accountController: AccountController;
//     let accountService: AccountService;
  
//     beforeEach(async () => {
//       const module: TestingModule = await Test.createTestingModule({
//         controllers: [AccountController],
//         providers: [AccountService],
//       }).compile();
  
//       accountController = module.get<AccountController>(AccountController);
//       accountService = module.get<AccountService>(AccountService);
//     });
  
//     it('should be defined', () => {
//       expect(accountController).toBeDefined();
//     });
  
//     describe('createAccount', () => {
//       it('should create an account', async () => {
//         const accountDTO: AccountDTO = {
//           userId: 'someUserId',
//           accountNumber: '1234567890',
//           // other properties as needed
//         };
  
//         const expectedResult = {
//           message: 'Account created successfully',
//           data: {
//             accountId: 'generatedAccountId',
//             // other properties as needed
//           },
//         };
  
//        // jest.spyOn(accountService, 'createAccount').mockResolvedValue(expectedResult);
  
//         expect(await accountController.createAccount(accountDTO)).toBe(expectedResult);
//       });
//     });
  
//     describe('getAccountById', () => {
//       it('should get an account by ID', async () => {
//         const accountId = 'someAccountId';
  
//         const expectedResult = {
//           accountId: 'someAccountId',
//           userId: 'someUserId',
//           accountNumber: '1234567890',
//           balance: 0,
//           isSavingsAccount: false,
//         };
  
//         jest.spyOn(accountService, 'getAccountById').mockResolvedValue(expectedResult);
  
//         expect(await accountController.getAccountById(accountId)).toBe(expectedResult);
//       });
//     });
  
//     describe('updateAccount', () => {
//       it('should update an account', async () => {
//         const accountId = 'someAccountId';
//         const updateAccountDTO: AccountDTO = {
//             userId: '',
//             accountNumber: ''
//         };
  
//         const expectedResult = {
//           message: 'Account updated successfully',
//           data: {
//             accountId: 'someAccountId',
//             // Updated properties as needed
//           },
//         };
  
//        // jest.spyOn(accountService, 'updateAccount').mockResolvedValue(expectedResult);
  
//         expect(await accountController.updateAccount(accountId, updateAccountDTO)).toBe(expectedResult);
//       });
//     });
  
//     describe('getAllAccounts', () => {
//       it('should get all accounts', async () => {
//         const getAllAccountsExpectedResult = [
//           {
//             accountId: 'accountId1',
//             userId: 'userId1',
//             accountNumber: '1234567891',
//             balance: 100.50,
//             isSavingsAccount: true,
            
//           },
//           {
//             accountId: 'accountId2',
//             userId: 'userId2',
//             accountNumber: '1234567892',
//             balance: 50.25,
//             isSavingsAccount: false,
           
//           },
         
//         ];
  
//         //jest.spyOn(accountService, 'getAllAccounts').mockResolvedValue(getAllAccountsExpectedResult);
  
//         expect(await accountController.getAllAccounts()).toBe(getAllAccountsExpectedResult);
//       });
//     });
  
//     describe('deleteAccount', () => {
//       it('should delete an account', async () => {
//         const accountId = 'someAccountId';
  
//         const deleteAccountExpectedResult = {
//           message: 'Account deleted successfully',
//           data: {
//             accountId: 'deletedAccountId',
//           },
//         };
  
//         //jest.spyOn(accountService, 'deleteAccount').mockResolvedValue(deleteAccountExpectedResult);
  
//         expect(await accountController.deleteAccount(accountId)).toBe(deleteAccountExpectedResult);
//       });
//     });
//   });


// account.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Adjust the import path based on your project structure

describe('AccountController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions/account/:accountId (GET) - should get transactions by account ID', () => {
    const accountId = '0421148078'; // Replace with an actual account ID from your test data

    return request(app.getHttpServer())
      .get(`/transactions/account/${accountId}`)
      .expect(200)
      .expect((response) => {
        // Validate the response structure or content if needed
        // For example, you might want to assert that the response contains transactions
        expect(response.body.transactions).toBeDefined();
        expect(response.body.message).toBe('Transactions retrieved successfully');
      });
  });
});
