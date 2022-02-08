(async function () {
  const { channel } = require("./config");

  const client = require("../../index").client(require("./key"));

  let channelVideos = [];
  try {
    let res = await client.getChannelContentDetails({ channelID: channel }, 3);
    if (
      res &&
      res[0] &&
      res[0].contentDetails &&
      res[0].contentDetails.relatedPlaylists.uploads
    ) {
      let res1 = await client.getPlaylistItemsContentDetails(
        {
          playlistID: res[0].contentDetails.relatedPlaylists.uploads,
        },
        100
      );
      res1.forEach((el) => channelVideos.push(el.contentDetails.videoId));
    } else {
      throw new Error();
    }
  } catch (e) {
    console.log("An error occured!", e);
    process.exit(1);
  }

  setInterval(async () => {
    try {
      let res = await client.getChannelContentDetails(
        { channelID: channel },
        3
      );
      if (
        res &&
        res[0] &&
        res[0].contentDetails &&
        res[0].contentDetails.relatedPlaylists.uploads
      ) {
        let res1 = await client.getPlaylistItemsContentDetails(
          {
            playlistID: res[0].contentDetails.relatedPlaylists.uploads,
          },
          100
        );
        res1.forEach((el) => {
          if (channelVideos.indexOf(el.contentDetails.videoId) < 0) {
            channelVideos.push(el.contentDetails.videoId);
            let video = await client.getVideoInfos(el.contentDetails.videoId);
            console.log(
              `${video[0].snippet.channelTitle} uploaded ${video[0].snippet.title}`
            );
          }
        });
      } else {
        console.log("An error occured!", e);
        process.exit(1);
      }
    } catch (e) {
      console.log("An error occued!");
      process.exit(1);
    }
  });
})();
