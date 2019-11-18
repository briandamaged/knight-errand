
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


// TODO: Extract an interface so that we're not so tightly coupled
//       with GameEngine
export class Character extends EventEmitter implements PropContainer {
  currentLocationID: string;
  autolook: boolean;
  propIDs: PropID[];

  engine: GameEngine;

  constructor({currentLocationID, engine}: {currentLocationID: LocationID, engine: GameEngine}) {
    super();

    this.currentLocationID = currentLocationID;
    this.autolook = true;
    this.propIDs = [];

    this.engine = engine;
  }

  async getProps(): Promise<Prop[]> {
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

export interface Location extends PropContainer {
  id: LocationID;
  name: string;

  getDescription(): string;

  propIDs: PropID[];

  getProps(): Promise<Prop[]>;

  exits: {
    [key: string]: LocationID | undefined,
  };
}


export type PropID = string;

export interface Prop {
  id: PropID,
  name: string,
}


export interface PropContainer {
  getProps(): Promise<Prop[]>;
}
