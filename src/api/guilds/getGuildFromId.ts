import { Client } from "discord.js";

async function getGuildFromId(client: Client, guildId: string) {
  return await client.guilds.fetch(guildId);
}

export default getGuildFromId;
