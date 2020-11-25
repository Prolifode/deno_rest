import db from "../db/db.ts";

export interface UserHistorySchema {
  id: { $oid?: string };
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

export const UserHistory = db.getDatabase.collection<UserHistorySchema>("users_history");
