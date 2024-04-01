const { Message } = require("discord.js");
const { execute } = require("./ready");
const changePrefix = require("../../Schemas/prefixSchema");
const modrole = require("../../Schemas/modroleSchema");

module.exports = {
  name: "messageCreate",
  once: false,
  /**
   *
   * @param {Message} message
   */
  async execute(message, client) {

    changePrefix.findOne({ Guild: message.guild.id}).then(async data => {
      
      const prefix = data ? data.Prefix : 's!';
  
      if (!message.content.startsWith(prefix) || message.author.bot) return;
  
      const args = message.content.slice(prefix.length).split(/ +/g);
      const command = args.shift().toLowerCase();
      const cmd =
        client.prefixs.get(command) ||
        client.prefixs.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(command)
        );

        //mod role
        if (cmd.mod) {
          var modRoleData = await modrole.find({ Guild: message.guild.id });
  
          if (modRoleData.length > 0) {
            const mRoles = message.member.roles.cache.map((role) => role.id);
            var check = modRoleData.some((value) => mRoles.includes(value.Role));
  
            if (!check) {
              return message.reply({ content: "<:BadgeStaff:1200985816101556274> No tienes los permisos de moderación para ejecutar el comando.", allowedMentions: { repliedUser: false } });
            }
          }
        }
  
      if (!cmd) {
        message.reply({content: `¡Ups! El comando que has ejecutado no existe. <:WumpusCleaning:1200982093132480642>`, allowedMentions: { repliedUser: false }} );
        return;
      }
  
      cmd.execute(message, args);
      
      
     });
  },
};
