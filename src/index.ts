import { Message, ChannelType, PermissionsBitField, GuildMember } from "discord.js";
import ClientError from "@/utils/errors/ClientError";
import WumpusClient from "@/lib/WumpusClient";

import "dotenv/config";

import whitelist from "db/whitelistSchema";
import CommandError from "./utils/errors/CommandError";
import checkPermissions from "./lib/checkPermissions";

const client = new WumpusClient();

client.commandHandler.loadAll();
client.eventHandler.loadAll();

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

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

  const { permissions } = command;

  const { hasPermissions, missingPermissions } = checkPermissions(message.member as GuildMember, permissions);

  if (!hasPermissions) {
    const missingPermissionsList = missingPermissions.map((permission) => `\`${permission}\``).join(", ");

    return await message.reply({
      content: `<:WumpusCry:1234249327241592873> Te faltan permisos para ejecutar el comando.\nPermisos faltantes: ${missingPermissionsList}`,
      allowedMentions: { repliedUser: false },
    });
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
