export type searchType = 'channel' | 'playlist' | 'video';

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

export type commentFormatFilter = 'html' | 'plainText';

export type getVideoInfosResponse = Array<getVideoInfosResponseItem>;

interface getVideoInfosResponseItem {
	kind: string;
	etag: string;
	id: string;
	snippet: {
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

export type getChannelStatsReponse = Array<getChannelStatsReponseItem>

export interface getChannelStatsReponseItem {
	kind: string,
	etag: string,
	id: string,
	statistics: {
		viewCount: string,
		subscriberCount: string,
		hiddenSubscriberCount: boolean,
		videoCount: string
	}
}

export type getChannelLocalizationsResponse = Array<getChannelLocalizationsResponseItem>;

export interface getChannelLocalizationsResponseItem {
	kind: string,
	id: string,
	etag: string,
	localizations?: {
		[name: string]: {
			title: string,
			description: string
		}
	}
}

export type getChannelHomepageResponse = Array<getChannelHomepageResponseItem>;

export interface getChannelHomepageResponseItem {
	kind: string,
	etag: string,
	id: string,
	snippet: {
		type: string,
		channelId: string,
		title?: string,
		position: number
	}
}

export type getChannelPageContentResponse = Array<getChannelPageContentResponseItem>;

export interface getChannelPageContentResponseItem {
	kind: string,
	etag: string,
	id: string,
	contentDetails?: {
		channel: Array<string>
	}
}