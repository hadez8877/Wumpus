const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {

    if (interaction.customId === 'reportModal') {
        const command = interaction.fields.getTextInputValue('commandReport');
        const about = interaction.fields.getTextInputValue('informationReport');

        const user = interaction.user;
        const guild = interaction.guild;

        const dev = await client.users.fetch('837110416416702494');
        const channel = await client.channels.fetch('1211389062884106432');

        
        const components = [];

        if (guild) {
          const invite = await interaction.channel.createInvite({ maxAge: 0, maxUses: 0 });          

            components.push(
                new ButtonBuilder()
                .setCustomId("accept")
                .setLabel("Aceptar y publicar")
                .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                .setLabel("Invitación al servidor")
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.gg/${invite.code}`),

                new ButtonBuilder()
                .setCustomId("deny")
                .setLabel("Denegar")
                .setStyle(ButtonStyle.Danger)
            );
        } else {
          components.push(
            new ButtonBuilder()
            .setCustomId("accept")
            .setLabel("Aceptar y publicar")
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setCustomId("deny")
            .setLabel("Denegar")
            .setStyle(ButtonStyle.Danger)
          );
        }

        const button = new ActionRowBuilder().addComponents(components);

        interaction.reply({ content: `<:UtilityApplicationPending:1211399149594087444> El reporte ha sido enviado al desarrollador.`, ephemeral: true });

        const msg = await dev.send({ content: `# <:UtilityApplicationPending:1211399149594087444> Nuevo reporte de Bug o abuso de comando\nSe ha generado un nuevo reporte de bug o abuso de comando. Por favor de leer detalladamente.\n\n**Comando**: ${command}\n**Información**: ${about}`, components: [button] });
        const collector = msg.createMessageComponentCollector();
        collector.on('collect', async i => {
          if (i.customId == 'accept') {
            const message = await channel.send({ content: `# <:UtilityApplication:1211399006606069760> Nuevo reporte de Bug o abuso de comando\nSe ha detectado un nuevo reporte de bug o abuso de comando.\n¿Has tenido el mismo problema?, Si es así, cuéntanos.\n\n**Comando**: ${command}\n**Información**: ${about}` });

            await message.startThread({ name: `Error del comando ${command}` });

            const answer = await i.update({ content: `<:UtilityVerifiedIcon:1200993235267489843> Se ha aceptado y enviado el reporte al servidor de soporte.`, components: [] });

            setTimeout(() => {
              answer.delete();
            }, 3000)

            user.send({ content: `<:UtilityVerifiedIcon:1200993235267489843> El reporte se ha aceptado y enviado al servidor de soporte.` })
          }

          if (i.customId == 'deny') {
            i.update({ content: `<:UtilityApplicationRefused:1211420962722152499> El reporte ha sido denegado.`, components: [] });

            setTimeout(() => {
              msg.delete();
            }, 3000)
          }
        })
    }
  },
};