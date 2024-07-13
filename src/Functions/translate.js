const translate = require("translate-google");
const subscribe = require("../Schemas/subscribeSchema");

async function sendTranslated(text, guildId) {
  if (!guildId) throw new Error("Gulid ID required!");

  const data = await subscribe.findOne({ Guild: guildId });
  const language = data?.Language || "es";

  const result = await translate(text, { to: language });

  return result;
}

module.exports = { sendTranslated };
