import util from "util";
import labelType from "@/utils/labels";
import kleur from "kleur";

type ErrorCodes = 2001 | 2002 | 2003 | 2004 | 2005;

class CommandError extends Error {
  code: ErrorCodes;
  command: string;
  error: NodeJS.ErrnoException | string | null;

  constructor(code: ErrorCodes, command: string, error: NodeJS.ErrnoException | string | null) {
    let message: string;

    switch (code) {
      case 2001:
        message =
          `${kleur.yellow("[2001]")} Invalid command. The command ${command} is not recognized:\n` + error ??
          "Undefined error";
        break;
      case 2002:
        message =
          `${kleur.yellow("[2002]")} Command execution error. There was an issue executing the command ${command}:\n` +
            error ?? "Undefined error";
        error;
        break;
      case 2003:
        message =
          `${kleur.yellow("[2003]")} Invalid arguments. The arguments provided for command ${command} are incorrect:\n` +
            error ?? "Undefined error";
        error;
        break;
      case 2004:
        message =
          `${kleur.yellow("[2004]")} Missing permissions. You do not have permission to use the command ${command}:\n` +
            error ?? "Undefined error";
        error;
        break;
      case 2005:
        message =
          `${kleur.yellow("[2005]")} Command failed. The command ${command} failed due to an unexpected error:\n` +
            error ?? "Undefined error";
        error;
        break;
      default: {
        message = `${labelType.ERROR} An unknown error occurred with command ${command}. Error Code: ${code}.`;
      }
    }

    super(message);
    this.code = code;
    this.command = command;
    this.error = error;

    this.name = "CommandError";

    Error.captureStackTrace(this, this.constructor);
  }

  [util.inspect.custom]() {
    return `${labelType.ERROR} ${this.command ? `Command: ${kleur.bold().red(this.command)}` : "No Command"}. ${this.code ? `Error Code: ${kleur.bold().red(`${this.code}`)}` : "No Error Code"}. Error Message: ${this.message}`;
  }
}

export default CommandError;
