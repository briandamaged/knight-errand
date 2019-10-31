
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

export interface AutoLookCommand extends Command {
  name: "autolook",
  enabled: boolean,
}


export class Character extends EventEmitter {
  currentLocationID: string;
  autolook: boolean;

  constructor({currentLocationID}: {currentLocationID: LocationID}) {
    super();

    this.currentLocationID = currentLocationID;
    this.autolook = true;
  }

  inform(message: string) {
    this.emit('informed', message);
  }

  entered(location: Location) {
    this.emit('entered', location);
  }
}


export type LocationID = string;

export interface Location {
  id: LocationID,
  name: string,

  getDescription(): string,

  propIDs: PropID[],

  exits: {
    [key: string]: LocationID | undefined,
  },
}


export type PropID = string;

export interface Prop {
  id: PropID,
  name: string,
}
