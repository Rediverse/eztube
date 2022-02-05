const eztube = require("./index");

(async function () {
    let result;
    result = await eztube.client()
      .setToken(require("./key"))
      .getCommentsReplies({videoID: "91uNPxPoVww"}, "html")
    console.log(result)
})();