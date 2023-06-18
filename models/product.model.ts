import db from "../db/db.ts";

export interface ProductSchema {
  _id: string;
  code?: string;
  organization: string;
  name: string;
  cost: number;
  price: number;
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Product = db.getDatabase.collection<ProductSchema>("products");
