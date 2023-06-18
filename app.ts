import { Application, oakCors, organ } from "./deps.ts";
import { errorHandler } from "./middlewares/errorHandler.middleware.ts";
import log from "./middlewares/logger.middleware.ts";
import configs from "./config/config.ts";
import router from "./routers/index.ts";

const { env, url, port, clientUrl } = configs;

const app: Application = new Application();

const corsOptions = {
  origin: clientUrl,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(oakCors(corsOptions));
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  log.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
app.use(errorHandler);

router.init(app);

app.addEventListener("listen", () => {
  log.info(`Current Environment: ${env}`);
  log.info(`Server listening at ${url}`);
});

if (import.meta.main) {
  await app.listen({ port });
}

export { app };
