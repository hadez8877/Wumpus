const { Message, Client } = require("discord.js");
const { sendTranslated } = require("../../functions/translate");
const whitelist = require("../../modals/whitelistSchema");

module.exports = {
    name: "whitelist",
    aliases: ["wl"],
    description: "Agrega un servidor a la lista blanca",
    options: "<sub> [guildId]",
    developer: true,


    /**
     *
     * @param {Message} message
     * @param {Client} client 
     */
    async execute(message, args, client) {
        const m = await message.reply({ content: `<a:AnimatedLoaded:1257177494310752266> ${await sendTranslated("Espere un momento...", message.guild.id)}`, allowedMentions: { repliedUser: false } });

        const sub = args[0];
        const guild = await client.guilds.fetch(args[1]).catch(async () => {
            return await m.edit({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("El ID del servidor no existe, es incorrecta o no estoy ahí.", message.guild.id)}`, allowedMentions: { repliedUser: false } });
        });

        var data = await whitelist.findOne({ Guild: guild.id });

        switch (sub) {
            case 'add':
                if (data) return await m.edit({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("El servidor ya ha sido ingresado.", message.guild.id)}`, allowedMentions: { repliedUser: false } });
                else {
                    await whitelist.create({
                        Guild: guild.id
                    });

                    return await m.edit({ content: `<:UtilityApplication:1234642323732697099> ${await sendTranslated("El servidor se ha agregado exitosamente.", message.guild.id)}`, allowedMentions: { repliedUser: false } });
                }
                break;

            case 'remove':
                if (!data) return await m.edit({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("El servidor que ha ingresado no está en la lista blanca.")}`, allowedMentions: { repliedUser: false } });
                else {
                    await whitelist.findOneAndDelete({
                        Guild: guild.id
                    });

                    return await m.edit({ content: `<:UtilityDeleteMessage:1234642331420983326> ${await sendTranslated("El servidor ha sido removido exitosamente.", message.guild.id)}`, allowedMentions: { repliedUser: false } });
                }
                break;

            case 'check':
                const dataAll = await whitelist.find();
                var values = [];

                for (const value of dataAll) {
                    if (!value.Guild) return;
                    else {
                        var g = await client.guilds.fetch(value.Guild);

                        values.push(`${await sendTranslated("**Nombre del Servidor**:", message.guild.id)} ${g.name}\n${await sendTranslated("**Servidor ID**:", message.guild.id)} \`\`${g.id}\`\``);
                    }
                }

                if (values.length > 0) {
                    return await m.edit({ content: `<:UtilityApplication:1234642323732697099> ${await sendTranslated("**Servidores Permitidos**:", message.guild.id)}\n\n${values.join('\n\n')}`, allowedMentions: { repliedUser: false } });
                } else {
                    return await m.edit({ content: `<:UtilityMessageInteractionWarn:1234642336580108298> ${await sendTranslated("No hay servidores en la lista blanca.", message.guild.id)}`, allowedMentions: { repliedUser: false } });
                }
            break;
        }
    },
};