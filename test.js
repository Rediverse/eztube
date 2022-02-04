const key = require("./key");
const { client } = require("./index");
const { test_all, test_try, test_return } = require("./tester");

const c = client(key);
const vid = "qsnMrLe51ls";
const cid = "UCMaGRL-UnufF-eIcPObFdXQ";

(
  (async function () {
        console.log(await test_all([
            test_try(c.getCaptionInfos, c, [vid]),
            test_try(c.getChannelBranding, c, [cid]),
            test_try(c.getChannelDetails, c, [cid]),
            test_try(c.getChannelLocalizations, c, [cid]),
            test_try(c.getChannelPage, c, [cid]),
            test_try(c.getChannelPageContent, c, [cid]),
            test_try(c.getChannelStats, c, [cid]),
            test_try(c.getChannelStatus, c, [cid]),
            test_try(c.getPlayerEmbed, c, [vid]),
            test_try(c.getVideoInfos, c, [vid]),
            test_try(c.getVideoStatus, c, [vid]),
            test_try(c.search, c, ["RedCrafter07"])
        ]));
  })()
);