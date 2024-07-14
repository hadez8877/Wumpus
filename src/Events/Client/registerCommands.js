/* eslint-disable no-unused-vars */
const { ChatInputCommandInteraction, Client, PermissionsBitField } = require("discord.js");
const { sendTranslated } = require("../../functions/translate");

var timeout = new Set();

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });

    if (interaction.guild.id !== "1232079004677443604" && interaction.guild.id !== "1232762906630684723") return;
    if (!interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) return;

    const command = await client.commands.get(interaction.commandName);

    if (!command) return await interaction.editReply({ content: `<:UtilityMessageWarn:1234642338333196452> ${await sendTranslated("Este comando está desactualizado.", interaction.guild.id)}`, ephemeral: true });

    // cooldown
    if (command.cooldown) {
      const cooldown = command.cooldown * 1000;

      if (timeout.has(interaction.user.id)) return await interaction.editReply({ content: `<a:AnimatedLoaded:1257177494310752266> ${await sendTranslated(`Por favor, espera <t:${Math.floor(Date.now() / 1000 + cooldown / 1000)}:R> para volver a usar este comando.`, interaction.guild.id)}`, ephemeral: true });

      timeout.add(interaction.user.id);

      setTimeout(async () => {
        await timeout.delete(interaction.user.id);
      }, cooldown);
    }

    // administrator permission
    if (command.admin) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("No tienes los permisos suficientes para usar este comando.", interaction.guild.id)}`, ephemeral: true });
    }

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);
      return await interaction.editReply({ content: `<:WumpusCry:1234249327241592873> ${await sendTranslated("¡Hubo un error al ejecutar este comando!", interaction.guild.id)}\n\`\`\`${err}\`\`\``, ephemeral: true });
    }
  }
};
