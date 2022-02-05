const eztube = require("./index");

(async function () {
    let result;
    result = await eztube.client()
      .setToken(require("./key"))
      .getChannelPage("UCZjkJX6z-fKoxt-yQ3MuHPw")
    console.log(result)
})();