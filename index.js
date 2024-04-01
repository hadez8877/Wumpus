const { Client, GatewayIntentBits, Partials, Collection, Events } = require("discord.js");
const { loadEvents } = require("./Handlers/eventHandler");

  const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
  const { User, Message, GuildMember, ThreadMember } = Partials;
  
  const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
    partials: [User, Message, GuildMember, ThreadMember],
  });
  
  client.config = require("./config.json");
  client.events = new Collection();
  client.commands = new Collection();
  client.prefixs = new Collection();
  
  loadEvents(client);
  
  client.login(client.config.token);