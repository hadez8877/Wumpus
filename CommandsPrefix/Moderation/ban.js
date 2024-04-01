const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require("ms");

module.exports = {
  mod: true,
  name: "ban",
  description: "Banea a un usuario del servidor",
  options: "<user> [time] <reason>",
  async execute (message, args) {

    const user = message.mentions.members.first();
    const time = args[1];
    let reason = args.slice(2).join(' ');

    let timeInMs;
    if (time) {
      timeInMs = ms(time);
      if (!timeInMs) {
        reason = `${time} ${reason}`; 
        timeInMs = undefined; 
      }
    }

    function formatTime(ms) {
      if (ms < 1000) {
        return `${ms} milisegundo`;
      } else if (ms < 60000) {
        return `${ms / 1000} segundo`;
      } else if (ms < 3600000) {
        return `${ms / 60000} minuto`;
      } else if (ms < 86400000) {
        return `${ms / 3600000} hora`;
      } else {
        return `${ms / 86400000} día`;
      }
    }

    const msgTime = timeInMs ? formatTime(timeInMs) : "permanente";

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> No tienes los permisos para usar este comando.`, allowedMentions: { RepliedUser: false } });
    }

    if (!user) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, menciona un usuario valido.`, allowedMentions: { RepliedUser: false } });
    }

    if (!reason) {
      return await message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, proporciona una razón.`, allowedMentions: { RepliedUser: false }, });
    }

    if (reason.length > 100) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> La razón no puede superar los 100 caracteres.`, allowedMentions: { RepliedUser: false } });
    }

    if (user.id === message.member.id) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> ¡No puedes banearte a ti mismo!.`, allowedMentions: { RepliedUser: false } });
    }

    if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> ¡No puedes banear a este usuario!.`, allowedMentions: { RepliedUser: false } });
    }

    if (user.id === message.guild.ownerId) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> ¡No puedes banear al dueño del servidor!.`, allowedMentions: { RepliedUser: false } });
    }

    if (!user.bannable) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> ¡No puedo banear a este usuario!.`, allowedMentions: { RepliedUser: false } });
    }

    await user.ban({reason});

    await user.send({ content: `<:UtilityBanHammer:1208599111427821588> Fuiste **baneado** de el servidor **${message.guild.name}**:\n- Duración: ${msgTime}\n- Razón: ${reason}` });

    const msg = await message.reply({ content: `<:UtilityBanHammer:1208599111427821588> El usuario **${user.user.username}** \`[${user.id}]\` fue **baneado** por el motivo de: ${reason}`, allowedMentions: { RepliedUser: false } });

    setTimeout(() => {
      message.delete();
      msg.delete();
    }, 5000);

    const invite = await message.channel.createInvite();

    const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setLabel(`Enviado desde ${message.guild.name}`)
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.gg/${invite.code}`),
    )

    if (timeInMs !== undefined) {
      setTimeout(() => {
        message.guild.members.unban(user.id, 'Baneo expirado.');
        user.send({ content: `:innocent: <@${user.id}> tu **baneo** ha expirado, así que ya puedes entrar al servidor.`, components: [button] });
      }, timeInMs);
    }    
  },
};