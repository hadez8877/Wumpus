const { Events } = require("discord.js");
const welcome = require("../../Schemas/welcomeSchema");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute (member) {

    const data = await welcome.findOne({ Guild: member.guild.id });
    
    if (!data) return;
    else {
      const channel = await member.guild.channels.fetch(data.Channel);

      if (Array.isArray(data.Message) && data.Message.length > 0) {
        const random = Math.floor(Math.random() * data.Message.length);
        const msg = data.Message[random];

        await channel.send({ content: `${msg.replace("{member}", `<@${member.user.id}>`)}` }).catch((err) => {});
      } else {
        return;
      }
    }
  },
};