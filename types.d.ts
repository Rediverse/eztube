export type searchType = "channel" | "playlist" | "video";

export interface playlistFilter {
    channelID?: string,
    playlistID?: string,
}

export interface channelFilter {
    channelID?: string,
    channelName?: string,
}

export interface playlistItemFilter {
    playlistID?: string,
    playlistItemID?: string
}

export interface commentFilter {
    channelID?: string,
    videoID?: string,
    commentID?: string,
}

export type commentFormatFilter = "html" | "plainText";