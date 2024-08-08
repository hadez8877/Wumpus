import util from "util";
import labelType from "@/utils/labels";
import kleur from "kleur";

type ErrorCodes = 12002 | 11000 | 121 | 50 | 6 | 89 | 94;

class DBError extends Error {
  code: ErrorCodes;
  error: NodeJS.ErrnoException | string | null;

  constructor(code: ErrorCodes, error: NodeJS.ErrnoException | string | null) {
    // eslint-disable-next-line no-var
    var message: string;

    switch (code) {
      case 12002:
        message = `${kleur.yellow("[12002]")} Connection failed. Unable to connect to MongoDB:\n` + error ?? "Undefined error";
        break;
      case 11000:
        message = `${kleur.yellow("[11000]")} Duplicate key error. The document you are trying to insert already exists:\n` + error ?? "Undefined error";
        break;
      case 121:
        message = `${kleur.yellow("[121]")} Document validation failure. The document does not meet validation criteria:\n` + error ?? "Undefined error";
        break;
      case 50:
        message = `${kleur.yellow("[50]")} Server selection timeout. The client could not find a suitable server:\n` + error ?? "Undefined error";
        break;
      case 6:
        message = `${kleur.yellow("[6]")} Not master error. The operation is not allowed on this node:\n` + error ?? "Undefined error";
        break;
      case 89:
        message = `${kleur.yellow("[89]")} Write concern error. The write concern could not be fulfilled\n` + error;
        break;
      case 94:
        message = `${kleur.yellow("[94]")} Network error. There was a network error during the operation:\n` + error ?? "Undefined error";
        break;
      default: {
        message = `${labelType.ERROR} An unknown error occurred with code ${code}.`;
      }
    }

    super(message);
    this.code = code;
    this.error = error

    this.name = "DBError";

    Error.captureStackTrace(this, this.constructor);
  }

  [util.inspect.custom]() {
    return `${labelType.ERROR} Database encountered an issue. ${this.code ? `Error Code: ${kleur.bold().yellow(`${this.code}`)}` : "No Error Code"}. Error Message: ${this.message}`;
  }
}

export default DBError;
