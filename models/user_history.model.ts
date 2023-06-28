import db from '../db/db.ts';

export interface UserHistorySchema {
  _id?: string;
  user: string;
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
