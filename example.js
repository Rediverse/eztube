const eztube = require("./index");

(async function () {
    let result;
    result = await eztube.client()
      .setToken(require("./key"))
      .search("RedCrafter07", "channel", 2);
    console.log(result)
})();