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
    console.log(epl.href);
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

  async getVideoInfos(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("id", id);
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url.href);
    return res.items;
  }

  async getVideoStatus(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "status");
    url.searchParams.set("id", id);
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url.href);
    return res.items;
  }

  async getPlayerEmbed(id) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "player");
    url.searchParams.set("id", id);
    url.searchParams.set("maxResults", 1);
    let res = await this.getAPI(url.href);
    return res.items[0]?.player.embedHtml;
  }

  async getChannelDetails(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "snippet");
    if (typeof id == typeof "") {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url.href);
    return res.items;
  }
  async getChannelStatus(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "status");
    if (typeof id == typeof "") {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url.href);
    return res.items;
  }

  async getChannelLocalizations(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "localizations");
    if (typeof id == typeof "") {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url.href);
    return res.items;
  }

  async getChannelStats(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "statistics");
    if (typeof id == typeof "") {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url.href);
    return res.items;
  }

  async getChannelBranding(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "brandingSettings");
    if (typeof id == typeof "") {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url.href);
    return res.items;
  }
}



const eztubeStatic = {
  utils: { xinspect, forEach, validateObject, ArrayList },
  client: (key = undefined) => new client(key),
};

module.exports = eztubeStatic;
