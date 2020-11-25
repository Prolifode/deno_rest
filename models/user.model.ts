import db from "../db/db.ts";

export interface UserSchema {
  _id: { $oid?: string };
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified : boolean;
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v: number;
}

export const User = db.getDatabase.collection<UserSchema>("users");
