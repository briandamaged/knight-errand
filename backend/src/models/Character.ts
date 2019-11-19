import { EventEmitter } from "ws";
import { PropContainer, PropID, Prop } from "./Prop";
import GameEngine from "../GameEngine";
import { Location, LocationID } from "./Location";

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
