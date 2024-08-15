import test from "ava";
import WumpusClient from "@/lib/WumpusClient";

const client = new WumpusClient();

test.before(async (t) => {
  await client.commandHandler.loadAll();
  t.pass();
});

test("should load all commands without errors", (t) => {
  const commands = client.commandHandler.modules;

  t.is(commands.size, client.commandHandler.commandsLoaded);
  t.is(client.commandHandler.errorsFound, 0);
});

test("should verify command properties", (t) => {
  const commands = client.commandHandler.modules;

  commands.forEach((command) => {
    t.truthy(command.id);
    t.true(Array.isArray(command.aliases));
    t.truthy(command.description);
    t.truthy(command.usage);
    t.true(Array.isArray(command.permissions));
    t.truthy(command.category);
  });
});
