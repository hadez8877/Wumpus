import { Client } from "discord.js";

async function getGuild(client: Client, guildId: string) {
  return await client.guilds.fetch(guildId);
}

export default getGuild;
