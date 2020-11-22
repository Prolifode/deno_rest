import db from "../db/db.ts";

export interface UserHistorySchema {
  id: { $oid?: string };
  name: string;
  email: string;
  password: string;
  role: string;
  doc_version: number;
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserHistory = db.getDatabase.collection<UserHistorySchema>("users_history");
