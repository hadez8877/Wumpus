const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { sendTranslated } = require("../Functions/translate");
const subscribe = require("../Schemas/subscribeSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("subscribe")
    .setDescription("¡Activa a Wumpus!")
    .addStringOption(option => option.setName("language").setDescription("Escoge el lenguaje en el que responda el bot").addChoices(
      { name: "Español", value: "es" },
      { name: "English", value: "en" },
      { name: "Português", value: "pt" },
      { name: "Deutsch", value: "de" },
      { name: "Italiano", value: "it" },
      { name: "日本語", value: "ja" },
      { name: "中文", value: "zh" },
      { name: "한국어", value: "ko" },
      { name: "Русский", value: "ru" },
      { name: "العربية", value: "ar" }
    ).setRequired(true))
    .addStringOption(option => option.setName("prefix").setDescription("Selecciona un prefijo para el bot").setRequired(false))
    .addBooleanOption(option => option.setName("notifications").setDescription("Recibe una notificación si el bot ha sido desactivado").setRequired(false)),
  admin: true,


  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {

    const { options } = interaction;

    const language = options.getString("language");
    const prefix = options.getString("prefix");
    const notifications = options.getBoolean("notifications") || false;

    var data = await subscribe.findOne({ Guild: interaction.guild.id });

    var embed;

    if (data) {
      if (data.Language === language) return await interaction.editReply({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("Actualmente, el lenguaje que ha escogido **ya esta establecido**.", interaction.guild.id)}` });
      if (data.Prefix === prefix) return await interaction.editReply({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("El prefijo que has ingresado **ya se está usando**.", interaction.guild.id)}` });

      if (data.Notifications === notifications && notifications === true) return await interaction.editReply({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("Actualmente, las notificaciones **ya están activadas**.", interaction.guild.id)}` });
      if (data.Notifications === notifications && notifications === false) return await interaction.editReply({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("Actualmente, las notificaciones **ya están desactivadas**.", interaction.guild.id)}` });

      await subscribe.findOneAndUpdate({
        Guild: interaction.guild.id,
        Language: language,
        Prefix: prefix,
        Notifications: notifications
      });

      let languageReplace = language
        .replace("es", "Español")
        .replace("en", "English")
        .replace("pt", "Português")
        .replace("de", "Deutsch")
        .replace("it", "Italiano")
        .replace("ja", "日本語")
        .replace("zh", "中文")
        .replace("ko", "한국어")
        .replace("ru", "Русский")
        .replace("ar", "العربية");

      let notificationsReplace;

      if (notifications === true) notificationsReplace = "ON"
      else notificationsReplace = "OFF"

      embed = new EmbedBuilder()
      .setTitle(`<:WumpusPencil:1234249332237275186> ${await sendTranslated("La configuración ha sido modificada:", interaction.guild.id)}`)
      .setDescription(`${await sendTranslated(`Se ha modificado la configuración del bot.`, interaction.guild.id)} ${await sendTranslated(`Si deseas revertirla, simplemente utiliza nuevamente el comando`, interaction.guild.id)} </subscribe:1256745177188663367>.`)
      .addFields(
        { name: "\u200B", value: "\u200B" },
        { name: `🗣️ ${await sendTranslated("Lenguaje:", interaction.guild.id)}`, value: `\`\`${languageReplace}\`\``, inline: true },
        { name: `💾 ${await sendTranslated("Prefijo:", interaction.guild.id)}`, value: `\`\`${prefix ?? "s!"}\`\``, inline: true },
        { name: `📣 ${await sendTranslated("Notificaciones:", interaction.guild.id)}`, value: `\`\`${notificationsReplace}\`\``, inline: true }
      )
      .setThumbnail(`${interaction.guild.iconURL()}`)
      .setImage("https://imgur.com/XBreGNb.png")
      .setColor("Blurple")
      .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } else {
      await subscribe.create({
        Guild: interaction.guild.id,
        Language: language,
        Prefix: prefix,
        Notifications: notifications
      });

      let languageReplace = language
      .replace("es", "Español")
      .replace("en", "English")
      .replace("pt", "Português")
      .replace("de", "Deutsch")
      .replace("it", "Italiano")
      .replace("ja", "日本語")
      .replace("zh", "中文")
      .replace("ko", "한국어")
      .replace("ru", "Русский")
      .replace("ar", "العربية");

      let notificationsReplace;

      if (notifications === true) notificationsReplace = "ON"
      else notificationsReplace = "OFF"

      embed = new EmbedBuilder()
      .setTitle(`<:WumpusWave:1234249340445266023> ${await sendTranslated("¡Se ha establecido la configuración!:", interaction.guild.id)}`)
      .setDescription(`${await sendTranslated(`La configuración del bot se ha completado con éxito.`, interaction.guild.id)} ${await sendTranslated(`Ahora está listo para ser utilizado en tu servidor.`, interaction.guild.id)} ${await sendTranslated(`¡Disfruta explorando todas las funciones y posibilidades que ofrece!`, interaction.guild.id)}`)
      .addFields(
        { name: "\u200B", value: "\u200B" },
        { name: `🗣️ ${await sendTranslated("Lenguaje:", interaction.guild.id)}`, value: `\`\`${languageReplace}\`\``, inline: true },
        { name: `💾 ${await sendTranslated("Prefijo:", interaction.guild.id)}`, value: `\`\`${prefix ?? "s!"}\`\``, inline: true },
        { name: `📣 ${await sendTranslated("Notificaciones:", interaction.guild.id)}`, value: `\`\`${notificationsReplace}\`\``, inline: true }
      )
      .setThumbnail(`${interaction.guild.iconURL()}`)
      .setImage("https://imgur.com/v7YpnCE.png")
      .setColor("Blurple")
      .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }


  },
};