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

const ENDPOINTS = require("./ENDPOINTS");

const axios = require("axios").default;

const logger = new Logger("(${date}) [EZTube]");

const { inspect } = require("util");

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
    return `(${this.#d})[EZ-Tube] API Error: ${
      this.#msg
    } (Status ${this.#status.toString()})`;
  }
}

class client {
  #token = "";

  constructor(key = undefined) {
    this.#token = key;
  }

  async getAPI(ENDPOINT, headers = {}) {
    if (!this.#token) {
      logger.error("${info(api, error)} ", "API Key is not defined");
      throw new APIKeyMissingException();
    }
    let epl = new URL(ENDPOINT);
    epl.searchParams.set("key", this.key);
    let returnValue;
    await axios
      .get(epl.href, { headers: headers })
      .then(({ data }) => {
        returnValue = data;
      })
      .catch((e) => {
        if (e.response) {
          logger.error(
            "${info(api, error)} ",
            "An error occured in the request. ",
            { status: e.response.status, data: e.response.data }
          );
          throw new APIError(e.response.data, e.response.status);
        } else {
          logger.error(
            "${info(api, error)} ",
            "An error occured trying to request data",
            { error: e.message }
          );
          throw new Error(e.message);
        }
      });
    return returnValue;
  }

  get key() {
    return this.#token;
  }
  set key(value) {
    this.#token = value;
  }

  getToken() {
    return this.key;
  }
  setToken(value) {
    this.key = value;
    return this;
  }

  async getVideo(id) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("id", id);
    return await this.getAPI(url.href);
  }
}

const eztubeStatic = {
  utils: { xinspect, forEach, validateObject, ArrayList },
  client: (key = undefined) => new client(key),
};

(async function () {
  console.log(
    await new client()
      .setToken("AIzaSyBiOOBwM3Cv90DRN4VAqwxP91H65oe7PGw")
      .getVideo("PYW4AIMEvsU").items
  );
})();

module.exports = eztubeStatic;
