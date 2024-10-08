import { ActivityType, Client, Events } from "discord.js";
import Event from "../../../lib/events/Event";
import kleur from "kleur";
import labelType from "../../../utils/labels";
import logger from "../../../logger";

class ReadyEvent extends Event {
  constructor() {
    super(Events.ClientReady, {
      once: true
    });
  }

  async run(client: Client) {
    client.user?.setPresence({
      activities: [
        {
          name: "I dont work! (really).",
          type: ActivityType.Custom
        }
      ]
    });

    logger.log(
      `\n\n${labelType.ONLINE} ${kleur.blue("Bot is ready!")}\n${kleur.gray("Press").padStart(labelType.ONLINE.length - 3)} ${kleur.white("s")} ${kleur.gray("to turn off the bot")}`
    );
  }
}

export default ReadyEvent;
