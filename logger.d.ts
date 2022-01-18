export class ArrayList<T> extends Array<T> {
  constructor();

  append(el: T): void;

  clear(): void;

  add(arr: ArrayList<T> | Array<T>): void;

  remove(el: T): void;

  removeAt(i: number): void;

  search(
    query: (item: T, i: number, list: ArrayList<T>) => boolean
  ): ArrayList<T>;

  filter_(func: (el: T, i: number, list: ArrayList<T>) => T): ArrayList<T>;

  random(count?: number): void;
}

export function parseForLog(str: string): string;

export class Logger {
  constructor(name: string);

  get name(): string;

  log(message: string | Message, ui?: string, func: (...args) => void);

  error(message: string | Message, ui?: string, ...objects);

  warn(message: string | Message, ui?: string, ...objects);
}

export function getLogger(pref: string): Logger;

export function addLogFunction(
  name: string,
  func: (...args: string | number | boolean) => string
): void;

export function getMessageObject(msg: string, ui: string): Message;

export class Message {
  constructor(name: string, ui: string);

  getMessage(): string;

  getUnsafeMessage(): string;
}
