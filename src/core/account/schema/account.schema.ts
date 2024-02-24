import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDecimal } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';

export type AccountDocument = Account & Document

@Schema({ timestamps: true })
export class Account {
 
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, minlength: 10, maxlength: 10 })
  accountNumber: string;

  @Prop({ default: 0, type: IsDecimal})
  balance: number;

  @Prop({ default: false })
  isSavingsAccount: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);