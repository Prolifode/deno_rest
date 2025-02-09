import { ObjectId } from 'jsr:@db/mongo';
import { Status } from 'jsr:@oak/oak';
import HashHelper from '../helpers/hash.helper.ts';
import { throwError } from '../middlewares/errorHandler.middleware.ts';
import log from '../middlewares/logger.middleware.ts';
import { User, UserSchema } from '../models/user.model.ts';
import {
  UserHistory,
  UserHistorySchema,
} from '../models/user_history.model.ts';
import type {
  CreateUserStructure,
  UpdatedStructure,
  UpdateUserStructure,
  UserStructure,
} from '../types/types.interface.ts';
import {
  PermissionList,
  Role,
  ROLE_RIGHTS,
  ROLES_RANK,
} from '../config/roles.ts';

class UserService {
  /**
   * Create user Service
   * @param options
   * @returns Promise<string | ObjectId | Error> Returns Mongo Document of user or error
   */
  public static async createUser(
    options: CreateUserStructure,
  ): Promise<string | ObjectId | Error> {
    const { name, email, password, role, isDisabled } = options;
    const userExists: UserSchema | undefined = await User.findOne({ email });
    if (userExists) {
      log.error('User already exists');
      return throwError({
        status: Status.Conflict,
        name: 'Conflict',
        path: 'user',
        param: 'user',
        message: `User already exists`,
        type: 'Conflict',
      });
    }
    const hashedPassword = await HashHelper.encrypt(password);
    const createdAt = new Date();

    const user: string | ObjectId = await User.insertOne(
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

    if (user) {
      await UserHistory.insertOne(
        {
          user: new ObjectId(user),
          name,
          email,
          password: hashedPassword,
          role,
          isDisabled,
          createdAt,
          docVersion: 1,
        },
      );
    } else {
      log.error('Could not create user');
      return throwError({
        status: Status.BadRequest,
        name: 'BadRequest',
        path: 'user',
        param: 'user',
        message: `Could not create user`,
        type: 'BadRequest',
      });
    }
    return user;
  }

  /**
   * Get users service
   * @returns Promise<{users:UserSchema[]}> Returns Array of users documents
   */
  public static async getUsers(): Promise<{ users: UserSchema[] }> {
    const users = await User.find().toArray();
    return { users };
  }

  /**
   * Get single user service
   * @param id
   * @returns Promise<UserSchema | Error> Returns user document
   */
  public static async getUser(id: string): Promise<UserStructure | Error> {
    const user: UserSchema | undefined = await User.findOne(
      { _id: new ObjectId(id) },
    );
    if (!user) {
      log.error('User not found');
      return throwError({
        status: Status.NotFound,
        name: 'NotFound',
        path: 'user',
        param: 'user',
        message: `User not found`,
        type: 'NotFound',
      });
    }
    const { name, email, role, isDisabled, createdAt, updatedAt } = user;
    return { id, name, email, role, isDisabled, createdAt, updatedAt };
  }

  /**
   * Update user service
   * @param id
   * @param state
   * @param options
   * @returns Promise<UpdatedStructure | Error> Returns Updated acknowledgement
   */
  public static async updateUser(
    id: string,
    state: Record<string, string>,
    options: UpdateUserStructure,
  ): Promise<UpdatedStructure | Error> {
    const user: UserSchema | undefined = await User.findOne(
      { _id: new ObjectId(id) },
    );
    if (!user) {
      log.error('User not found');
      return throwError({
        status: Status.NotFound,
        name: 'NotFound',
        path: 'user',
        param: 'user',
        message: `User not found`,
        type: 'NotFound',
      });
    }
    const { isDisabled, name, email, role } = options;
    const userRights: string[] = ROLE_RIGHTS.get(state.role);
    if (state.id !== id && !userRights.includes(PermissionList.MANAGE_USERS)) {
      return throwError({
        status: Status.Forbidden,
        name: 'Forbidden',
        path: `access_token`,
        param: `access_token`,
        message: `Insufficient rights`,
        type: 'Forbidden',
      });
    }
    const roleTobeChanged = ROLES_RANK.indexOf(role as Role);
    if (
      (roleTobeChanged > ROLES_RANK.indexOf(<Role> user.role)) &&
      (ROLES_RANK.indexOf(<Role> state.role) < roleTobeChanged)
    ) {
      return throwError({
        status: Status.Forbidden,
        name: 'Forbidden',
        path: `access_token`,
        param: `access_token`,
        message: `Cannot change role to higher`,
        type: 'Forbidden',
      });
    }
    if (email) {
      const userExists: UserSchema | undefined = await User.findOne({
        email,
        _id: { $ne: new ObjectId(id) },
      });
      if (userExists) {
        log.error('User already exists');
        return throwError({
          status: Status.Conflict,
          name: 'Conflict',
          path: 'user',
          param: 'user',
          message: `User already exists`,
          type: 'Conflict',
        });
      }
    }
    const { docVersion } = user;
    const newDocVersion = docVersion + 1;
    const updatedAt = new Date();
    const result: {
      // deno-lint-ignore no-explicit-any
      upsertedId: any;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
    } = await User.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        name,
        email,
        role,
        isDisabled,
        updatedAt,
        docVersion: newDocVersion,
      },
    });
    if (result) {
      const user: UserHistorySchema = {
        user: new ObjectId(id),
        isDisabled: isDisabled === true,
        docVersion: newDocVersion,
      };
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (role) {
        user.role = role;
      }
      await UserHistory.insertOne(user);
    } else {
      return throwError({
        status: Status.BadRequest,
        name: 'BadRequest',
        path: 'user',
        param: 'user',
        message: `Could not update user`,
        type: 'BadRequest',
      });
    }

    return result;
  }

  /**
   * Remove user service
   * @param id
   * @returns Promise<number | Error Returns deleted count
   */
  public static async removeUser(id: string): Promise<number | Error> {
    let user: UserSchema | undefined;
    try {
      user = await User.findOne(
        { _id: new ObjectId(id) },
      );
    } catch (e) {
      log.error(e);
      return throwError({
        status: Status.BadRequest,
        name: 'BadRequest',
        path: 'id',
        param: 'id',
        message:
          'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer',
        type: 'BadRequest',
      });
    }

    if (!user) {
      log.error('User not found');
      return throwError({
        status: Status.NotFound,
        name: 'NotFound',
        path: 'user',
        param: 'user',
        message: `User not found`,
        type: 'NotFound',
      });
    }
    const deleteCount: number = await User.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteCount) {
      const { name, email, role, isDisabled, createdAt, docVersion } = user;
      const newDocVersion = docVersion + 1;
      const updatedAt = new Date();
      await UserHistory.insertOne(
        {
          user: new ObjectId(id),
          name,
          email,
          role,
          isDisabled,
          createdAt,
          updatedAt,
          docVersion: newDocVersion,
        },
      );
    } else {
      return throwError({
        status: Status.BadRequest,
        name: 'BadRequest',
        path: 'user',
        param: 'user',
        message: `Could not delete user`,
        type: 'BadRequest',
      });
    }
    return deleteCount;
  }
}

export default UserService;
