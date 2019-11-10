
import { EventEmitter } from "events";
import GameEngine from "../GameEngine";

export interface CommandContext<CMD extends Command = Command> {
  sender: Character;
  engine: GameEngine;
  command: CMD;
}

export interface Command {
  name: string,
}

export interface CommandHandler<CMD extends Command> {
  (ctx: CommandContext<CMD>): void
}



export interface RawCommand extends Command {
  name: "raw",
  content: string,
}

export type Direction = string;

export interface HelpCommand extends Command {
  name: "help",
}

export interface ResetCommand extends Command {
  name: "reset";
}


export class Character extends EventEmitter {
  currentLocationID: string;
  autolook: boolean;
  itemIDs: PropID[];

  constructor({currentLocationID}: {currentLocationID: LocationID}) {
    super();

    this.currentLocationID = currentLocationID;
    this.autolook = true;
    this.itemIDs = [];
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
