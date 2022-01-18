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

import axios from "axios";

const logger = new Logger("(${date})[EZ-Tube]");

class APIKeyMissingException {
  constructor() {
    this.#d = new Date().toUTCString();
  }
  get message() {
    return `(${this.#d})[EZ-Tube] No API-Key defined`;
  }
}

class APIError {
  constructor(message, status) {
    this.#msg = message;
    this.#status = status;
    this.#d = new Date().toUTCString();
  }

  get message() {
    return `(${this.#d})[EZ-Tube] API Error: ${this.#msg} (Status ${
      this.#status
    })`;
  }
}

class client {
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

logger.error("[${info(Client, Error)}] ", "API Key is not defined");
throw new APIKeyMissingException();

module.exports = eztubeStatic;
