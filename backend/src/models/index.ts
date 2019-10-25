
import { EventEmitter } from "events";

export interface Command {
  name: string,
}

export interface RawCommand extends Command {
  name: "raw",
  content: string,
}

export type Direction = string;

export interface GoCommand extends Command {
  name: "go",
  direction: Direction,
}


export class Character extends EventEmitter {
  currentLocationID: string;

  constructor({currentLocationID}: {currentLocationID: LocationID}) {
    super();

    this.currentLocationID = currentLocationID;
  }

  inform(message: string) {
    this.emit('informed', message);
  }
}


export type LocationID = string;

export interface Location {
  id: LocationID,
  getDescription(): string,

  exits: {
    [key: string]: LocationID | undefined,
  },
}
