const { Client, ActivityType } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");
const { loadPrefixs } = require("../../Handlers/prefixHandler");
const mongoose = require("mongoose");
const { mongoURL } = require("../../config.json");

module.exports = {
  name: "ready",
  once: true,
  /**
   * 
   * @param {Client} client 
   */
  execute: async (client) => {
    console.log("El cliente se ha iniciado");

    loadCommands(client);
    loadPrefixs(client);

    async function Status() {
      const server = await client.guilds.fetch("1173050886352818217");

      client.user.setPresence({
        activities: [{
            name: `${server.memberCount} personas`,
            type: ActivityType.Watching,
          }],
        status: 'online',
      });
    }

    Status();
    setInterval(Status, 300000);

    if (mongoURL) {
      try {
        await mongoose.connect(mongoURL);
        console.log("Conectado a la base de datos");
      } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
      }
    }
  },
};
