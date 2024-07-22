import WumpusClient from "./lib/WumpusClient";

const client = new WumpusClient();

client.commandHandler.loadAll();
client.eventHandler.loadAll();

client.login(process.env.TOKEN);