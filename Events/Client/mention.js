const { Events, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const changePrefix = require("../../Schemas/prefixSchema");

module.exports = {
  name: Events.MessageCreate,

  /**
   *
   * @param {Message} message
   */
  async execute(message, client) {

    changePrefix.findOne({ Guild: message.guild.id }).then(async data => {
      
        const prefix = data ? data.Prefix : 's!';

        async function sendMessage(reply) {

            const embed = new EmbedBuilder()
            .setAuthor({ name: `¡Hola, ${message.author.displayName}!`, iconURL: `${message.author.displayAvatarURL ({dynamic: true})}` })
            .setTitle("¿Necesitas ayuda? <:WumpusWave:1186727348524023891>")
            .setDescription(`**Si estas buscando ayuda con los comandos**, utilice </help:1206452636182913037>. De lo contrario, envía un mensaje privado para ponerse en contacto directamente con el personal.\n\n**Consejo:** puedes usar \`${prefix}prefix <prefijo>\` para establecer el prefix del bot`)
            .setColor(`#404EED`)
            .setTimestamp();
    
            const button = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId("help")
              .setEmoji("❓")
              .setLabel("Ayuda")
              .setStyle(ButtonStyle.Primary),
              
              new ButtonBuilder()
              .setEmoji("🆘")
              .setLabel("Server Support")
              .setStyle(ButtonStyle.Link)
              .setURL("https://discord.gg/hGhu7C5yZB")
              .setDisabled(true),
            )
    
            if (!reply) {
              await message.reply({ embeds: [embed], components: [button], allowedMentions: ({ repliedUser: false }), });
            } else {
              await message.reply({ embeds: [embed], components: [button], allowedMentions: ({ repliedUser: false }), });
            }
          }
    
          if (message.mentions.users.first() === client.user && !message.content.slice(message.mentions.users.first().toString().length)) {
            if (message.reference) {
              sendMessage(true);
            } else {
              sendMessage();
            }
          }
    })


  },
};