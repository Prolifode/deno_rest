import db from '../db/db.ts';
import { ObjectId } from 'jsr:@db/mongo';

export interface TokenSchema {
  _id?: ObjectId;
  token: string;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Token = db.getDatabase.collection<TokenSchema>('tokens');
