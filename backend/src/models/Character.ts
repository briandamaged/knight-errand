
import { Prop, PropID } from ".";
import { EventEmitter } from "events";
import GameEngine from "../GameEngine";

export interface ICharacter {
  getProps(): Promise<Iterable<Prop>>;

  inform(message: string): void;
  entered(location: Location): void;
}


export class Character extends EventEmitter implements ICharacter {
  engine: GameEngine;
  propIDs: PropID[];

  constructor({engine}: {engine: GameEngine}) {
    super();
    this.engine = engine;
    this.propIDs = [];
  }

  async getProps() {
    return [];
  }

  inform(message: string) {
    this.emit('informed', message);
  }

  entered(location: Location) {
    this.emit('entered', location);
  }

}
