import { Bson, Status } from "../deps.ts";
import { throwError } from "../middlewares/errorHandler.middleware.ts";
import log from "../middlewares/logger.middleware.ts";
import { User, UserSchema } from "../models/user.model.ts";
import type { UpdatedStructure } from "../types/types.interface.ts";
import { CreateOrgDto, UpdateOrgDto } from "../types/org.dto.ts";
import { Organization } from "../models/organization.model.ts";

class OrganizationService {
  public static async createOne(options: CreateOrgDto) {
    const { name } = options;
    const orgExists = await Organization.findOne({ name });
    if (orgExists) {
      log.error("Org already exists");
      return throwError({
        status: Status.Conflict,
        name: "Conflict",
        path: "user",
        param: "user",
        message: `Org already exists`,
        type: "Conflict",
      });
    }

    const createdAt = new Date();

    const user = await Organization.insertOne({
      name,
      isDisabled: false,
      createdAt: createdAt,
    });

    if (user) {
      log.info("Org created successfully");
      return user;
    } else {
      log.error("Could not create user");
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "user",
        param: "user",
        message: `Could not create org`,
        type: "BadRequest",
      });
    }
  }

  public static getAll() {
    return Organization.find().toArray();
  }

  public static async getOne(id: string) {
    const user = await Organization.findOne({
      _id: new Bson.ObjectId(id),
    });
    if (!user) {
      log.error("User not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "user",
        param: "user",
        message: `User not found`,
        type: "NotFound",
      });
    }
    return user;
  }

  public static async updateOne(
    id: string,
    options: UpdateOrgDto
  ): Promise<UpdatedStructure | Error> {
    const user: UserSchema | undefined = await User.findOne({
      _id: new Bson.ObjectId(id),
    });
    if (!user) {
      log.error("User not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "user",
        param: "user",
        message: `User not found`,
        type: "NotFound",
      });
    }
    const { name, isDisabled } = options;

    const { docVersion } = user;
    const newDocVersion = docVersion + 1;
    const updatedAt = new Date();
    const result: {
      // deno-lint-ignore no-explicit-any
      upsertedId: any;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
    } = await User.updateOne(
      { _id: new Bson.ObjectId(id) },
      {
        $set: {
          name,
          isDisabled,
          updatedAt,
          docVersion: newDocVersion,
        },
      }
    );
    if (result) {
      return result;
    } else {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "user",
        param: "user",
        message: `Could not update user`,
        type: "BadRequest",
      });
    }
  }

  public static async removeOne(id: string): Promise<number | Error> {
    const user = await Organization.findOne({
      _id: new Bson.ObjectId(id),
    });
    if (!user) {
      log.error("User not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "user",
        param: "user",
        message: `User not found`,
        type: "NotFound",
      });
    }
    const deleteCount: number = await Organization.deleteOne({
      _id: new Bson.ObjectId(id),
    });
    if (deleteCount) {
      log.info("User deleted successfully");
      return deleteCount;
    } else {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "user",
        param: "user",
        message: `Could not delete user`,
        type: "BadRequest",
      });
    }
  }
}

export default OrganizationService;
