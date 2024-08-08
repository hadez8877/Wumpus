import util from "util";
import labelType from "@/utils/labels";
import kleur from "kleur";

type ErrorCodes = 3001 | 3002 | 3003 | 3004 | 3005;

class EventError extends Error {
  code: ErrorCodes;
  event: string;
  error: NodeJS.ErrnoException | string | null

  constructor(code: ErrorCodes, event: string, error: NodeJS.ErrnoException | string | null) {
    let message: string;

    switch (code) {
      case 3001:
        message = `${kleur.yellow("[3001]")} Invalid event. The event ${event} is not recognized:\n` + error ?? "Undefined error";
        break;
      case 3002:
        message = `${kleur.yellow("[3002]")} Event execution error. There was an issue executing the event ${event}:\n` + error ?? "Undefined error"
        break;
      case 3003:
        message = `${kleur.yellow("[3003]")} Invalid arguments. The arguments provided for event ${event} are incorrect:\n` + error ?? "Undefined error";
        break;
      case 3004:
        message = `${kleur.yellow("[3004]")} Missing permissions. You do not have permission to execute the event ${event}:\n` + error ?? "Undefined error"
        break;
      case 3005:
        message = `${kleur.yellow("[3005]")} Event failed. The event ${event} failed due to an unexpected error:\n` + error ?? "Undefined error"
        break;
      default:
        message = `${labelType.ERROR} An unknown error occurred with event ${event}. Error Code: ${code}.`;
    }

    super(message);
    this.code = code;
    this.event = event;
    this.error = error;

    this.name = "EventError";

    Error.captureStackTrace(this, this.constructor);
  }

  [util.inspect.custom]() {
    return `${labelType.ERROR} ${this.event ? `Event: ${kleur.bold().red(this.event)}` : "No Event"}. ${this.code ? `Error Code: ${kleur.bold().red(`${this.code}`)}` : "No Error Code"}. Error Message: ${this.message}`;
  }
}

export default EventError;
