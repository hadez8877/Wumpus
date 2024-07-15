const { Client, ActivityType } = require("discord.js");
const { loadPrefixs } = require("../../handlers/prefixHandler");
const mongoose = require("mongoose");

require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  execute: async (client) => {
    loadCommands(client);
    loadPrefixs(client);

    client.user.setPresence({
      activities: [
        {
          name: "I dont work! (really).",
          type: ActivityType.Custom
        }
      ]
    });

    if (process.env.MONGOURL) {
      try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("Connected to the database.");
      } catch (error) {
        console.error("Error connecting to database:", error);
      }
    }

    console.log("The client has started!");
  }
};
