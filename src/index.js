const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { loadEvents } = require("./handlers/eventHandler");

require("dotenv").config();

const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember]
});

client.events = new Collection();
client.prefixs = new Collection();

loadEvents(client);

client.login(process.env.TOKEN);
