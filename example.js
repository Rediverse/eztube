const { utils, client } = require("./index");

(async function () {
    let result;
    result = await client().setToken(require("./key")).getVideoStatus("PYW4AIMEvsU");
    console.log(result)
})();