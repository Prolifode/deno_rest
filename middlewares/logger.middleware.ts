import { log } from "../deps.ts";
import configs from "../config/config.ts";

const { env } = configs;

await log.setup({
  handlers: {
    functionFmt: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: (logRecord) => {
        let time = new Date().toISOString();
        let msg = `${time} [${logRecord.level}] ${logRecord.msg}`;

        logRecord.args.forEach((arg, index) => {
          msg += `, arg${index}: ${arg}`;
        });
        return msg;
      },
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["functionFmt"],
    },
    tests: {
      level: "CRITICAL",
      handlers: ["functionFmt"],
    },
  },
});

let loggerMiddleware = log.getLogger();

if (env === "test") {
  loggerMiddleware = log.getLogger("tests");
}

export default loggerMiddleware;
