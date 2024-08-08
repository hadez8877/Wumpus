import { Message, ChannelType, PermissionsBitField } from "discord.js";
import ClientError from "@/utils/errors/ClientError";
import WumpusClient from "@/lib/WumpusClient";

import "dotenv/config";

import whitelist from "db/whitelistSchema";
import CommandError from "./utils/errors/CommandError";

const client = new WumpusClient();

client.commandHandler.loadAll();
client.eventHandler.loadAll();

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  // eslint-disable-next-line no-var
  var whitelistData = await whitelist.findOne({ Guild: message.guild?.id });
  if (!whitelistData) return;

  const prefix = process.env.BOT_PREFIX ?? "!";

  if (message.channel.type === ChannelType.GuildText) {
    if (client.user && !message.channel.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages))
      return;
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);

  const commandName = args.shift()?.toLowerCase();
  const command = client.commandHandler.modules.find((m: { aliases: string | string[] }) =>
    m.aliases.includes(`${commandName}`),
  );

  if (!command) return;

  const { permissionType } = command;

  switch (permissionType) {
    case "developer":
      const developers: string[] = ["1173072980000112671"];

      if (!developers.includes(message.author.id))
        return await message.reply({
          content:
            "<:BadgeSlashCommands:1234642175116054608> Este comando solo puede ser utilizado por el creador de Wumpus.",
          allowedMentions: { repliedUser: false },
        });
      break;

    case "owner":
      if (message.guild && message.guild?.ownerId !== message.author.id) return;
      break;

    case "admin":
      if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator))
        return await message.reply({
          content:
            "<:UtilityMessageInteractionWarn:1234642336580108298> No tienes los permisos suficientes para usar este comando.",
          allowedMentions: { repliedUser: false },
        });
      break;

    case "mod":
      // Coming soon!
      break;
  }

  try {
    command.run(message, args, client);
  } catch (err) {
    if (err instanceof Error) throw new CommandError(2002, command.id, err);
    else {
      throw new CommandError(2002, command.id, "Unknown error occurred");
    }
  }

});

client.login(process.env.BOT_TOKEN).catch((err) => {
  if (err instanceof Error) throw new ClientError(1001, err);
  else {
    throw new ClientError(1001, "Unknown error occurred");
  }
});
