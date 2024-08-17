import DBError from "../src/plugins/errors/DBError";
import logger from "../src/logger";
import mongoose from "mongoose";

import "dotenv/config";

const db = {
  connect: async () => {
    if (!process.env.DB_PORT)
      logger.warn("It is necessary to connect to a database, as certain commands do not work without it.");
    else {
      await mongoose.connect(process.env.DB_PORT).catch((err) => {
        if (err instanceof Error) throw new DBError(12002, err);
        else {
          throw new DBError(12002, "Unknown error occurred");
        }
      });
    }
  },

  disconnect: async () => {
    await mongoose.disconnect().catch((err) => {
      logger.error("An error occurred while disconnecting the database:", err);

      process.exit(1);
    });
  }
};

export default db;
