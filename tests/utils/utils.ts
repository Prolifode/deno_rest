import { CreateUserStructure } from "../../types/types.interface.ts";
import HashHelper from "../../helpers/hash.helper.ts";
import { User } from "../../models/user.model.ts";
import db from "../../db/db.ts";
import config from "../../config/config.ts";
import JwtHelper from "../../helpers/jwt.helper.ts";

export const clearCollection = async (collection: string) => {
  return await db.getDatabase.collection(collection).deleteMany({});
};

export const createUser = async (user: CreateUserStructure) => {
  const { name, email, password, role, isDisabled } = user;
  const hashedPassword = await HashHelper.encrypt(password);
  const createdAt = new Date();

  const _user = await User.insertOne(
    {
      name,
      email,
      password: hashedPassword,
      role,
      isDisabled,
      createdAt,
      docVersion: 1,
    },
  );

  return _user.toString();
};

export const generateAccessToken = async (userId: string) => {
  const accessTokenExpires = (Date.now() + (config.jwtAccessExpiration * 1000));
  return await JwtHelper.getToken(accessTokenExpires, userId);
};
