import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Status, TransactionType } from 'src/common/interface/main.interface';


export type TransactionDocument = Transaction & Document


@Schema({ timestamps: true })
export class Transaction {

  @Prop({ required: true })
  type: TransactionType

  @Prop({ required: true })
  amount: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account', required: true })
  sourceAccountId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  destinationAccountId: string;

  @Prop({ default: Status.Pending , enum: Status})
  status: Status

  @Prop()
  transactionDate: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);