import db from '../db/db.ts';
import type { CreateIndexOptions } from '../deps.ts';

export interface UserSchema {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  docVersion: number;
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const User = db.getDatabase.collection<UserSchema>('users');

const indexOptions: CreateIndexOptions = {
  indexes: [{
    key: {
      email: 'text',
    },
    name: 'emailUniqueKey',
    unique: true,
  }],
};

await User.createIndexes(indexOptions);
