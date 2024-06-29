const { Message, Client, PermissionsBitField } = require("discord.js");
const { execute } = require("./ready");

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

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd =
      client.prefixs.get(command) ||
      client.prefixs.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(command)
      );

    if (!cmd) {
      if (!message.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) return;

      message.reply({ content: `<:WumpusCleaning:1234249326033637407> ¡Ups! El comando que has ejecutado no existe.`, allowedMentions: { repliedUser: false } });

      return;
    }

    try {
      await cmd.execute(message, args, client);
    } catch (err) {
      console.error(err);
    }
  },
};
