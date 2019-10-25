
import { EventEmitter } from "events";

export interface CommandContext<CMD extends Command = Command> {
  sender: Character,
  command: CMD,
}

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

export interface LookCommand extends Command {
  name: "look",
}

export interface HelpCommand extends Command {
  name: "help",
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
