import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDecimal, IsEnum } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import { Status, TransactionType } from 'src/common/interface/main.interface';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  // @Prop({ enum: ['CR', 'DR'] })
  // tranxType: string;

  @Prop({ required: true, enum: TransactionType })
  purpose: TransactionType;

  @Prop({ required: true, default: 0, type: Number, validate: IsDecimal })
  amount: number;

  @Prop({ type: String, required: true })
  reference: string;

  @Prop({ ref: 'Account' })
  accountNumber: string;

  @Prop({ required: true, default: 0, type: Number, validate: IsDecimal })
  balanceBefore: number;

  @Prop({ required: true, default: 0, type: Number, validate: IsDecimal })
  balanceAfter: number;

  @Prop({ type: String, required: true })
  summary: string;

  @Prop({ default: Status.Pending, enum: Status })
  status: Status;

  @Prop()
  transactionDate: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
