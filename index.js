const { xinspect, forEach, validateObject } = require("./utils");
const {
  Logger,
  Message,
  addLogFunction,
  getLogger,
  getMessageObject,
  parseForLog,
  ArrayList,
} = require("./logger");

const axios = require("axios")

const logger = new Logger("(${date}) [EZTube]");

class APIKeyMissingException extends Error {
  #d = "";

  constructor() {
    super();
    this.#d = new Date().toUTCString();
    this.message = `(${new Date().toUTCString()})[EZ-Tube] No API-Key defined`;
  }
}

class APIError {
  #msg = "";
  #status = 200;
  #d = "";

  constructor(message, status) {
    this.#msg = message;
    this.#status = status;
    this.#d = new Date().toUTCString();
  }

  get message() {
    return `(${this.#d})[EZ-Tube] API Error: ${this.#msg} (Status ${this.#status.toString()})`;
  }
}

class client {

  #token = "";

  constructor(key = undefined) {
    this.#token = key;
  }

  getAPI(ENDPOINT) {
    logger.error("[${info(Client, Error)}] ", "API Key is not defined");
    throw new APIKeyMissingException();
  }

  getComment(ids, parentID = "") {}
}

const eztubeStatic = {
  utils: { xinspect, forEach, validateObject, ArrayList },
  client: (key = undefined) => new client(key),
};

logger.error(
  "${info(api, error)} ",
  "API Key is not defined"
);
throw new APIKeyMissingException();

module.exports = eztubeStatic;
