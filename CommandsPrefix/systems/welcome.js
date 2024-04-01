const { PermissionsBitField, ChannelType } = require("discord.js");
const welcome = require("../../Schemas/welcomeSchema");

module.exports = {
  name: "welcome",
  description: "welcome message system",
  aliases: ["wlc", "wl"],
  options: "<sub> <action> <channel || message>",
  async execute (message, args) {

    const { guild } = message;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> No tienes los permisos para usar este comando.`, allowedMentions: { RepliedUser: false }, });

    const sub = args[0];
    const action = args[1];
    const data = await welcome.findOne({ Guild: guild.id });

    if (sub == 'channel') {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

        if (!channel || channel.type !== ChannelType.GuildText) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, específica un canal de texto válido.`, allowedMentions: { RepliedUser: false }, });

        if (action == 'add') {

            if (data) {
                return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> ¡Ups! Parece que ya existe un canal de bienvenida configurado.`, allowedMentions: ({ repliedUser: false }), });
            } else {

                await welcome.create({
                    Guild: guild.id,
                    Channel: channel.id,
                })

                return message.reply({ content: `<:UtilityVerifiedIcon:1200993235267489843> Se agregó ${channel} como canal de bienvenidas.`, allowedMentions: ({ repliedUser: false }), });
            }
        } else if (action == 'remove') {

            if (!data || !data.Channel.includes(channel.id)) {
                return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> ¡Ups! Parece que ese canal no es de bienvenidas, así que no puedo eliminarlo.`, allowedMentions: ({ repliedUser: false }), });
            } else {

                await welcome.deleteOne({
                    Guild: guild.id,
                    Channel: channel.id,
                })

                return message.reply({ content: `<:UtilityVerifiedIcon:1200993235267489843> Se eliminó ${channel} como canal de bienvenidas.`, allowedMentions: ({ repliedUser: false }), });
            }
        }
    }

    if (sub == 'message') {
        const msg = args.slice(2).join(' ');

        if (!msg) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, escribe un mensaje de bienvenida.`, allowedMentions: { RepliedUser: false }, });

        if (action == 'add') {
            if (data) {
                await welcome.updateOne(
                    { Guild: guild.id },
                    { $push: { Message: msg } }
                );
                return message.reply({ content: `<:UtilityVerifiedIcon:1200993235267489843> Su mensaje de bienvenida se ha agregado correctamente.`, allowedMentions: ({ repliedUser: false }), });
            } else {
                await welcome.create({
                    Guild: guild.id,
                    Message: msg,
                });
                return message.reply({ content: `<:UtilityVerifiedIcon:1200993235267489843> Su mensaje de bienvenida se añadió correctamente.`, allowedMentions: ({ repliedUser: false }), });
            }
        } else if (action === 'remove') {
            if (!data || !data.Message.includes(msg)) {
              return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> ¡Ups! Parece que ese mensaje de bienvenida no existe o no es exacto, por eso no puedo eliminarlo...`, allowedMentions: { repliedUser: false } });
            } else {
              await welcome.updateOne(
                { Guild: guild.id },
                { $pull: { Message: msg } }
              );
              return message.reply({ content: `<:UtilityVerifiedIcon:1200993235267489843> Se ha eliminado el mensaje de bienvenida correctamente.`, allowedMentions: { repliedUser: false } });
            }
        }
    }
  },
};