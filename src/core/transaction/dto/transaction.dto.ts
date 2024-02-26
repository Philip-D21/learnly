import { IsDecimal, IsEnum, IsString, IsDate } from 'class-validator';
import { TransactionType, Status } from 'src/common/interface/main.interface';

export class TransactionDTO {
  // @IsEnum(['CR', 'DR'])
  // tranxType: string;

  @IsEnum(TransactionType)
  purpose: TransactionType;


  @IsDecimal()
  amount: number;


  @IsString()
  reference: string;


  @IsString()
  accountNumber: string;


  @IsDecimal()
  balanceBefore: number;

  @IsDecimal()
  balanceAfter: number;

  @IsString()
  summary: string;

  @IsEnum(Status)
  status?: Status;

  @IsDate()
  transactionDate: Date;
}


export interface CreditDTO {
  amount: number;
  username: string;
  purpose: TransactionType;
  reference: string;
  summary: string;
}

// debitDTO
export interface DebitDTO {
  amount: number;
  accountNumber: string;
  purpose: TransactionType;
  reference: string;
  summary: string;

}