import db from "../db/db.ts";

export interface OrganizationSchema {
  _id: string;
  name: string;
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Organization =
  db.getDatabase.collection<OrganizationSchema>("organizations");
