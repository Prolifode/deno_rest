import db from '../db/db.ts';
import { ObjectId } from 'jsr:@db/mongo';

export interface UserHistorySchema {
  _id?: ObjectId;
  user: ObjectId;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  docVersion: number;
  isDisabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserHistory = db.getDatabase.collection<UserHistorySchema>(
  'users_history',
);
