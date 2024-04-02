const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");
require('dotenv').config();

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription("Generar un enlace permanentemente disponible para una imagen")
    .addAttachmentOption(option => option.setName("imagen").setDescription("Escoge tu imagen que deseas generar un enlace").setRequired(true)),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {

    await interaction.deferReply();

    const { options } = interaction;
    const image = options.getAttachment("imagen");
    const imageUrl = image.url;

    if (!image.name.match(/\.(png|jpe?g)$/)) return await interaction.editReply({ content: "<:UtilityMessageWarn:1200992221550358568> Solo se permiten imágenes en formato PNG o JPG." });
    
    try {
      const response = await axios.post("https://api.imgur.com/3/image", { image: imageUrl }, { headers: { Authorization: `Client-ID ${process.env.IMGURID}`, "Content-Type": "application/json" } } );

      var embed;
      if (interaction.guild.icon) {
        embed = new EmbedBuilder()
        .setAuthor({ name: `¡Se ha subido tu imagen, ${interaction.user.displayName}!`, iconURL: `${interaction.user.displayAvatarURL()}` })
        .setDescription(`:point_right: **Tu imagen ha sido subida exitosamente**. Puedes verla y compartirla utilizando el enlace permanente que se ha generado en este boton.`)
        .setColor("Blurple")
        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
        .setTimestamp();
      } else {
        embed = new EmbedBuilder()
        .setAuthor({ name: `¡Se ha subido tu imagen, ${interaction.user.displayName}!`, iconURL: `${interaction.user.displayAvatarURL()}` })
        .setDescription(`:point_right: **Tu imagen ha sido subida exitosamente**. Puedes verla y compartirla utilizando el enlace permanente que se ha generado en este boton.`)
        .setColor("Blurple")
        .setFooter({ text: `${interaction.guild.name}` })
        .setTimestamp();
      }

      const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel("Ver Imagen")
        .setStyle(ButtonStyle.Link)
        .setURL(`${response.data.data.link}`)
      )

      if (response.status === 200) return await interaction.editReply({ embeds: [embed], components: [button] });
      else {
        return await interaction.editReply({ content: "<:UtilityMessageWarn:1200992221550358568> Ocurrió un error al generar el enlace. Por favor, vuelve a intentarlo." });
      }
    } catch (err) {
      console.error(err);
      return await interaction.editReply({ content: "<:UtilityMessageWarn:1200992221550358568> Ocurrió un error al generar el enlace. Por favor, vuelve a intentarlo." });
    }


  },
};