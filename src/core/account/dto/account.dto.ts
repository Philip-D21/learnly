import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class AccountDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsOptional()
  @IsBoolean()
  isSavingsAccount?: boolean;
}
