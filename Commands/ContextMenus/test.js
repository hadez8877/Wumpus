const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("name")
  .setDescription("Description"),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {},
};