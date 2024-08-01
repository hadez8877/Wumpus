import DiscordAPIError from "./utils/errors/DiscordAPIError";
import WumpusClient from "./lib/WumpusClient";

import "dotenv/config";

const client = new WumpusClient();

client.commandHandler.loadAll();
client.eventHandler.loadAll();

client.login(process.env.BOT_TOKEN).catch(err => {
    throw new DiscordAPIError(err.message, err.code, 0);
});