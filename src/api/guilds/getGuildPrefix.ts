import { Client } from "discord.js";
import configureGuild from "../../../db/models/configureGuildSchema";
import DiscordAPIError from "../../plugins/errors/DiscordAPIError";

async function getGuildPrefix(client: Client, guildId: string): Promise<string> {
  const guild = await client.guilds.fetch(guildId).catch((err) => {
    if (err instanceof Error) throw new DiscordAPIError(404, err);
    else {
      throw new DiscordAPIError(404, "Unknown error occurred");
    }
  });

  const data = await configureGuild.findOne({ guildId: guild.id }).lean().exec();

  return data?.prefix ?? process.env.BOT_PREFIX ?? "!";
}

export default getGuildPrefix;
