const { utils, client } = require("./index");

(async function () {
    let result;
    result = await client()
      .setToken(require("./key"))
      .getCaptionInfos("qeMFqkcPYcg");
    console.log(result)
})();