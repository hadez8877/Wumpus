const { ChatInputCommandInteraction } = require("discord.js");
const modrole = require("../../Schemas/modroleSchema");

var timeout = new Set();

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute: async (interaction, client) => {

    if (!interaction.isChatInputCommand()) return;

      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply({
          content: "Este comando está desactualizado.",
          ephemeral: true,
        });

      if (command.developer && interaction.user.id !== "837110416416702494")
        return interaction.reply({
          content:
            "Este comando solo puede ser utilizado por el creador de Wumpus.",
          ephemeral: true,
        });

      //modrole
      if (command.mod) {
        var modroleData = await modrole.find({ Guild: interaction.guild.id });

        if (modroleData.length > 0) {
          const mRoles = interaction.member.roles.cache.map((role) => role.id);
          var check = modroleData.some((value) => mRoles.includes(value.Role));

          if (!check) {
            return interaction.reply({ content: "<:BadgeStaff:1200985816101556274> No tienes los permisos de moderación para ejecutar el comando.", ephemeral: true });
          }
        }
      }

      //cooldown
      if (command.cooldown) {
        const cooldown = command.cooldown * 1000;
  
        if (timeout.has(interaction.user.id)) return interaction.reply({ content: `<a:AnimatedLoaded:1221639080295534643> Por favor, espera <t:${Math.floor(Date.now() / 1000 + cooldown / 1000)}:R> para volver a usar este comando.`, ephemeral: true });
  
        timeout.add(interaction.user.id);
  
        setTimeout(() => {
          timeout.delete(interaction.user.id);
        }, cooldown);
      }

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
  },
};
