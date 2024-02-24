import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Status, TransactionType } from 'src/common/interface/main.interface';



export class TransactionDTO {
  @IsNotEmpty()
  @IsString()
  type: TransactionType

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  sourceAccountId: string;

  @IsOptional()
  @IsString()
  destinationAccountId?: string;
  
  @IsNotEmpty()
  @IsEnum(Status, { message: 'Invalid status value' })
  status: Status
}


