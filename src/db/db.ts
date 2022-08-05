import { JSONDB } from "./../utils/dbUtil";
import { join } from "path";
import * as Lodash from "lodash";
import { Schema } from "./schema";

const filePath = join(__dirname, "data.json");
const defaultValue = {
  notifications: [],
  email_queue: [],
};

class dbWithLodash<T> extends JSONDB<T> {
  chain: Lodash.ExpChain<this["data"]> = Lodash.chain(this).get("data");
}

const database = new dbWithLodash<Schema>({
  filePath,
  default: defaultValue,
  name: "data",
});

(async () => await database.sync())();
(async () => await database.read())();

const db = database;
export default db;
export { db, database };
