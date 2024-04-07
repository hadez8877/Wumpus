const { Message, Client, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Muestra información sobre un servidor",

  /**
   *
   * @param {Message} message
   * @param {Client} client 
   */
  async execute (message, args, client) {

    const server = await client.guilds.fetch(message.guild.id);

    var embed;
    if (server.iconURL()) {
      embed = new EmbedBuilder()
      .setAuthor({ name: `${server.name}`, iconURL: `${server.iconURL()}` })
      .setThumbnail(`${server.iconURL()}`)
      .addFields(
        { name: ":id: ID del Servidor:", value: `\`${server.id}\``, inline: true },
        { name: ":crown: Dueño/a:", value: `<@${server.ownerId}>`, inline: true },
        { name: ":calendar: Fecha creación:", value: `<t:${Math.floor(server.createdTimestamp / 1000)}:d>`, inline: true },
        { name: ":island: Descripción:", value: `${server.description || "No tiene descripción."}`, inline: true },
        { name: ":crystal_ball: Mejoras:", value: `${server.premiumSubscriptionCount || "0"}`, inline: true },
        { name: ":speech_balloon: Canales:", value: `${server.channels.cache.size}`, inline: true },
        { name: ":busts_in_silhouette: Miembros:", value: `${server.memberCount}`, inline: true },
        { name: ":crossed_swords: Roles:", value: `${server.roles.cache.size}`, inline: true }
      )
      .setColor("Blurple")
      .setTimestamp();
    } else {
      embed = new EmbedBuilder()
      .setAuthor({ name: `${server.name}` })
      .addFields(
        { name: ":id: ID del Servidor:", value: `\`${server.id}\``, inline: true },
        { name: ":crown: Dueño/a:", value: `<@${server.ownerId}>`, inline: true },
        { name: ":calendar: Fecha creación:", value: `<t:${Math.floor(server.createdTimestamp / 1000)}:d>`, inline: true },
        { name: ":island: Descripción:", value: `${server.description || "No tiene descripción."}`, inline: true },
        { name: ":crystal_ball: Mejoras:", value: `${server.premiumSubscriptionCount || "0"}`, inline: true },
        { name: ":speech_balloon: Canales:", value: `${server.channels.cache.size}`, inline: true },
        { name: ":busts_in_silhouette: Miembros:", value: `${server.memberCount}`, inline: true },
        { name: ":crossed_swords: Roles:", value: `${server.roles.cache.size}`, inline: true }
      )
      .setColor("Blurple")
      .setTimestamp();
    }

    const menu = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
      .setCustomId("infomenu")
      .setPlaceholder("Haz clic en una opción")
      .addOptions(
        { label: "Servidor", value: "serverinfo", emoji: "🏠", description: "Muestra la información del servidor", default: true },
        { label: "Emojis", value: "emojisinfo", emoji: "🏜", description: "Muestra los emojis del servidor" },
      )
    )

    const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("delete")
      .setLabel("✖︎")
      .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
      .setLabel("Ver ícono del Servidor")
      .setStyle(ButtonStyle.Link)
      .setURL(`${server.iconURL()}`)
    )

    const msg = await message.reply({ embeds: [embed], components: [menu, button], allowedMentions: ({ repliedUser: false }) });
    const collector = msg.createMessageComponentCollector();
    collector.on('collect', async i => {

      if (!i.isButton()) return;
      if (i.user.id !== message.author.id) return;

      if (i.customId == 'delete') {
        await msg.delete();
      }


    });


  },
};