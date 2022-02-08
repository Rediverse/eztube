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
    // console.log(epl.href);
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
    // return {}
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
   * @returns {import("./types").getVideoInfosResponse} the array of found videos
   */
  async getVideoInfos(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("id", id);
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }
  /**
   *
   * @param {string} id the videoid
   * @param {number} maxResults the max results
   * @returns {import("./types").getVideoStatusResponse} the array of found videos
   */
  async getVideoStatus(id, maxResults = 1) {
    let url = new URL(ENDPOINTS.Video_info);
    url.searchParams.set("part", "status");
    url.searchParams.set("id", id);
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }
  /**
   *
   * @param {string} id the videoid
   * @returns {string} the array of found videos
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
   * @param {import("./types").channelFilter} channelFilter the channelfilter
   * @param {number} maxResults the max results
   * @returns {import("./types").getChannelDetailsResponse} the array of found channels
   */
  async getChannelDetails(channelFilter = false, maxResults = 1) {
    if(channelFilter.channelID && channelFilter.channelName) throw new Error("Only channelID or channelName can be specified at the same time")
    if(!channelFilter.channelName && !channelFilter.channelID) throw new Error("ChannelID or channelName has to be specified")
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "snippet");
    if (channelFilter.channelName) {
      url.searchParams.set("forUsername", channelFilter.channelName);
    } else {
      url.searchParams.set("id", channelFilter.channelID);
    }
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   *
   * @param {import("./types").channelFilter} channelFilter the channelfilter
   * @param {number} maxResults the max results
   * @returns {import("./types").getChannelStatusResponse} the array of found channels
   */
  async getChannelStatus(channelFilter = false, maxResults = 1) {
    if(channelFilter.channelID && channelFilter.channelName) throw new Error("Only channelID or channelName can be specified at the same time")
    if(!channelFilter.channelName && !channelFilter.channelID) throw new Error("ChannelID or channelName has to be specified")
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "status");
    if (channelFilter.channelName) {
      url.searchParams.set("forUsername", channelFilter.channelName);
    } else {
      url.searchParams.set("id", channelFilter.channelID);
    }
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   *
   * @param {import("./types").channelFilter} channelFilter the channelfilter
   * @param {number} maxResults the max results
   * @returns {import("./types").getChannelLocalizationsResponse} the array of found channels
   */
  async getChannelLocalizations(channelFilter = false, maxResults = 1) {
    if(channelFilter.channelID && channelFilter.channelName) throw new Error("Only channelID or channelName can be specified at the same time")
    if(!channelFilter.channelName && !channelFilter.channelID) throw new Error("ChannelID or channelName has to be specified")
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "localizations");
    if (channelFilter.channelName) {
      url.searchParams.set("forUsername", channelFilter.channelName);
    } else {
      url.searchParams.set("id", channelFilter.channelID);
    }
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   *
   * @param {import("./types").channelFilter} channelFilter the channelfilter
   * @param {number} maxResults the max results
   * @returns {import("./types").getChannelStatsReponse} the array of found channels
   */
  async getChannelStats(channelFilter = false, maxResults = 1) {
    if(channelFilter.channelID && channelFilter.channelName) throw new Error("Only channelID or channelName can be specified at the same time")
    if(!channelFilter.channelName && !channelFilter.channelID) throw new Error("ChannelID or channelName has to be specified")
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "statistics");
    if (channelFilter.channelName) {
      url.searchParams.set("forUsername", channelFilter.channelName);
    } else {
      url.searchParams.set("id", channelFilter.channelID);
    }
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

    /**
   *
   * @param {import("./types").channelFilter} channelFilter the channelfilter
   * @param {number} maxResults the max results
   * @returns {import("./types").getChannelContentDetailsReponse} the array of related playlists
   */
     async getChannelContentDetails(channelFilter = false, maxResults = 1) {
      if(channelFilter.channelID && channelFilter.channelName) throw new Error("Only channelID or channelName can be specified at the same time")
      if(!channelFilter.channelName && !channelFilter.channelID) throw new Error("ChannelID or channelName has to be specified")
      let url = new URL(ENDPOINTS.Channel_info);
      url.searchParams.set("part", "contentDetails");
      if (channelFilter.channelName) {
        url.searchParams.set("forUsername", channelFilter.channelName);
      } else {
        url.searchParams.set("id", channelFilter.channelID);
      }
      url.searchParams.set("maxResults", maxResults.toString());
      let res = await this.getAPI(url);
      return res.items;
    }

  /**
   *
   * @param {import("./types").channelFilter} channelFilter the channelfilter
   * @param {number} maxResults the max results
   * @returns {import("./types").getChannelBrandingResponse} the array of found channels
   */
  async getChannelBranding(channelFilter, maxResults = 1) {
    if(channelFilter.channelID && channelFilter.channelName) throw new Error("Only channelID or channelName can be specified at the same time")
    if(!channelFilter.channelName && !channelFilter.channelID) throw new Error("ChannelID or channelName has to be specified")
    let url = new URL(ENDPOINTS.Channel_info);
    url.searchParams.set("part", "brandingSettings");
    if (channelFilter.channelName) {
      url.searchParams.set("forUsername", channelFilter.channelName);
    } else {
      url.searchParams.set("id", channelFilter.channelID);
    }
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * @param {string} id the Channel id of which you wanna get the channelpage
   * @param {string} csid the channelsection-id which you can get by retrieving the id from the item
   * @returns {import("./types").getChannelHomepageResponse} the object used to describe the channelpage
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
   * @returns {import("./types").getChannelPageContentResponse} the object used to describe the content of the channelpage
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
   * @returns {import("./types").getCaptionInfosResponse} an object that describes the caption
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
   * @param {import("./types").searchFilter} filter the search query
   * @param {Number} maxResults the number of results
   * @returns {import("./types").searchResponse} the searchresults
   */
  async search(filter, maxResults = 1) {
    let url = new URL(ENDPOINTS.Search);
    let vals = Object.values(filter);
    Object.keys(filter).forEach((el, i) => {
      url.searchParams.set(el, vals[i]);
    })
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * 
   * @param {import("./types").playlistFilter} filter The search filter; Only specify 1 argument
   * @param {number} maxResults the maximum results, you get (default is 5)
   * @returns {import("./types").getPlaylistsResponse} An object that represents the Playlists
   */
  async getPlaylists(filter, maxResults=5) {
    if(filter.channelID && filter.playlistID) throw new Error("The channelID can't exist at the same time with the playlistID")
    if(!filter.channelID && !filter.playlistID) throw new Error("One, channelID or playlistID needs to be specified")
    let url = new URL(ENDPOINTS.playlist);
    url.searchParams.set("part", "snippet")
    if (filter.channelID) url.searchParams.set("channelId", filter.channelID)
    if (filter.playlistID) url.searchParams.set("id", filter.playlistID);
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * 
   * @param {import("./types").playlistFilter} filter The search filter; Only specify 1 argument
   * @param {number} maxResults the maximum results, you get (default is 5)
   * @returns {import("./types").getPlaylistsContentDetailsResponse} An object that represents the PlaylistsContentDetails
   */
   async getPlaylistsContentDetails(filter, maxResults=5) {
    if(filter.channelID && filter.playlistID) throw new Error("The channelID can't exist at the same time with the playlistID")
    if(!filter.channelID && !filter.playlistID) throw new Error("One, channelID or playlistID needs to be specified")
    let url = new URL(ENDPOINTS.playlist);
    url.searchParams.set("part", "contentDetails")
    if (filter.channelID) url.searchParams.set("channelId", filter.channelID)
    if (filter.playlistID) url.searchParams.set("id", filter.playlistID);
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * 
   * @param {import("./types").playlistFilter} filter The search filter; Only specify 1 argument
   * @param {number} maxResults the maximum results, you get (default is 5)
   * @returns {import("./types").getPlaylistsLocalizationsResponse} An object that represents the PlaylistsLocalizations
   */
   async getPlaylistsLocalizations(filter, maxResults=5) {
    if(filter.channelID && filter.playlistID) throw new Error("The channelID can't exist at the same time with the playlistID")
    if(!filter.channelID && !filter.playlistID) throw new Error("One, channelID or playlistID needs to be specified")
    let url = new URL(ENDPOINTS.playlist);
    url.searchParams.set("part", "localizations")
    if (filter.channelID) url.searchParams.set("channelId", filter.channelID)
    if (filter.playlistID) url.searchParams.set("id", filter.playlistID);
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * 
   * @param {import("./types").playlistFilter} filter The search filter; Only specify 1 argument
   * @param {number} maxResults the maximum results, you get (default is 5)
   * @returns {import("./types").getPlaylistsPlayerResponse} An object that represents the PlaylistsPlayer
   */
   async getPlaylistsPlayer(filter, maxResults=5) {
    if(filter.channelID && filter.playlistID) throw new Error("The channelID can't exist at the same time with the playlistID")
    if(!filter.channelID && !filter.playlistID) throw new Error("One, channelID or playlistID needs to be specified")
    let url = new URL(ENDPOINTS.playlist);
    url.searchParams.set("part", "player")
    if (filter.channelID) url.searchParams.set("channelId", filter.channelID)
    if (filter.playlistID) url.searchParams.set("id", filter.playlistID);
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * 
   * @param {import("./types").playlistFilter} filter The search filter; Only specify 1 argument
   * @param {number} maxResults the maximum results, you get (default is 5)
   * @returns {import("./types").getPlaylistsStatusResponse} An object that represents the PlaylistsStatus
   */
   async getPlaylistsStatus(filter, maxResults=5) {
    if(filter.channelID && filter.playlistID) throw new Error("The channelID can't exist at the same time with the playlistID")
    if(!filter.channelID && !filter.playlistID) throw new Error("One, channelID or playlistID needs to be specified")
    let url = new URL(ENDPOINTS.playlist);
    url.searchParams.set("part", "status")
    if (filter.channelID) url.searchParams.set("channelId", filter.channelID)
    if (filter.playlistID) url.searchParams.set("id", filter.playlistID);
    url.searchParams.set("maxResults", maxResults.toString());
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * 
   * @param {import("./types").playlistItemFilter} filter The filter for fetching the items
   * @param {number} maxResults The maximal number of results you will get (default is 5)
   * @returns {import("./types").getPlaylistItemsResponse} a object that represents the playlistsItems
   */
  async getPlaylistItems(filter, maxResults=5) {
    if(filter.playlistItemID && filter.playlistID) {logger.error("${info(api, error)} ", "The playlistItemID can't exist at the same time with the playlistID"); throw new Error("The channelID can't exist at the same time with the playlistID");}
    if(!filter.playlistItemID && !filter.playlistID) {logger.error("${info(api, error)} ", "One, playlistItemID or playlistID needs to be specified"); throw new Error("One, channelID or playlistID needs to be specified");}
    let url = new URL(ENDPOINTS.playlist_items);
    url.searchParams.set("part", "snippet")
    url.searchParams.set("maxResults", maxResults.toString());
    if(filter.playlistItemID) url.searchParams.set("id", filter.playlistItemID);
    if(filter.playlistID) url.searchParams.set("playlistId", filter.playlistID);
    let res = await this.getAPI(url);
    return res.items;
  }
  
  /**
   * 
   * @param {import("./types").playlistItemFilter} filter The filter for fetching the items
   * @param {number} maxResults The maximal number of results you will get (default is 5)
   * @returns {import("./types").getPlaylistsItemsStatusResponse} a object that represents the playlistsItemsStatus
   */
   async getPlaylistItemsStatus(filter, maxResults=5) {
    if(filter.playlistItemID && filter.playlistID) {logger.error("${info(api, error)} ", "The playlistItemID can't exist at the same time with the playlistID"); throw new Error("The channelID can't exist at the same time with the playlistID");}
    if(!filter.playlistItemID && !filter.playlistID) {logger.error("${info(api, error)} ", "One, playlistItemID or playlistID needs to be specified"); throw new Error("One, channelID or playlistID needs to be specified");}
    let url = new URL(ENDPOINTS.playlist_items);
    url.searchParams.set("part", "status")
    url.searchParams.set("maxResults", maxResults.toString());
    if(filter.playlistItemID) url.searchParams.set("id", filter.playlistItemID);
    if(filter.playlistID) url.searchParams.set("playlistId", filter.playlistID);
    let res = await this.getAPI(url);
    return res.items;
  }
  
  /**
   * 
   * @param {import("./types").playlistItemFilter} filter The filter for fetching the items
   * @param {number} maxResults The maximal number of results you will get (default is 5)
   * @returns {import("./types").getPlaylistsItemsContentDetailsResponse} a object that represents the playlistsItemsContentDetails
   */
   async getPlaylistItemsContentDetails(filter, maxResults=5) {
    if(filter.playlistItemID && filter.playlistID) {logger.error("${info(api, error)} ", "The playlistItemID can't exist at the same time with the playlistID"); throw new Error("The channelID can't exist at the same time with the playlistID");}
    if(!filter.playlistItemID && !filter.playlistID) {logger.error("${info(api, error)} ", "One, playlistItemID or playlistID needs to be specified"); throw new Error("One, channelID or playlistID needs to be specified");}
    let url = new URL(ENDPOINTS.playlist_items);
    url.searchParams.set("part", "contentDetails")
    url.searchParams.set("maxResults", maxResults.toString());
    if(filter.playlistItemID) url.searchParams.set("id", filter.playlistItemID);
    if(filter.playlistID) url.searchParams.set("playlistId", filter.playlistID);
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * 
   * @param {import("./types").commentFilter} filter the query filter
   * @param {import("./types").commentFormatFilter} format the format filter for the response
   * @param {number} maxResults the maximal amount of results (default is 20)
   * @returns {import("./types").getCommentsRepsonse} An object that represents the comments
   */

  async getComments(filter, format, maxResults=20) {
    if(filter.channelID && filter.commentID && filter.videoID) {logger.error("${info(api, error)} ", "The channelID, commentID and videoID can't exist at the same time"); throw new Error("The channelID, commentID and videoID can't exist at the same time"); }
    if(!filter.channelID && !filter.commentID && !filter.videoID) {logger.error("${info(api, error)} ", "channelID, commentID or videoID has to be specified"); throw new Error("channelID, commentID or videoID has to be specified"); }
    let url = new URL(ENDPOINTS.comment_threads);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("textFormat", format);
    url.searchParams.set("maxResults", maxResults.toString());
    if(filter.videoID) url.searchParams.set("videoId", filter.videoID);
    if(filter.commentID) url.searchParams.set("id", filter.commentID);
    if(filter.channelID) url.searchParams.set("channelId", filter.channelID);
    let res = await this.getAPI(url);
    return res.items;
  }

  /**
   * 
   * @param {import("./types").commentFilter} filter the query filter
   * @param {import("./types").commentFormatFilter} format the format filter for the response
   * @param {number} maxResults the maximal amount of results (default is 20)
   * @returns {import("./types").getCommentsRepliesRepsonse} An object that represents the commentsReplies
   */

   async getCommentsReplies(filter, format, maxResults=20) {
    if(filter.channelID && filter.commentID && filter.videoID) {logger.error("${info(api, error)} ", "The channelID, commentID and videoID can't exist at the same time"); throw new Error("The channelID, commentID and videoID can't exist at the same time")};
    if(!filter.channelID && !filter.commentID && !filter.videoID) { logger.error("${info(api, error)}", "channelID, commentID or videoID has to be specified"); throw new Error("channelID, commentID or videoID has to be specified");}
    let url = new URL(ENDPOINTS.comment_threads);
    url.searchParams.set("part", "replies");
    url.searchParams.set("textFormat", format);
    url.searchParams.set("maxResults", maxResults.toString());
    if(filter.videoID) url.searchParams.set("videoId", filter.videoID);
    if(filter.commentID) url.searchParams.set("id", filter.commentID);
    if(filter.channelID) url.searchParams.set("channelId", filter.channelID);
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
