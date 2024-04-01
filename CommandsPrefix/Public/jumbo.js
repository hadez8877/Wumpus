module.exports = {
  name: "jumbo",
  description: "Muestra un emoji en formato jumbo",
  usage: "jumbo <emoji>",
  execute(message, args) {

    if (args.length !== 1) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, proporciona solo un emoji.`, allowedMentions: { repliedUser: false }, });
    }

    const emoji = args[0];
    const regex = /^<a?:[a-zA-Z0-9_]+:\d+>|<:[a-zA-Z0-9_]+:\d+>$/;

    if (!regex.test(emoji)) {
      return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, proporciona un emoji valido.`, allowedMentions: { repliedUser: false }, });
    }

    const emojiURL = `https://cdn.discordapp.com/emojis/${emoji.replace(/[^0-9]/g, "")}.png?size=1024`;

    message.channel.send(`${emojiURL}`)
  },
};
