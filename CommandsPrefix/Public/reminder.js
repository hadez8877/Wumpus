const { Message, EmbedBuilder } = require("discord.js");
const reminder = require("../../Schemas/reminderSchema");
const ms = require("ms");

module.exports = {
  name: "reminder",
  aliases: ["rm"],
  description: "recuerda algo",
  options: "<sub> <time> <message>",

  /**
   * 
   * @param {Message} message 
   */
  async execute(message, args) {
    
    const sub = args[0];
    var data = await reminder.findOne({ User: message.author.id });

    if (sub == "set") {}
  },
};
