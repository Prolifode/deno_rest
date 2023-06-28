import db from './db/db.ts';
import HashHelper from './helpers/hash.helper.ts';
import log from './middlewares/logger.middleware.ts';

const seedCollections: Array<Record<string, boolean>> = [
  {
    users: true,
  },
];

class Seed {
  /**
   * Clear data from collection
   * @param name
   * @returns Promise<void>
   */
  async clearData(name: string): Promise<void> {
    // log.info(await db.getDatabase.collection(name).find());
    await db.getDatabase.collection(name).deleteMany({});
  }

  /**
   * Insert data in collection
   * @param name
   * @returns Promise<void>
   */
  async insertData(name: string): Promise<void> {
    // deno-lint-ignore no-explicit-any
    let data: any[];
    try {
      const _data = JSON.parse(await Deno.readTextFile(`./data/${name}.json`));
      if (_data && Array.isArray(_data)) {
        data = _data;
        if (name === 'users') {
          for (const d of data) {
            d.password = await HashHelper.encrypt(d.password);
          }
        }
        try {
          await db.getDatabase.collection(name).insertMany(data);
          log.info(`${name} seeded`);
        } catch (e) {
          log.error(e);
        }
      }
    } catch (e) {
      if (e === 'Invalid key length') {
        log.error(`Please shorten the 'KEY' in your .env`);
      } else {
        log.error(`${name}.json file not found in data dir`);
      }
    }
  }

  /** SeedCollection function */
  async seedCollection(): Promise<void> {
    for (const collection of seedCollections) {
      const names = Object.keys(collection);
      for (const name of names) {
        if (collection[name] === true) {
          await this.clearData(name);
          await this.insertData(name);
        }
      }
    }
  }
}

export default Seed;
