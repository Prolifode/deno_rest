import db from "../db/db.ts";

export interface ItemSchema {
  _id: string;
  code: string;
  name: string;
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Item = db.getDatabase.collection<ItemSchema>("items");
