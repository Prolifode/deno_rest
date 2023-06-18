import type { Application } from "../deps.ts";
import defaultRouter from "./default.router.ts";
import userRouter from "./user.router.ts";
import productRouter from "./product.router.ts";
import organizationRouter from "./organization.router.ts";
import itemRouter from "./item.router.ts";
import authRouter from "./auth.router.ts";

const init = (app: Application) => {
  app.use(authRouter.routes());
  app.use(userRouter.routes());
  app.use(productRouter.routes());
  app.use(organizationRouter.routes());
  app.use(itemRouter.routes());

  app.use(authRouter.allowedMethods());
  app.use(userRouter.allowedMethods());
  app.use(productRouter.allowedMethods());
  app.use(organizationRouter.allowedMethods());
  app.use(itemRouter.allowedMethods());

  app.use(defaultRouter.routes());
  app.use(defaultRouter.allowedMethods());
};

export default {
  init,
};
