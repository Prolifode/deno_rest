import type { DenonConfig } from './deps.ts';

const config: DenonConfig = {
  $schema: 'https://deno.land/x/denon/schema.json',
  allow: [
    'net',
    'env',
    'read',
    'write',
  ],
  scripts: {
    start: {
      cmd: 'deno run -c deno.json --import-map=import_map.json app.ts',
      unstable: false,
      desc: 'run server',
      env: {
        'ENV': 'development',
      },
      watch: true,
    },
    test: {
      cmd: 'deno test --import-map=import_map.json',
      desc: 'Test the server.',
      unstable: false,
      env: {
        ENV: 'test',
      },
      watch: false,
      tsconfig: 'tsconfig.json',
    },
    'test:cov': {
      cmd: 'deno test --coverage=./cov',
      desc: 'Test Coverage',
      unstable: false,
      env: {
        ENV: 'test',
      },
      watch: false,
      importMap: 'import_map.json',
    },
    'coveralls': {
      cmd: 'deno coverage --lcov cov/ > cov.lcov',
      desc: 'store collected coverage as a .lcov file which integrates well with services such as Codecov, Coveralls and Travis CI',
      unstable: false,
      env: {
        ENV: 'test',
      },
      watch: false,
      allow: []
    },
    prod: {
      cmd: 'deno run --import-map=import_map.json app.bundle.js',
      desc: 'Run the server.',
      unstable: false,
      env: {
        ENV: 'production',
      },
      watch: false,
    },
    fmt: {
      cmd: 'deno fmt',
      desc: 'Format the code.',
      allow: [],
      watch: false,
    },
    lint: {
      cmd: 'deno lint',
      desc: 'Code linter for JavaScript and TypeScript',
      unstable: true,
      watch: false,
      allow: [],
    },
  },
  logger: {
    fullscreen: true,
    quiet: false,
    debug: true,
  },
  watcher: {
    skip: [
      '*/.git/*',
      '*/.idea/*',
      '*/.vscode/*',
      '*/.env/*',
    ],
  },
};

export default config;
