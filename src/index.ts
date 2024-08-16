import { Message, ChannelType, PermissionsBitField } from "discord.js";
import checkPermissions from "@/plugins/checkPermissions";
import ClientError from "@errors/ClientError";
import CommandError from "@errors/CommandError";
import db from "db/config";
import getGuildPrefix from "@/api/guilds/getGuildPrefix";
import WumpusClient from "@/lib/WumpusClient";

import "dotenv/config";

import approvedGuild from "@models/approvedGuildSchema";

const client = new WumpusClient();

db.connect();

client.commandHandler.loadAll();
client.eventHandler.loadAll();

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (!message.inGuild()) return;

  const approvedGuildData = await approvedGuild.findOne({ guildId: message.guildId }).lean().exec();

  if (!approvedGuildData) return;

  const prefix = process.env.BOT_PREFIX ?? getGuildPrefix(client, message.guildId);

  if (message.channel.type === ChannelType.GuildText) {
    if (client.user && !message.channel.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages))
      return;
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);

  const commandName = args.shift()?.toLowerCase();
  const command = client.commandHandler.modules.find((m: { aliases: string | string[] }) =>
    m.aliases.includes(`${commandName}`)
  );

  if (!command) return;

  const { permissions } = command;

  if (permissions && message.member) {
    const { hasPermissions, missingPermissions } = checkPermissions(message.member, permissions);

    if (!hasPermissions) {
      const missingPermissionsList = missingPermissions.map((permission) => `\`${permission}\``).join(", ");

      return await message.reply({
        content: `<:WumpusCry:1234249327241592873> Te faltan permisos para ejecutar el comando.\nPermisos faltantes: ${missingPermissionsList}`,
        allowedMentions: { repliedUser: false }
      });
    }
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
