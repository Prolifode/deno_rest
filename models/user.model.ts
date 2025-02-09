import db from '../db/db.ts';
import { ObjectId } from 'jsr:@db/mongo';
import type { CreateIndexOptions } from 'jsr:@db/mongo';

export interface UserSchema {
  _id: ObjectId;
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
  }],
};

await User.createIndexes(indexOptions);
