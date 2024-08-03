import labelType from "@/utils/labels";
import DBError from "@/utils/errors/DBError";
import mongoose from "mongoose";

import "dotenv/config";

async function configDB() {
    if (!process.env.DB_PORT) return console.warn(`${labelType.WARNING} It is necessary to connect to a database, as certain commands do not work without it.`);
    else {
        try {
            await mongoose.connect(process.env.DB_PORT);
        } catch (err) {
            throw new DBError(12002);
        }
    }
};

export default configDB;
