import DiscordAPIError from "../../plugins/errors/DiscordAPIError";
import { Client, Guild } from "discord.js";

async function getGuildFromId(client: Client, guildId: string): Promise<Guild> {
  const guild = await client.guilds.fetch(guildId).catch((err) => {
    if (err instanceof Error) throw new DiscordAPIError(404, err);
    else {
      throw new DiscordAPIError(404, "Unknown error occurred");
    }
  });

  return guild;
}

export default getGuildFromId;
