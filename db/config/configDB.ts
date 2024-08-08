import labelType from "@/utils/labels";
import DBError from "@/utils/errors/DBError";
import mongoose from "mongoose";

import "dotenv/config";

async function configDB() {
  if (!process.env.DB_PORT)
    console.warn(
      `${labelType.WARNING} It is necessary to connect to a database, as certain commands do not work without it.`,
    );
  else {
    await mongoose.connect(process.env.DB_PORT).catch((err) => {
      if (err instanceof Error) throw new DBError(12002, err);
      else {
        throw new DBError(12002, "Unknown error occurred")
      }
    });
  }
}

export default configDB;
