/**
 * Created by FishingHacks
 * https://github.com/FishingHacks/LoggingLibrary
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
  remove(el) {
    let newArr = this.filter((_el) => el != _el);
    this.clear();
    this.add(newArr);
  }
  removeAt(i) {
    let newArr = this.filter((el, _i) => i != _i);
    this.clear();
    this.add(newArr);
  }
  search(query) {
    let arr = [];
    this.forEach((item, i) => {
      if (query(item, i, this)) arr.push(item);
    });

    return arr;
  }
  filter_(func) {
    let newArr = new ArrayList();
    this.forEach((el, i) => {
      let ret = func(el, i, this);
      newArr.push(ret);
    });
    return newArr;
  }

  random(count = 1) {
    let items = new ArrayList();
    for (let i = 0; i < count; i++) {
      items.push(this[Math.floor(Math.random() * this.length)]);
    }
    this.add(items);
  }
}

let logFunctions = {
  date: (gmt = true, time = true, date = true) => {
    if (gmt) return new Date().toUTCString();
    return (
      (date ? new Date().toLocaleDateString() + " " : "") +
      (time ? new Date().toLocaleTimeString() : "")
    );
  },
  info: (proc, lvl) => `[${proc}/${lvl}]`,
};

function forEach(obj, func) {
  for (el in obj) {
    func(obj[el], el);
  }
}

function parseForLog(str) {
  let maxIter = 30;
  let iter = 0;
  let _iter = 0;
  let strarr = new ArrayList();
  let getFuncName = false;
  let funcname = "";
  addarr = [];
  forEach(str, (el) => strarr.append(el));
  strarr = strarr.filter_((el, i) => {
    if (!getFuncName) {
      if (el == "$") {
        if (strarr[i + 1] == "{") {
          getFuncName = true;
          funcname = "";
          return "";
        }
      }
    } else if (el == "}") {
      getFuncName = "";
      funcname = funcname.substring(1);
      if (funcname == "") return "";
      if (!funcname.match(/^[A-Za-z_-]+\(["a-zA-Z0-9., ']*\)$/)) {
        if (funcname.match(/["',\.()]/)) {
          return "";
        }
        if (logFunctions[funcname]) {
          return logFunctions[funcname]();
        }
        return "";
      }
      let s = funcname.split("(");
      s[1] = s[1].substring(0, s[1].length - 1);
      let aargs = s[1].split(",");
      let args = [];
      aargs.forEach((el) => {
        el = el.replace(/ +/, "");
        if (el == "true") {
          args.push(true);
        } else if (el == "false") {
          args.push(false);
        } else if (!isNaN(Number(el))) {
          args.push(Number(el));
        } else {
          args.push(el);
        }
      });
      if (typeof logFunctions[s[0]] == "function") {
        try {
          let res = logFunctions[s[0]](...args);
          return res;
        } catch {
          return "";
        }
      }
      funcname = "";
      return "";
    } else {
      funcname += el;
      return "";
    }
    return el;
  });
  return strarr.join("");
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
    tempDescription += ": ";
    if (datatype == "object")
      tempDescription +=
        "object: " + xinspect(for_console, object[property], prefix + "  ");
    else tempDescription += object[property];

    rows.push(tempDescription);
  }

  let r = rows.join(prefix + " ");
  return r;
}

class Logger {
  constructor(name) {
    this._n = name;
  }

  get name() {
    return this._n;
  }

  log(message, userinput = "", func = console.log) {
    if (typeof message == "object") {
      if (typeof message["getUnsafeMessage"] == "function") {
        userinput = message.getUnsafeMessage();
      }
      if (typeof message["getMessage"] == "function") {
        message = parseForLog(message.getMessage());
      }
    } else {
      message = parseForLog(this.name + " " + message);
    }
    func(message + userinput);
  }

  error(msg, ui = "", ...objects) {
    let inspectedObjects = [];
    objects.forEach((el) => inspectedObjects.push(xinspect(el)));
    this.log(msg, ui + " " + inspectedObjects.join(" "), console.error);
  }

  warn(msg, ui, ...objects) {
    let inspectedObjects = [];
    objects.forEach((el) => inspectedObjects.push(xinspect(el)));
    this.log(msg, ui + " " + inspectedObjects.join(" "), console.warn);
  }
}

function getLogger(pref) {
  return new Logger(pref);
}

function addLogFunction(name, func) {
  if (typeof name == typeof "string" && typeof func == typeof (() => {})) {
    if (name.match(/["'(),.]/)) {
      return "Function name contains bad characters";
    }
    logFunctions[name] = func;
    return "success!";
  }
  return "The name isn't a string or the function isn't a function";
}

function getMessageObject(msg, ui) {
  return new Message(msg, ui);
}

class Message {
  constructor(message, usermessage) {
    this.message = message;
    this.ui = usermessage;
  }

  getMessage() {
    return this.message;
  }

  getUnsafeMessage() {
    return this.ui;
  }
}

if (!globalThis["window"]) {
  module.exports = {
    Message,
    logFunctions,
    addLogFunction,
    getMessageObject,
    Logger,
    getLogger,
    ArrayList,
  };
}