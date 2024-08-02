import util from "util";
import labelType from "../labels";
import kleur from "kleur";

type ErrorCodes = 1001 | 1002 | 1003 | 1004 | 1005 | 1006;

class ClientError extends Error {
    code: ErrorCodes;

    constructor(code: ErrorCodes) {
        // eslint-disable-next-line no-var
        var message: string;

        switch (code) {
            case 1001:
                message = `${kleur.yellow("[1001]")} Invalid bot token. The provided token is not valid.`;
            break;
            case 1002:
                message = `${kleur.yellow("[1002]")} Rate limit exceeded. Too many requests in a given time.`;
            break;
            case 1003:
                message = `${kleur.yellow("[1003]")} Permission denied. You do not have permission to perform this action.`;
            break;
            case 1004:
                message = `${kleur.yellow("[1004]")} Resource not found. The requested resource does not exist.`;
            break;
            case 1005:
                message = `${kleur.yellow("[1005]")} Server error. An unexpected error occurred on the server.`;
            break;
            case 1006:
                message = `${kleur.yellow("[1006]")} Unknown error occurred.`;
            break;
            default: {
                message = `${labelType.ERROR} An unknown error occurred with code ${code}.`;
            }
        }

        super(message);
        this.code = code;
        this.name = "ClientError";

        Error.captureStackTrace(this, this.constructor);
    }

    [util.inspect.custom]() {
        return `${labelType.ERROR} Client encountered an issue. ${this.code ? `Error Code: ${kleur.bold().yellow(`${this.code}`)}` : "No Error Code"}. Error Message: ${this.message}`;
    }
}

export default ClientError;