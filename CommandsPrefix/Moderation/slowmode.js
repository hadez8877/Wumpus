const { PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
  mod: true,
  name: "slowmode",
  aliases: ["sm"],
  description: "Limita la frecuencia de mensajes en el canal",
  options: "[channel] <seconds>",
  async execute (message, args) {
    let channel = message.channel;
    let seconds = args[0];

    if (isNaN(seconds)) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, específica un número válido.`, allowedMentions: { RepliedUser: false }, });

    if (message.mentions.channels.size > 0) {
      channel = message.mentions.channels.first();
      seconds = args[1];
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> No tienes los permisos para usar este comando.`, allowedMentions: { RepliedUser: false }, });
    if (channel.type !== ChannelType.GuildText) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, específica un canal de texto válido.`, allowedMentions: { RepliedUser: false }, });

    channel.setRateLimitPerUser(seconds).catch(err => {
        return;
    })

    const msg = await message.reply({ content: `<:UtilityIconSlowmode:1211788252655132774> El canal ${channel} ahora tiene **${seconds}s** de slowmode.`, allowedMentions: { RepliedUser: false }, });
    setTimeout(async () => {
      await msg.delete();
      await message.delete();
    }, 5000);
  },
};