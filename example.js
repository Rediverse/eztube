const { utils, client } = require("./index");

(async function () {
    let result;
    result = await client()
      .setToken(require("./key"))
      .getChannelLocalizations("UCMpB9W10RpTKZxTWRTYfrJg");
    console.log(result)
})();