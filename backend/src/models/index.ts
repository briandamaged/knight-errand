
import { EventEmitter } from "events";
import GameEngine from "../GameEngine";
import { LocationID } from "./Location";

import {
  Prop, PropID, PropContainer
} from './Prop';

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

  // TODO: Maybe this should be a Resolver?
  async getCurrentLocation(): Promise<Location | undefined> {
    return this.engine.getLocation(this.currentLocationID);
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
