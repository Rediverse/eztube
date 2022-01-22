/**
 * @param {(...args)=>any} func the function to test
 * @param {object} obj the object, that contains the function
 * @param {Array<any>} args the function arguments
 * @returns {Promise<boolean>} whether or not the function ran successfully
 */
module.exports.test_try = async function (
  func,
  obj=globalThis,
  args = [],
) {
  try {
    await func.bind(obj)(...args);
    return true;
  } catch (e) {
    console.log("Error", e.message);
    return false;
  }
};

/**
 * @param {(...args)=>any} func the function to test
 * @param {any} expectedOutput the expexted output
 * @param {object} obj the object, that contains the function
 * @param {Array<any>} args the function arguments
 * @returns {Promise<boolean>} whether or not the function gave back the expected Output.
 */
module.exports.test_return = async function (
  func,
  expectedOutput,
  obj=globalThis,
  args = [],
) {
  try {
    let res = await func.bind(obj)(...args);
    return res == expectedOutput;
  } catch (e) {
    console.log("Error", e.message);
    return false;
  }
};

module.exports.test_all = async function (promises) {
  let is_tested = true;
  let pres = true;
  let promise=undefined;
  for (i in promises) {
    promise = promises[i]
    pres = await promise;
    if (!pres) {
      is_tested = false;
    }
  }
    return is_tested;
};
