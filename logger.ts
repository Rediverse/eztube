/**
 * Created by FishingHacks
 * https://github.com/FishingHacks/LoggingLibrary
 */
class ArrayList<T> extends Array<T> {
  constructor() {
    super();
  }

  append(el: T) {
    this.push(el);
  }
  clear() {
    while (this.length > 0) {
      this.shift();
    }
  }
  add(arr: Array<T>|ArrayList<T>) {
    while (arr.length > 0) {
      this.push(arr.shift());
    }
  }
  remove(el: T) {
    let newArr = this.filter((_el) => el != _el);
    this.clear();
    this.add(newArr);
  }
  removeAt(i: number) {
    let newArr = this.filter((el, _i) => i != _i);
    this.clear();
    this.add(newArr);
  }
  search(query: (el: T, i: number, list: ArrayList<T>)=>boolean) {
    let arr = [];
    this.forEach((item, i) => {
      if (query(item, i, this)) arr.push(item);
    });

    return arr;
  }
  filter_(func: (el: T, i: number, arr: ArrayList<T>) => T): ArrayList<T> {
    let newArr = new ArrayList<T>();
    this.forEach((el, i) => {
      newArr.push(func(el, i, this));
    });
    return newArr;
  }

  random(count=1) {
      let items: ArrayList<T> = new ArrayList<T>();
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

function forEach<T>(obj: T, func: (el: any, i: number, obj: T) => void) {
  for (let el in obj) {
    func(obj[Number(el)], Number(el), obj);
  }
}

function parseForLog(str: string): string {
  let maxIter = 30;
  let iter = 0;
  let _iter = 0;
  let strarr = new ArrayList<string>();
  let getFuncName = false;
  let funcname = "";
  let addarr: ArrayList<string> = new ArrayList<string>();
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
      let _getFuncName: string = "";
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

function xinspect(object: object, prefix = "") {
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
      tempDescription += "object: " + xinspect(object[property], prefix + "  ");
    else tempDescription += object[property];

    rows.push(tempDescription);
  }

  let r = rows.join(prefix + " ");
  return r;
}

class Logger {
  private _n: string;

  constructor(name: string) {
    this._n = name;
  }

  get prefix() {
    return this._n;
  }
  set prefix(value) {
    this._n = value;
  }

  setPrefix(value: string) {
    this.prefix = value;
    return this.prefix;
  }

  getPrefix(): string {
    return this.prefix;
  }

  log(
    message: string | Message,
    userinput = "",
    func: (...v: any[]) => void = console.log
  ) {
    if (message instanceof Message) {
      if (typeof message["getUnsafeMessage"] == "function") {
        userinput = message.getUnsafeMessage();
      }
      if (typeof message["getMessage"] == "function") {
        message = parseForLog(message.getMessage());
      }
    } else {
      message = parseForLog("[ " + this.prefix + "] " + message);
    }
    func(message + userinput);
  }

  error(msg: string | Message, ui = "", ...objects) {
    let inspectedObjects = [];
    objects.forEach((el) => inspectedObjects.push(xinspect(el)));
    this.log(msg, ui + " " + inspectedObjects.join(" "), console.error);
  }

  warn(msg: string | Message, ui = "", ...objects) {
    let inspectedObjects = [];
    objects.forEach((el) => inspectedObjects.push(xinspect(el)));
    this.log(msg, ui + " " + inspectedObjects.join(" "), console.warn);
  }
}

function getLogger(pref: string): Logger {
  return new Logger(pref);
}

function addLogFunction(name: string, func: (...args) => string) {
  if (typeof name == typeof "string" && typeof func == typeof (() => {})) {
    if (name.match(/["'(),.]/)) {
      return "Function name contains bad characters";
    }
    logFunctions[name] = func;
    return "success!";
  }
  return "The name isn't a string or the function isn't a function";
}

function getMessageObject(msg: string, ui: string = "") {
  return new Message(msg, ui);
}

class Message {
  private ui: string;
  private message: string;

  constructor(message: string, usermessage: string) {
    this.message = message;
    this.ui = usermessage;
  }

  getMessage(): string {
    return this.message;
  }

  getUnsafeMessage(): string {
    return this.ui;
  }
}

export default class logger {
  Message = Message;
  logFunction = logFunctions;
  addLogFunction: (name: string, func: (...args) => string) => void =
    addLogFunction;
  getMessageObject: (msg: string, ui?) => Message = getMessageObject;
  Logger = Logger;
  getLogger: (pref: string) => Logger = getLogger;
  ArrayList = ArrayList;
}
