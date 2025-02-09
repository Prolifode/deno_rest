import { ObjectId } from 'jsr:@db/mongo';
import { Role } from '../config/roles.ts';

export interface TokenStructure {
  access: { expires: Date; token: string };
  refresh: { expires: Date; token: string };
}

export interface UserStructure {
  id: string;
  name: string;
  email: string;
  role: string;
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RefreshTokenStructure {
  tokens: TokenStructure | Error;
}
export interface LoginStructure {
  tokens: TokenStructure | Error;
  user: UserStructure;
}

export interface CreateUserStructure {
  name: string;
  email: string;
  password: string;
  role: Role;
  isDisabled: boolean;
}

export interface UpdateUserStructure {
  name?: string;
  email?: string;
  role?: Role;
  isDisabled?: boolean;
}

export interface UpdatedStructure {
  matchedCount: number;
  modifiedCount: number;
  upsertedId: ObjectId | null;
}

export interface Err {
  status: number;
  name: string;
  path: string;
  param: string;
  message: string;
  type: string;
}

export interface ICustomError extends Error {
  status?: number;
  statusCode?: number;
  path?: string;
  type?: string;
}
