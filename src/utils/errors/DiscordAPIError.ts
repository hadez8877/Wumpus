import util from "util";
import labelType from "@/utils/labels";
import kleur from "kleur";

type ErrorCodes = 400 | 401 | 403 | 404 | 405 | 429 | 500 | 502 | 503 | 504;

class DiscordAPIError extends Error {
  code: ErrorCodes;

  constructor(code: ErrorCodes) {
    // eslint-disable-next-line no-var
    var message: string;

    switch (code) {
      case 400:
        message = `${kleur.yellow("[400]")} Bad Request. The request was invalid or cannot be otherwise served.`;
      break;
      case 401:
        message = `${kleur.yellow("[401]")} Unauthorized. Invalid or missing authentication token.`;
      break;
      case 403:
        message = `${kleur.yellow("[403]")} Forbidden. You do not have permission to perform this action.`;
      break;
      case 404:
        message = `${kleur.yellow("[404]")} Not Found. The requested resource was not found.`;
      break;
      case 405:
        message = `${kleur.yellow("[405]")} Method Not Allowed. The method specified in the request is not allowed.`;
      break;
      case 429:
        message = `${kleur.yellow("[429]")} Too Many Requests. You have sent too many requests in a given amount of time.`;
      break;
      case 500:
        message = `${kleur.yellow("[500]")} Internal Server Error. An unexpected error occurred on the server.`;
      break;
      case 502:
        message = `${kleur.yellow("[502]")} Bad Gateway. The server received an invalid response from the upstream server.`;
      break;
      case 503:
        message = `${kleur.yellow("[503]")} Service Unavailable. The server is currently unable to handle the request.`;
      break;
      case 504:
        message = `${kleur.yellow("[504]")} Gateway Timeout. The server did not receive a timely response from the upstream server.`;
      break;

      default: {
        message = `${labelType.ERROR} Unknown error with code ${kleur.yellow(`${code}`)}.`;
      }
    }

    super(message);
    this.code = code;

    this.name = "DiscordAPIError";

    Error.captureStackTrace(this, this.constructor);
  }

  [util.inspect.custom]() {
    return `${labelType.ERROR} Discord API encountered an issue. ${this.code ? `Error Code: ${kleur.bold().yellow(`${this.code}`)}` : "No Error Code"}. Error Message: ${this.message}`;
  }
}

export default DiscordAPIError;
