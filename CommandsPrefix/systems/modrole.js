const { Message, PermissionsBitField } = require("discord.js");
const modrole = require("../../Schemas/modroleSchema");

module.exports = {
    mod: true,
    name: "modrole",
    description: "modrole system",
    options: "<sub> [role]",
    
    /**
     * 
     * @param {Message} message 
     */
    async execute (message, args) {

        const sub = args[0];
        const regex = /<@&(\d+)>/;
        var data = await modrole.find({Guild: message.guild.id});

        async function checkData (add) {
            var check;
            var role = message.mentions.roles.first();

            await data.forEach(async value => {
                if (value.Role == role.id) return check = true;
            });

            return check;
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> No tienes los permisos para usar este comando.`, allowedMentions: { RepliedUser: false }, });

        switch (sub) {
            case 'add':
                var check = await checkData(true);
                var role = message.mentions.roles.first();

                if (!regex.test(role)) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, menciona un rol valido.`, allowedMentions: ({ repliedUser: false }), });

                if (check) {
                    return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> ¡Ups! Parece que ese rol ya ha sido seleccionado.`, allowedMentions: ({ repliedUser: false }), });
                } else {
                    await modrole.create({
                        Guild: message.guild.id,
                        Role: role.id
                    });
    
                    return message.reply({ content: `<:UtilityVerifiedIcon:1200993235267489843> Se agregó <@&${role.id}> como rol de moderacíon.`, allowedMentions: ({ repliedUser: false }), });
                }
            break;
            case 'remove':
                var check = await checkData();
                var role = message.mentions.roles.first();
    
                if (!regex.test(role)) return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Por favor, menciona un rol valido.`, allowedMentions: ({ repliedUser: false }), });
    
                if (!check) {
                    return message.reply({ content: `<:UtilityMessageWarn:1200992221550358568> Parece que ese rol no es de moderacíon, así que no puedo eliminarlo.`, allowedMentions: ({ repliedUser: false }), });
                } else {
                    await modrole.deleteOne({
                        Guild: message.guild.id,
                        Role: role.id
                    });
    
                    return message.reply({ content: `<:UtilityVerifiedIcon:1200993235267489843> <@&${role.id}> Se ha eliminado correctamente.`, allowedMentions: ({ repliedUser: false }), });
                }
            break;
            case 'check':
                var values = [];
                await data.forEach(async value => {
                    if (!value.Role) return;
                    else {
                        var r = await message.guild.roles.fetch(value.Role);

                        values.push(`**Nombre de rol:** <@&${r.id}>\n**Rol ID:** \`${r.id}\``);
                    }
                });

                if (values.length > 0) {
                    await message.reply({ content: `<:BadgeCertifiedMod:1200989308543311932> **Roles de moderador**\n\n${values.join('\n\n')}`, allowedMentions: ({ repliedUser: false }), });
                } else {
                    await message.reply({ content: "<:UtilityMessageWarn:1200992221550358568> Parece que no hay ningún rol de moderación.", allowedMentions: ({ repliedUser: false }), });
                }
        }
    },
};