import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const existsFile = promisify(fs.exists);

class Cache {
  private values: Record<string, any>;

  constructor(private cacheFile: string) {
  }

  async set(key: string, value: any, timeout: number) {
    const values = await this.getValues();
    values[key] = { value, expiredAt: Date.now() + timeout };
    return writeFile(cacheFile, JSON.stringify(values));
  }

  async get<T>(key: string, creator: () => T | Promise<T>, timeout: number = 30 * 1000): Promise<T> {
    const values = await this.getValues();
    if (values[key] !== undefined && values[key].expiredAt > Date.now()) {
      return values[key].value;
    }
    const value = await creator();
    await this.set(key, value, timeout);
    return value;
  }

  private async getValues() {
    if (this.values === undefined) {
      const existes = await existsFile(this.cacheFile);
      if (!existes) {
        const writeStream = fs.createWriteStream(this.cacheFile);
        writeStream.write("{}");
        writeStream.close();
      }

      const content = await readFile(this.cacheFile);
      this.values = JSON.parse(content.toString()) as Record<string, any> || {};
    }
    return this.values;
  }

}

const cacheFile = path.resolve(__dirname, '..', '.cache.json');

export const cache = new Cache(cacheFile);
