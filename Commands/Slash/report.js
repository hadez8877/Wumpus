const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-bug")
    .setDescription("enviar un informe de bug a el desarrollador del bot"),
  async execute (interaction) {

    const modal = new ModalBuilder()
    .setTitle("Bugs & abuso de comandos")
    .setCustomId("reportModal")
    
    const command = new TextInputBuilder()
    .setCustomId("commandReport")
    .setRequired(true)
    .setPlaceholder("Por favor, escribe \"/\" si el comando es de barra diagonal.")
    .setLabel("Comando")
    .setStyle(TextInputStyle.Short)

    const about = new TextInputBuilder()
    .setCustomId("informationReport")
    .setRequired(true)
    .setPlaceholder("Escribe acerca sobre el error o abuso del comando detalladamente.")
    .setLabel("Información")
    .setStyle(TextInputStyle.Paragraph)

    const firstOption = new ActionRowBuilder().addComponents(command);
    const secondOption = new ActionRowBuilder().addComponents(about);

    modal.addComponents(firstOption, secondOption)
    
    interaction.showModal(modal);

  },
};