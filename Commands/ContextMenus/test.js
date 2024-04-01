const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("name")
  .setDescription("Description"),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {

    return await interaction.reply({ content: "Hola Mundo!", ephemeral: true });


  },
};