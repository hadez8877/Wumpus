import { Client, Message } from "discord.js";
import Command from "@/lib/commands/Command";
import whitelist from "@models/whitelistSchema";

class WhitelistCommand extends Command {
  constructor() {
    super("whitelist", {
      aliases: ["wl"],
      description: "Agrega un servidor a la lista blanca.",
      usage: "<sub> [guildId]",
      permissions: ["manageAccess"],
    });
  }

  async run(message: Message, args: string[], client: Client) {
    const sub = args[0];
    const guild = await client.guilds.fetch(args[1]).catch(async () => {
      return await message.reply({
        content:
          "<:UtilityMessageInteractionWarn:1234642336580108298> El ID del servidor no existe, es incorrecta o no estoy ahí.",
        allowedMentions: { repliedUser: false },
      });
    });

    // eslint-disable-next-line no-var
    var data = await whitelist.findOne({ Guild: guild.id });

    switch (sub) {
      case "add":
        if (data)
          return await message.reply({
            content: "<:UtilityMessageInteractionWarn:1234642336580108298> El servidor ya ha sido ingresado.",
            allowedMentions: { repliedUser: false },
          });
        else {
          await whitelist.create({
            Guild: guild.id,
          });

          return await message.reply({
            content: "<:UtilityApplication:1234642323732697099> El servidor se ha agregado exitosamente.",
            allowedMentions: { repliedUser: false },
          });
        }
        break;

      case "remove":
        if (!data)
          return await message.reply({
            content:
              "<:UtilityMessageInteractionWarn:1234642336580108298> El servidor que ha ingresado no está en la lista blanca.",
            allowedMentions: { repliedUser: false },
          });
        else {
          await whitelist.findOneAndDelete({
            Guild: guild.id,
          });

          return await message.reply({
            content: "<:UtilityDeleteMessage:1234642331420983326> El servidor ha sido removido exitosamente.",
            allowedMentions: { repliedUser: false },
          });
        }
        break;

      case "check":
        const dataAll = await whitelist.find();
        // eslint-disable-next-line no-var
        var values = [];

        for (const value of dataAll) {
          if (!value.Guild) return;
          else {
            // eslint-disable-next-line no-var
            var g = await client.guilds.fetch(value.Guild);

            values.push(`**Nombre del Servidor**: ${g.name}\n**Servidor ID**: \`\`${g.id}\`\``);
          }
        }

        if (values.length > 0) {
          return await message.reply({
            content: `<:UtilityApplication:1234642323732697099> **Servidores Permitidos**:\n\n${values.join("\n\n")}`,
            allowedMentions: { repliedUser: false },
          });
        } else {
          return await message.reply({
            content: "<:UtilityMessageInteractionWarn:1234642336580108298> No hay servidores en la lista blanca.",
            allowedMentions: { repliedUser: false },
          });
        }
        break;

      default: {
        return await message.reply({
          content: "<:UtilityMessageInteractionWarn:1234642336580108298> El subcomando ejecutado no existe.",
          allowedMentions: { repliedUser: false },
        });
      }
    }
  }
}

export default WhitelistCommand;
