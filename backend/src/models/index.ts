
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

export type Direction = string;


export interface ICharacter {
  getProps(): Promise<Iterable<Prop>>;

  inform(message: string): void;
  entered(location: Location): void;
}

export class Character extends EventEmitter implements PropContainer, ICharacter {
  currentLocationID: string;
  autolook: boolean;
  propIDs: PropID[];
  engine: GameEngine;

  constructor({engine, currentLocationID}: {engine: GameEngine, currentLocationID: LocationID}) {
    super();

    this.currentLocationID = currentLocationID;
    this.autolook = true;
    this.propIDs = [];
    this.engine = engine;
  }

  async getProps() {
    return this.engine.getProps(this.propIDs);
  }

  inform(message: string) {
    this.emit('informed', message);
  }

  entered(location: Location) {
    this.emit('entered', location);
  }
}


export type LocationID = string;

export interface ILocation extends PropContainer {
  id: LocationID,
  name: string,

  getDescription(): string,

  propIDs: PropID[],

  exits: {
    [key: string]: LocationID | undefined,
  },
}

export class Location extends EventEmitter implements ILocation {
  id: LocationID;
  name: string;
  description: string;
  engine: GameEngine;

  propIDs: PropID[];
  exits: {
    [key: string]: LocationID | undefined;
  }

  constructor({id, name, description, engine}: {id: LocationID, name: string, description: string, engine: GameEngine}) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.engine = engine;
    this.propIDs = [];

    this.exits = Object.create(null);
  }

  getDescription() {
    return this.description;
  }

  async getProps() {
    return this.engine.getProps(this.propIDs);
  }

}


export type PropID = string;

export interface Prop {
  id: PropID,
  name: string,
}


export interface PropContainer {
  getProps(): Promise<Iterable<Prop>>;
}
