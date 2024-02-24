import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionDTO } from './dto/transaction.dto';
import { Response } from 'express';
import { brcResponse } from 'src/common/brc.response';

const { success } = brcResponse;

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    transactionController = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const transactionDTO: TransactionDTO = { /* provide necessary data for creating a transaction */ };
      const createdTransaction = { /* define the result of the createTransaction method */ };

      jest.spyOn(transactionService, 'createTransaction').mockResolvedValue(createdTransaction);

      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await transactionController.createTransaction(req as Request, res as Response, transactionDTO);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(success('Transaction successful', { transaction: createdTransaction }));
    });
  });

  describe('getAllTransactions', () => {
    it('should get all transactions', async () => {
      const allTransactions = [ /* define a list of transactions */ ];

      jest.spyOn(transactionService, 'getAllTransactions').mockResolvedValue(allTransactions);

      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await transactionController.getAllTransactions(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(success('Transaction successful', { getAllTransactions: allTransactions }));
    });
  });
});
