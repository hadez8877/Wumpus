module.exports = {
  name: "8ball",
  aliases: ["8b"],
  description: "🎱 Haz una pregunta a la bola mágica",
  usage: "8ball <pregunta>",

  execute(message, args) {
    const pregunta = args.join(" ");

    if (!pregunta) {
      return message.reply({
        content: "<:WumpusPencil:1187860167967125544> Pregunta algo.",
        allowedMentions: { repliedUser: false },
      });
    }

    let respuestas = [
      ":8ball: Sí.",
      ":8ball: No.",
      ":8ball: Tal vez...",
      ":8ball: Tal vez no.",
      ":8ball: Tal vez sí.",
      ":8ball: Creo que sí.",
      ":8ball: Creo que no.",
      ":8ball: Eso es demasiado obvio.",
      ":8ball: Pregúntame otra cosa, ¿sí?.",
    ];

    const random = Math.floor(Math.random() * respuestas.length);

    message.reply({ content: `${respuestas[random]}`, allowedMentions: { repliedUser: false }, });
  },
};
