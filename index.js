const { Client, GatewayIntentBits, Partials, Collection, Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { loadEvents } = require("./Handlers/eventHandler");
require('dotenv').config();

  const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
  const { User, Message, GuildMember, ThreadMember } = Partials;
  
  const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
    partials: [User, Message, GuildMember, ThreadMember],
  });
  
  client.events = new Collection();
  client.commands = new Collection();
  client.prefixs = new Collection();
  
  loadEvents(client);

  //select menus
  client.on(Events.InteractionCreate, async i => {

    if (!i.isStringSelectMenu()) return;
  
    //serverinfo command
    if (i.customId === 'infomenu') {
      const value = i.values[0];

      switch (value) {
        case 'serverinfo':
          const server = await client.guilds.fetch(i.guild.id);

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
      
          var menu = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("infomenu")
            .setPlaceholder("Haz clic en una opción")
            .addOptions(
              { label: "Servidor", value: "serverinfo", emoji: "🏠", description: "Muestra la información del servidor", default: true },
              { label: "Emojis", value: "emojisinfo", emoji: "🏜", description: "Muestra los emojis del servidor" },
            )
          )

          var button = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("✖︎")
            .setStyle(ButtonStyle.Danger),
      
            new ButtonBuilder()
            .setCustomId("servericon")
            .setLabel("Ver ícono del Servidor")
            .setStyle(ButtonStyle.Secondary)
          )
      
          return await i.update({ embeds: [embed], components: [menu, button] });
        break;
        case 'emojisinfo':
          var emojisArray = [];
          const emojis = await i.guild.emojis.fetch();

          await emojis.forEach(async emoji => {
            if (emoji.animated) {
              emojisArray.push(`<a:${emoji.name}:${emoji.id}>`);
            } else {
              emojisArray.push(`<:${emoji.name}:${emoji.id}>`);
            }
          });

          if (emojisArray.length > 0) {
            var embed = new EmbedBuilder()
            .setTitle(`Emojis de ${i.guild.name}`)
            .setDescription(`${emojisArray.join(' ')}`)
            .setColor("Blurple")
            .setTimestamp();

            var menu = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
              .setCustomId("infomenu")
              .setPlaceholder("Haz clic en una opción")
              .addOptions(
                { label: "Servidor", value: "serverinfo", emoji: "🏠", description: "Muestra la información del servidor" },
                { label: "Emojis", value: "emojisinfo", emoji: "🏜", description: "Muestra los emojis del servidor", default: true },
              ),
            )

            var button = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId("delete")
              .setLabel("✖︎")
              .setStyle(ButtonStyle.Danger),
        
              new ButtonBuilder()
              .setCustomId("servericon")
              .setLabel("Ver ícono del Servidor")
              .setStyle(ButtonStyle.Secondary)
            )

            return await i.update({ embeds: [embed], components: [menu, button] });
          } else {
            return await i.reply({ content: "<:WumpusCry:1187860169707749486> Este servidor no tiene emojis.", ephemeral: true });
          }
        break;
      }
    }


  });

  client.login(process.env.TOKEN);