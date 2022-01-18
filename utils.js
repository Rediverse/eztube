/**
 * Created by FishingHacks
 * https://github.com/FishingHacks/utils
 */
const { ArrayList } = require("./logger");

/**
 * 
 * @param {any} object 
 * @param {string} prefix 
 * @returns {string}
 * 
 * Inspect the passed object
 */
function xinspect(object, prefix="") {
  if (typeof object == "undefined" || object == null) {
    return "null";
  }
  if (typeof object != "object") return "Invalid object";
  if (typeof prefix == "undefined") prefix = "";

  if (prefix.length > 50) return "[RECURSION TOO DEEP. ABORTING.]";

  var rows = [];
  for (var property in object) {
    var datatype = typeof object[property];

    var tempDescription = prefix + '"' + property + '"';
    tempDescription += " (" + datatype + ") => ";
    if (datatype == "object")
      tempDescription +=
        "object: " + xinspect(object[property], prefix + "  ");
    else tempDescription += object[property];

    rows.push(tempDescription);
  }

  let r = rows.join(prefix + "\n");
  return r;
}


/**
 * 
 * @param {any} obj 
 * @param {(el: any, i: number, obj: any)=>void} func 
 * 
 * Loops over the object
 */
function forEach(obj, func) {
  let i = 0;
  for (let el in obj) {
    func(obj[el], Number(el), obj);
    i++;
  }
}


/**
 * 
 * @param {any} obj 
 * @param {any} template 
 * @returns boolean
 * 
 * Checkes if the objects structure is the same as the of the passed template
 * Values doesn't matter
 */
function validateObject(obj, template) {
  let _templ = new ArrayList();
  let _obj = new ArrayList();
  for (let prop in template) {
    if (
      typeof template[prop] == typeof {} &&
      typeof obj[prop] == typeof template[prop] &&
      obj[prop] != null
    ) {
      _templ.append([
        prop,
        typeof template[prop],
        validateObject([prop], template[prop]),
      ]);
    } else {
      _templ.append([prop, typeof template[prop]]);
    }
  }
  for (let prop in obj) {
    if (prop == undefined) continue;
    if (
      typeof obj[Number(prop)] == typeof {} &&
      typeof obj[Number(prop)] == typeof template[Number(prop)] &&
      template[Number(prop)] != null
    ) {
      _obj.append([
        prop,
        typeof obj[prop],
        (typeof template["prop"] != "undefined"?validateObject([prop], template[prop]):false),
      ]);
    } else {
      _obj.append([prop, typeof obj[prop]]);
    }
  }
  let neq = false;
  let _tmp = false;
  _templ.forEach((el) => {
    if (!neq) {
      _obj.forEach((_el) => {
        if (el.includes(_el[0], _el[1])) _tmp = true;
      });
      if (!_tmp) {
        neq = true;
      }
    }
  });
  return !neq;
}

module.exports = {
  forEach,
  validateObject,
  xinspect,
  ArrayList
}