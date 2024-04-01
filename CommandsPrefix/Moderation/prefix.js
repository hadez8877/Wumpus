const { PermissionsBitField } = require("discord.js");
const changePrefix = require("../../Schemas/prefixSchema");

module.exports = {
  name: "prefix",
  description: "Establece un prefijo para el bot en tu servidor.",
  usage: "prefix <prefijo>",
  async execute(message, args) {
    const data = await changePrefix.findOne({ Guild: message.guild.id });
    let prefix;
    if (args[0] == 'reset') {
      prefix = "s!";
    } else {
      prefix = args[0];
    }

    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return message.reply({
        content: `<:UtilityMessageWarn:1200992221550358568> No tienes los permisos para usar este comando.`,
        allowedMentions: { RepliedUser: false },
      });

    if (!prefix) {
      return message.reply({
        content: `<:UtilityMessageWarn:1200992221550358568> Por favor, escribe un prefijo.`,
        allowedMentions: { RepliedUser: false },
      });
    }

    if (prefix.length > 5) {
      return message.reply({
        content: `<:UtilityMessageWarn:1200992221550358568> Por favor, escribe un prefijo menor de 5 letras.`,
        allowedMentions: { RepliedUser: false },
      });
    }

    if (!data) {
      await changePrefix.create({
        Guild: message.guild.id,
        Prefix: prefix,
      });
      message.reply({
        content: `<:UtilityVerifiedIcon:1200993235267489843> El prefix fue establecido a: \`\`${prefix}\`\`.`,
        allowedMentions: { RepliedUser: false },
      });
    } else if (data) {
      await changePrefix.findOneAndUpdate({
        Guild: message.guild.id,
        Prefix: prefix,
      });
      message.reply({
        content: `<:UtilityVerifiedIcon:1200993235267489843> El prefix fue modificado a: \`\`${prefix}\`\`.`,
        allowedMentions: { RepliedUser: false },
      });
    }
  },
};
