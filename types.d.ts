export type searchType = "channel" | "playlist" | "video";

export interface playlistFilter {
  channelID?: string;
  playlistID?: string;
}

export interface channelFilter {
  channelID?: string;
  channelName?: string;
}

export interface playlistItemFilter {
  playlistID?: string;
  playlistItemID?: string;
}

export interface commentFilter {
  channelID?: string;
  videoID?: string;
  commentID?: string;
}

export type commentFormatFilter = "html" | "plainText";

export type getVideoInfosResponse = Array<getVideoInfosResponseItem>;

interface getVideoInfosResponseItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    /**
     * Time is formated in RFC 3339
     */
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard: { url: string; width: number; height: number };
      maxRes: { url: string; width: number; height: number };
    };
    channelTitle: string;
    tags: Array<string>;
    categoryId: string;
    liveBroadcastContent: string;
    localized: { title: string; description: string };
    defaultAudioLanguage: string;
  };
}

export type getCaptionInfosResponse = Array<getCaptionInfosResponseItem>;

interface getCaptionInfosResponseItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    videoId: string;
    /**
     * Time is formated in RFC 3339
     */
    lastUpdated: string;
    trackKind: string;
    language: string;
    name: string;
    audioTrackType: string;
    isCC: boolean;
    isLarge: boolean;
    isEasyReader: boolean;
    isDraft: boolean;
    isAutoSynced: boolean;
    status: string;
  };
}

export type getChannelBrandingResponse = Array<getChannelBrandingResponseItem>;

interface getChannelBrandingResponseItem {
  kind: string;
  etag: string;
  id: string;
  brandingSettings: { channel: Object; image: Object };
}

export type getChannelStatusResponse = Array<getChannelStatusResponseItem>;

interface getChannelStatusResponseItem {
  kind: string;
  etag: string;
  id: string;
  status: {
    privacyStatus: string;
    isLinked: boolean;
    longUploadsStatus: string;
    madeForKids: boolean;
  };
}

export type getChannelStatsReponse = Array<getChannelStatsReponseItem>;

export interface getChannelStatsReponseItem {
  kind: string;
  etag: string;
  id: string;
  statistics: {
    /**
     * is set when hiddenSubscriberCount is equally to false
     */
    viewCount?: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

export type getChannelLocalizationsResponse =
  Array<getChannelLocalizationsResponseItem>;

export interface getChannelLocalizationsResponseItem {
  kind: string;
  id: string;
  etag: string;
  localizations?: {
    [name: string]: {
      title: string;
      description: string;
    };
  };
}

export type getChannelHomepageResponse = Array<getChannelHomepageResponseItem>;

export interface getChannelHomepageResponseItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    type: string;
    channelId: string;
    title?: string;
    position: number;
  };
}

export type getChannelPageContentResponse =
  Array<getChannelPageContentResponseItem>;

export interface getChannelPageContentResponseItem {
  kind: string;
  etag: string;
  id: string;
  contentDetails?: {
    channel: Array<string>;
  };
}

export type getVideoStatusResponse = Array<getVideoStatusResponseItem>;

interface getVideoStatusResponseItem {
  kind: string;
  etag: string;
  id: string;
  status: {
    uploadStatus: string;
    privacyStatus: string;
    embeddable: boolean;
    license: string;
    madeForKids: boolean;
    publicStatsViewable: boolean;
  };
}

export type getChannelDetailsResponse = Array<getChannelDetailsResponseItem>;

interface getChannelDetailsResponseItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    /**
     * Time is formated in RFC 3339
     */
    publishedAt: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      height: {
        url: string;
        width: number;
        height: number;
      };
    };
    defaultLanguage?: string;
    localized: {
      title: string;
      description: string;
    };
    country?: string;
  };
}

export type searchResponse = Array<searchResponseItem>;

export interface searchResponseItem {
  etag: string;
  kind: string;
  id: {
    kind: string;
    playlistId?: string;
    channelId?: string;
    videoId?: string;
  };
}

export type getPlaylistsResponse = Array<getPlaylistsResponseItem>;

export interface getPlaylistsResponseItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    /**
     * Time is formated in RFC 3339
     */
    publishedAt: string;
    channelId: string;
    title: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard: { url: string; width: number; height: number };
      maxRes: { url: string; width: number; height: number };
    };
    channelTitle: string;
    localized: {
      title: string;
      description: string;
    };
  };
}

export type getPlaylistsContentDetailsResponse =
  Array<getPlaylistsContentDetailsResponseItem>;

export interface getPlaylistsContentDetailsResponseItem {
  kind: string;
  etag: string;
  id: string;
  contentDetails: {
    itemCount: number;
  };
}

export type getPlaylistsLocalizationsResponse =
  Array<getPlaylistsLocalizationsResponseItem>;

export interface getPlaylistsLocalizationsResponseItem {
  kind: string;
  etag: string;
  id: string;
  localizations?: {
    [name: string]: {
      title: string;
      description: string;
    };
  };
}

export type getPlaylistsPlayerResponse = Array<getPlaylistsPlayerResponseItem>;

export interface getPlaylistsPlayerResponseItem {
  kind: string;
  etag: string;
  id: string;
  player: {
    embedHtml: string;
  };
}

export type getPlaylistsStatusResponse = Array<getPlaylistsStatusResponseItem>;

export interface getPlaylistsStatusResponseItem {
  kind: string;
  etag: string;
  id: string;
  status: {
    privacyStatus: string;
  };
}

export type getPlaylistItemsResponse = Array<getPlaylistItemsResponseItem>;

export interface getPlaylistItemsResponseItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    /**
     * Time is formated in RFC 3339
     */
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard: { url: string; width: number; height: number };
      maxRes: { url: string; width: number; height: number };
    };
    channelTitle: string;
    playlistId: string;
    position: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
}

export type getPlaylistsItemsStatusResponse =
  Array<getPlaylistsItemsStatusResponseItem>;

export interface getPlaylistsItemsStatusResponseItem {
  kind: string;
  etag: string;
  id: string2;
  status: { privacyStatus: string };
}

export type getPlaylistsItemsContentDetailsResponse =
  Array<getPlaylistsItemsContentDetailsResponseItem>;

export interface getPlaylistsItemsContentDetailsResponseItem {
  kind: string;
  etag: string;
  id: string2;
  contentDetails: { 
	  videoId: string,
	  videoPublishedAt: string
   };
}

export type getCommentsRepsonse = Array<getCommentsRepsonseItem>;

export interface getCommentsRepsonseItem {
	kind: string,
	id: string,
	etag: string,
	snippet: {
		videoId: string,
		topLevelComment: {
			kind: string,
			etag: string,
			id: string,
			snippet: {
				videoId: string,
				textDisplay: string,
				textOriginal: string,
				authorDisplayName: string,
				authorProfileImageUrl: string,
				authorChannelUrl: string,
				authorChannelId: {
					value: string
				},
				canRate: boolean,
				viewerRating: string,
				likeCount: number,
        /**
         * Time is formated in RFC 3339
         */
				publishedAt: string,
        /**
         * Time is formated in RFC 3339
         */
				updatedAt: string
			},
		},
		canReply: boolean,
		totalReplyCount: number,
		isPublic: boolean
	}
}

export type getCommentsRepliesRepsonse = Array<getCommentsRepliesRepsonseItem>;

export interface getCommentsRepliesRepsonseItem {
	kind: string,
	id: string,
	etag: string,
	replies: {
		comments: Array<{
			kind: string,
			etag: string,
			id: string,
			snippet: {
				videoId: string,
				textDisplay: string,
				textOriginal: string,
				authorDisplayName: string,
				authorProfileImageUrl: string,
				authorChannelUrl: string,
				authorChannelId: {
					value: string
				},
				canRate: boolean,
				viewerRating: string,
				likeCount: number,
        /**
         * Time is formated in RFC 3339
         */
				publishedAt: string,
        /**
         * Time is formated in RFC 3339
         */
				updatedAt: string
			},
		}>
	}
}

export interface searchFilter {
  /**
   * That what you normally type into the youtube search bar comes here
   */
  q?: string,
  channelId?: string,
  channelType?: "any"|"show",
  eventType?: "completed"|"live"|"upcoming",
  type?: "channel"|"playlist"|"video",
  /**
   * "(latitude,longitude)" for ex. "(37.42307,-122.08427)"
   */
  location?: string,
  /**
   * "x[m/km/mi/ft]" for ex. "10km"
   */
  locationRadius?: string,
  order?: "date"|"rating"|"relevance"|"title"|"videoCount"|"viewCount",
  /**
   * Time is formated in RFC 3339
   */
  publishedAfter?: string,
  /**
   * Time is formated in RFC 3339
   */
  publishedBefore?: string,
  safeSearchsafeSearch?: "none"|"moderate"|"strict",
  videoDefinition?: "any"|"high"|"standard",
  videoDimension?: "2d"|"3d"|"any",
  videoDuration?: "any"|"long"|"medium"|"short",
  videoEmbeddable?: "any"|"true",
  videoLicense?: "any"|"creativeCommon"|"youtube",
  videoSyndicated?: "any"|"true",
  videoType?: "any"|"episode"|"movie"
}

export type getChannelContentDetailsReponse = Array<getChannelContentDetailsReponseItem>;

export interface getChannelContentDetailsReponseItem {
  kind: string,
  etag: string,
  id: string,
  contentDetails?: {
    relatedPlaylists: {
      likes: string,
      favorites: string,
      uploads: string
    }
  }
}