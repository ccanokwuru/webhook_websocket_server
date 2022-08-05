import * as fs from "fs";

interface DBConfig {
  default?: object;
  filePath?: string;
  name?: string;
}

export class JSONDB<T> {
  private readonly DBPath: string = "db.json";
  private readonly DBName: string = "default_database";
  private readonly DBDefaults: object | string = {};

  data?: T;

  constructor(config: DBConfig) {
    //   define db file path, name , and default values
    if (config.filePath) this.DBPath = config.filePath;
    if (config.default) this.DBDefaults = config.default;
    if (config.name) this.DBName = config.name;
    return this;
  }

  sync() {
    //   check if file exists then
    //   create file if not exist & populate with defaults
    //   read file content and connect to file content
    const path = this.DBPath;
    const defaults =
      typeof this.DBDefaults === "object"
        ? JSON.stringify(this.DBDefaults)
        : this.DBDefaults;
    if (!fs.existsSync(path))
      try {
        fs.writeFile(path, defaults, (err) => {
          if (err) throw err;
          console.log(`The "${this.DBName} Database" was created succesfully!`);
        });
      } catch (error) {
        console.log(error);
      }
    return this.read();
  }

  async drop() {
    //   delete the db file
    try {
      fs.rm(this.DBPath, (err) => {
        if (err) throw err;
        return `The "${this.DBName} Database" was droped succesfully!`;
      });
    } catch (error) {
      console.log(error);
    }
    return;
  }

  async clear() {
    //   clear db file content to default values of config
    this.data =
      typeof this.DBDefaults === "object"
        ? this.DBDefaults
        : JSON.parse(this.DBDefaults);
    await this.save();
  }

  async read() {
    //   read file content
    try {
      const dataRead = await fs.readFileSync(this.DBPath, {
        encoding: "utf-8",
      });
      this.data = dataRead
        ? JSON.parse(dataRead)
        : typeof this.DBDefaults === "object"
        ? this.DBDefaults
        : JSON.parse(this.DBDefaults);
    } catch (error) {
      console.log(error);
    }
    return this;
  }

  save() {
    //   write changes to file
    try {
      fs.writeFile(this.DBPath, JSON.stringify(this.data), (err) => {
        if (err) throw err;
        console.log(`Data saves to "${this.DBName} Database" was succesfully!`);
      });
    } catch (error) {
      console.log(error);
    }
    return this.read();
  }
}
