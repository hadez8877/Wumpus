/* eslint-disable no-unused-vars */
const { ChatInputCommandInteraction, Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { models } = require("mongoose");
const { sendTranslated } = require("../Functions/translate");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("unsubscribe")
  .setDescription("Desactiva al bot y borra todos los datos")
  .addBooleanOption(option => option.setName("leave").setDescription("¿Deseas que el bot abandone el servidor?").setRequired(false)),
  admin: true,

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client 
   */
  async execute(interaction, client) {

    const { options } = interaction;

    const leave = options.getBoolean("leave") || false;
    const guild = await client.guilds.fetch(interaction.guild.id);

    const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("ApproveEvent")
      .setLabel("Sí")
      .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
      .setCustomId("DenyEvent")
      .setLabel("No")
      .setStyle(ButtonStyle.Secondary)
    );

    const msg = await interaction.editReply({ content: `<:WumpusCry:1234249327241592873> ${await sendTranslated(" ¿Estás seguro de eliminar todos los datos?", interaction.guild.id)}`, components: [buttons] });

    const collector = await msg.createMessageComponentCollector({
      componentType: ComponentType.Button
    });

    await collector.on('collect', async i => {
      if (i.customId === "ApproveEvent") {
        for (const modelName in models) {
          const model = models[modelName];
          const count = await model.countDocuments({ Guild: i.guild.id });
    
          if (!count > 0) return await i.editReply({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("No se ha encontrado ningún dato relacionado con el servidor.", i.guild.id)}` });
    
          await model.deleteMany({ Guild: i.guild.id });

          await i.editReply({ content: `<:UtilityVerifiedIcon:1234642340157591653> ${await sendTranslated("Se ha eliminado todos los datos relacionados con servidor.", i.guild.id)}` });

          if (leave === true) await guild.leave();
          else return;
        }
      } else if (i.customId === "DenyEvent") {
        await i.editReply({ content: `<:WumpusPopcorn:1234249333784969247> ${await sendTranslated("Se ha cancelado el proceso de eliminación de datos.", i.guild.id)}` });
      }
    });


  },
};