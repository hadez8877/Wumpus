import test from "ava";
import WumpusClient from "@/lib/WumpusClient";

const client = new WumpusClient();

test.before(async (t) => {
  await client.eventHandler.loadAll();
  t.pass();
});

test("should load all events without errors", (t) => {
  const events = client.eventHandler.modules;

  t.is(events.size, client.eventHandler.eventsLoaded);
  t.is(client.eventHandler.errorsFound, 0);
});

test("should verify event properties", (t) => {
  const events = client.eventHandler.modules;

  events.forEach((event) => {
    t.truthy(event.id);
    t.truthy(event.once);
  });
});

/* Hi :D */
