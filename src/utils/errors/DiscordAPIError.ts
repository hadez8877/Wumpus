import util from "util";
import labelType from "../labels";
import kleur from "kleur";

class DiscordAPIError extends Error {
  code: number | string | undefined;
  shardId: number;

  constructor(message: string, code: number | string | undefined, shardId: number) {
    super(message);
    this.code = code;
    this.shardId = shardId;

    this.name = "DiscordAPIError";

    Error.captureStackTrace(this, this.constructor);
  }

  [util.inspect.custom]() {
    return `${labelType.ERROR} Discord API encountered an issue. ${this.code ? `Error Code: ${kleur.bold().yellow(`${this.code}`)}` : "No Error Code"}. Shard ID: ${kleur.bold().blue(`${this.shardId}`)}. Error Message: ${kleur.red(this.message)}`;
  }
}

export default DiscordAPIError;
