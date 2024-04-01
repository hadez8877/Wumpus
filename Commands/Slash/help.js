const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Obtén información sobre mis comandos"),
  async execute(interaction) {},
};
