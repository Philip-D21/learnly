
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocumnent = User & Document


@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  @IsEmail({}, { message: 'Invalid email format' }) 
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
