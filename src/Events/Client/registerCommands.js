const { Message, Client, PermissionsBitField } = require("discord.js");
const whitelist = require("../../modals/whitelistSchema");

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
    const prefix = "s!";

    const developers = ["1173072980000112671"];

    if (!message.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) return;
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!data) return;

    var data = await whitelist.findOne({ Guild: message.guild.id });
    if (!data) return;

    const args = message.content.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.prefixs.get(command) || client.prefixs.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

    if (!cmd) return await message.reply({ content: "<:WumpusCleaning:1234249326033637407> ¡Ups! El comando que has ejecutado no existe.", allowedMentions: { repliedUser: false } });

    // commands only for developers
    if (cmd.developer && !developers.includes(message.member.id)) return await message.reply({ content: "<:BadgeSlashCommands:1234642175116054608> Este comando solo puede ser utilizado por el creador de Wumpus.", allowedMentions: { repliedUser: false } });

    // cooldown
    if (cmd.cooldown) {
      const cooldown = cmd.cooldown * 1000;

      if (timeout.has(message.member.id)) return await message.reply({ content: `<a:AnimatedLoaded:1257177494310752266> Por favor, espera <t:${Math.floor(Date.now() / 1000 + cooldown / 1000)}:R> para volver a usar este comando.`, allowedMentions: { repliedUser: false } });

      timeout.add(message.member.id);

      setTimeout(() => {
        timeout.delete(message.member.id);
      }, cooldown);
    }

    // administrator permission
    if (cmd.admin) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await message.reply({ content: "<:UtilityMessageInteractionWarn:1234642336580108298> No tienes los permisos suficientes para usar este comando.", allowedMentions: { repliedUser: false } });
    }

    try {
      await cmd.execute(message, args, client);
    } catch (err) {
      console.error(err);
      return await message.reply({ content: `<:WumpusCry:1234249327241592873> ¡Hubo un error al ejecutar este comando!\n\`\`\`${err}\`\`\``, allowedMentions: { repliedUser: false } });
    }
  }
};