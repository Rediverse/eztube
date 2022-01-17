/**
 * Created by FishingHacks
 * https://github.com/FishingHacks/utils
 */
class ArrayList extends Array {
  constructor() {
    super();
  }

  append(el) {
    this.push(el);
  }
  clear() {
    while (this.length > 0) {
      this.shift();
    }
  }
  add(arr) {
    while (arr.length > 0) {
      this.push(arr.shift());
    }
  }
  remove(_el) {
    let newArr = this.filter((el) => el != _el);
    this.clear();
    this.add(newArr);
  }
  removeAt(_i) {
    let newArr = this.filter((el, i) => i != _i);
    this.clear();
    this.add(newArr);
  }
  search(query) {
    let arr = [];
    this.forEach((item) => {
      if (query(item)) arr.push(item);
    });

    return arr;
  }
  filter_(func) {
    let newArr = [];
    this.forEach((el, i, arr) => {
      newArr.push(func(el, i, arr));
    });
    return newArr;
  }

  random(count) {
    if (!count) count = 1;

    let items = this[Math.floor(Math.random() * this.length)];

    if (count > 1) {
      items = [];
      for (let i = 0; i < count; i++) {
        items.push(this[Math.floor(Math.random() * this.length)]);
      }
    }
    this.add(items);
  }
}

function xinspect(object, prefix) {
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

function forEach<T>(obj: T, func: (obj: object, i: number, list: T)=>void) {
  let i = 0;
  for (let el in obj) {
    func((obj as any)[el], Number(el), obj);
    i++;
  }
}

function validateObject(obj: object, template: object) {
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
        validateObject(obj[prop], template[prop]),
      ]);
    } else {
      _templ.append([prop, typeof template[prop]]);
    }
  }
  for (let prop in obj) {
    if (
      typeof obj[prop] == typeof {} &&
      typeof obj[prop] == typeof template[prop] &&
      template[prop] != null
    ) {
      _obj.append([
        prop,
        typeof obj[prop],
        validateObject(obj[prop], template[prop]),
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
        if (el.includes(..._el)) _tmp = true;
      });
      if (!_tmp) {
        neq = true;
      }
    }
  });
  return !neq;
}

export default class utils {
  validateObject: (obj: object, template: object)=>boolean = validateObject;
  xinspect: <T>(object: T, prefix?: string) => string = xinspect;
  forEach: <T>(obj: T, func: (obj: object, i: number, list: T) => void)=>void = forEach;
}