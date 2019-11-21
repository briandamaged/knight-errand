import { EventEmitter } from "ws";
import { PropContainer, PropID, Prop } from "./Prop";
import GameEngine from "../GameEngine";
import { Location, LocationID } from "./Location";


export interface Character extends EventEmitter, PropContainer {
  getCurrentLocation(): Promise<Location | undefined>;
  setCurrentLocation(prop: Prop): Promise<boolean>;

  inform(message: string): void;
  entered(location: Location): void;

  // TODO: Remove these
  autolook: boolean;
}



export class EngineCharacter extends EventEmitter implements Character, PropContainer {
  currentLocationID: LocationID;
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

  async setCurrentLocation(location: Location) {
    if(this.currentLocationID !== location.id) {
      this.currentLocationID = location.id;
      return true;
    } else {
      return false;
    }
  }

  async getProps(): Promise<Prop[]> {
    return this.engine.getProps(this.propIDs);
  }

  async addProp(prop: Prop) {
    if(this.propIDs.includes(prop.id)) {
      return false;
    } else {
      this.propIDs.push(prop.id);
      return true;
    }
  }

  async removeProp(prop: Prop) {
    const index = this.propIDs.indexOf(prop.id);
    if(index < 0) {
      return false;
    } else {
      this.propIDs.splice(index, 1);
      return true;
    }
  }

  inform(message: string) {
    this.emit('informed', message);
  }

  entered(location: Location) {
    this.emit('entered', location);
  }
}
