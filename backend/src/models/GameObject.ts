import { EventEmitter } from "events";


export interface GameObject extends EventEmitter {

  addLogic(logic: Logic): void;
  removeLogic(logic: Logic): boolean;

  getLogics(): Logic[];
}


export class GameObject extends EventEmitter {
  logics: Logic[];

  constructor() {
    super();
    this.logics = [];
  }

  addLogic(logic: Logic) {
    this.logics.push(logic);
  }

  removeLogic(logic: Logic) {
    const index = this.logics.indexOf(logic);
    if(index < 0) {
      return false;
    } else {
      this.logics.splice(index, 1);
      return true;
    }
  }

  getLogics() {
    return this.logics;
  }
}



export interface Logic {
  owner: GameObject;
}


export interface Character extends GameObject {
  name: string;

  getCurrentLocation(): Promise<Scene>;

  getItems(): Promise<Item[]>;
}


// Formerly Location
export interface Scene extends GameObject {
  name: string;

  getCharacters(): Promise<Character[]>;
  getScenery(): Promise<Scenery[]>;
  getItems(): Promise<Item[]>;
}


// Formerly a non-item Prop
export interface Scenery extends GameObject {
  name: string;
}


export interface Item extends GameObject {
  name: string;
}

