import db from "../db/db.ts";

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

export const User = db.getDatabase.collection<UserSchema>("users");
