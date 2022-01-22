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

/**
 * The Error when you don't specify your api-key
 */
class APIKeyMissingException extends Error {
  #d = "";

  constructor() {
    super();
    this.#d = new Date().toUTCString();
    this.message = `(${new Date().toUTCString()})[EZ-Tube] No API-Key defined`;
  }
}

/**
 * Any Exception in calling the API will result in this Error
 */
class APIError {
  #msg = "";
  #status = 200;
  #d = "";

  /**
   *
   * @param {string} message
   * @param {number} status
   *
   * the message shall be the description for the error
   * the status is the response status, like 404 for Not Found
   */
  constructor(message, status) {
    this.#msg = message;
    this.#status = status;
    this.#d = new Date().toUTCString();
  }

  /**
   * @Returns {string}
   */
  get message() {
    return `(${this.#d})[EZ-Tube] API Error: ${
      this.#msg
    } (Status ${this.#status.toString()})`;
  }
}

/**
 * This is the class to call the api
 */
class client {
  #token = "";

  /**
   * @param {string|undefined} key
   *
   * You can insert here or later the key. It can always be changed. Trust me, we don't sell your data.
   */
  constructor(key = undefined) {
    this.#token = key;
  }

  /**
   *
   * @param {string|URL} ENDPOINT the enpoint url
   * @param {object} headers the headers
   * @returns {object} returns the response object
   */
  async getAPI(ENDPOINT, headers = {}) {
    if (!this.#token) {
      logger.error("${info(api, error)} ", "API Key is not defined");
      throw new APIKeyMissingException();
    }
    let epl = new URL(ENDPOINT);
    if (ENDPOINT instanceof URL) {
      let epl = ENDPOINT;
    }
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

  /**
   * @returns {string}
   *
   * get your current api-key
   */
  get key() {
    return this.#token;
  }

  /**
   * @param {string} value Your new API-Key
   *
   * set your api-key
   */
  set key(value) {
    this.#token = value;
  }
  /**
   * @returns {string}
   *
   * get your current api-key
   */
  getToken() {
    return this.key;
  }
  /**
   * @param {string} value Your new API-Key
   *
   * set your api-key
   */
  setToken(value) {
    this.key = value;
    return this;
  }

  /**
   *
   * @param {string} id the videoid
   * @param {number} maxResults the max results
   * @returns {Array<object>} the array of found videos
   */
  async getVideoInfos(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("id", id);
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url);
    return res.items;
  }
  /**
   *
   * @param {string} id the videoid
   * @param {number} maxResults the max results
   * @returns {Array<object>} the array of found videos
   */
  async getVideoStatus(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "status");
    url.searchParams.set("id", id);
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url);
    return res.items;
  }
  /**
   *
   * @param {string} id the videoid
   * @returns {Array<object>} the array of found videos
   */
  async getPlayerEmbed(id) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "player");
    url.searchParams.set("id", id);
    url.searchParams.set("maxResults", 1);
    let res = await this.getAPI(url);
    return res.items[0]?.player.embedHtml;
  }
  /**
   *
   * @param {string} id the channelid
   * @param {boolean} isChannelName Did you insert the channelname as id?
   * @param {number} maxResults the max results
   * @returns {Array<object>} the array of found channels
   */
  async getChannelDetails(id, isChannelName = false, maxResults = 1) {
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "snippet");
    if (isChannelName) {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   *
   * @param {string} id the channelid
   * @param {boolean} isChannelName Did you insert the channelname as id?
   * @param {number} maxResults the max results
   * @returns {Array<object>} the array of found channels
   */
  async getChannelStatus(id, isChannelName = false, maxResults = 1) {
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "status");
    if (isChannelName) {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   *
   * @param {string} id the channelid
   * @param {boolean} isChannelName Did you insert the channelname as id?
   * @param {number} maxResults the max results
   * @returns {Array<object>} the array of found channels
   */
  async getChannelLocalizations(id, isChannelName = false, maxResults = 1) {
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "localizations");
    if (isChannelName) {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   *
   * @param {string} id the channelid
   * @param {boolean} isChannelName Did you insert the channelname as id?
   * @param {number} maxResults the max results
   * @returns {Array<object>} the array of found channels
   */
  async getChannelStats(id, isChannelName = false, maxResults = 1) {
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "statistics");
    if (isChannelName) {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   *
   * @param {string} id the channelid
   * @param {boolean} isChannelName Did you insert the channelname as id?
   * @param {number} maxResults the max results
   * @returns {Array<object>} the array of found channels
   */
  async getChannelBranding(id, isChannelName = false, maxResults = 1) {
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "brandingSettings");
    if (isChannelName) {
      url.searchParams.set("forUsername", id);
    } else {
      url.searchParams.set("id", id);
    }
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * @param {string} id the Channel id of which you wanna get the channelpage
   * @param {string} csid the channelsection-id which you can get by retrieving the id from the item
   * @returns {object} the object used to describe the channelpage
   *
   * Please note: you don't need to give the channelid, when you give the csid. Set then as channelid just undefined or a blank string
   */
  async getChannelPage(id, csid = "") {
    let url = new URL(ENDPOINTS.Channel_homepage);
    url.searchParams.set("part", "snippet");
    if (!csid) {
      url.searchParams.set("channelId", id);
    } else {
      url.searchParams.set("id", csid);
    }
    let res = await this.getAPI(url);
    return res.items;
  }
  /**
   * @param {string} id the Channel id of which you wanna get the channelpage
   * @param {string} csid the channelsection-id which you can get by retrieving the id from the item
   * @returns {object} the object used to describe the content of the channelpage
   *
   * Please note: you don't need to give the channelid, when you give the csid. Set then as channelid just undefined or a blank string
   */
  async getChannelPageContent(id, csid = "") {
    let url = new URL(ENDPOINTS.Channel_homepage);
    url.searchParams.set("part", "contentDetails");
    if (!csid) {
      url.searchParams.set("channelId", id);
    } else {
      url.searchParams.set("id", csid);
    }
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * @param {string} videoID the video id of which you wanna get the infos of captions
   * @return {object} an object that describes the caption
   */
  async getCaptionInfos(videoID) {
    let url = new URL(ENDPOINTS.Caption_infos);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("videoId", videoID);
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   *
   * @param {string} query the search query
   * @param {import("./types").searchType} type the type of searchresults (video, channel, playlist or undefined)
   * @param {Number} maxResults the number of results
   * @returns the searchresults
   */
  async search(query, type = undefined, maxResults = 1) {
    let url = new URL(ENDPOINTS.Search);
    url.searchParams.set("q", query);
    if (type) url.searchParams.set("type", type);
    url.searchParams.set("maxResults", maxResults);
    let res = await this.getAPI(url);
    return res.items;
  }

  
}

/**
 *
 * @param {string} key the API-Key
 * @returns {client} a new API-Client
 */
function fc(key = undefined) {
  return new client(key);
}

const eztubeStatic = {
  utils: { xinspect, forEach, validateObject, ArrayList },
  client: fc,
  APIError,
  APIKeyMissingException,
};

module.exports = eztubeStatic;
