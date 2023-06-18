import db from "../db/db.ts";

export interface UserSchema {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  organization?: string;
  isDisabled: boolean;
  docVersion: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const User = db.getDatabase.collection<UserSchema>("users");
