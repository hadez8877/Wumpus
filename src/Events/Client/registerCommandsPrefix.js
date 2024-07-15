const { Message, Client, PermissionsBitField } = require("discord.js");
const subscribe = require("../../modals/subscribeSchema");
const { sendTranslated } = require("../../functions/translate");
const { execute } = require("./ready");

var timeout = new Set();

module.exports = {
  name: "messageCreate",
  once: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const data = await subscribe.findOne({ Guild: message.guild.id });
    const prefix = data?.Prefix || "s!";

    const developers = ["1173072980000112671"];

    if (!message.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) return;
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!data) return;

    const args = message.content.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.prefixs.get(command) || client.prefixs.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

    if (!cmd) return await message.reply({ content: `<:WumpusCleaning:1234249326033637407> ${await sendTranslated("¡Ups! El comando que has ejecutado no existe.", message.guild.id)}`, allowedMentions: { repliedUser: false } });

    // commands only for developers
    if (cmd.developer && !developers.includes(message.member.id)) return await message.reply({ content: `<:BadgeSlashCommands:1234642175116054608> ${await sendTranslated("Este comando solo puede ser utilizado por el creador de Wumpus.", message.guild.id)}`, allowedMentions: { repliedUser: false } });

    // cooldown
    if (cmd.cooldown) {
      const cooldown = command.cooldown * 1000;

      if (timeout.has(message.member.id))
        return await message.reply({
          content: `<a:AnimatedLoaded:1257177494310752266> ${await sendTranslated(`Por favor, espera <t:${Math.floor(Date.now() / 1000 + cooldown / 1000)}:R> para volver a usar este comando.`, message.guild.id)}`,
          allowedMentions: { repliedUser: false }
        });

      timeout.add(message.member.id);

      setTimeout(async () => {
        await timeout.delete(message.member.id);
      }, cooldown);
    }

    // administrator permission
    if (cmd.admin) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return await message.reply({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("No tienes los permisos suficientes para usar este comando.", message.guild.id)}`, allowedMentions: { repliedUser: false } });
    }

    try {
      await cmd.execute(message, args, client);
    } catch (err) {
      console.error(err);
      return await message.reply({ content: `<:WumpusCry:1234249327241592873> ${await sendTranslated("¡Hubo un error al ejecutar este comando!", message.guild.id)}\n\`\`\`${err}\`\`\``, allowedMentions: { repliedUser: false } });
    }
  }
};
