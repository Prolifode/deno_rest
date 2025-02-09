import type { Logger, LogRecord } from '@std/log';
import { ConsoleHandler, getLogger, setup } from '@std/log';
import configs from '../config/config.ts';

const { env } = configs;

setup({
  handlers: {
    functionFmt: new ConsoleHandler('DEBUG', {
      formatter: (logRecord: LogRecord) => {
        const time: string = new Date().toISOString();
        let msg: string = `${time} [${logRecord.level}] ${logRecord.msg}`;

        logRecord.args.forEach((arg, index) => {
          msg += `, arg${index}: ${arg}`;
        });
        return msg;
      },
      useColors: false,
    }),
  },
  loggers: {
    default: {
      level: 'DEBUG',
      handlers: ['functionFmt'],
    },
    tests: {
      level: 'CRITICAL',
      handlers: ['functionFmt'],
    },
  },
});

let loggerMiddleware: Logger = getLogger();

if (env === 'test') {
  loggerMiddleware = getLogger('tests');
}

export default loggerMiddleware;
