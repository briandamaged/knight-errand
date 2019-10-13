
import {
  Location, Character, Entity, Describeable,
} from './models';

import EventEmitter from 'events';

interface getDescriptionSpec {
  viewer: Character,
  target: Entity,
}

export default class GameEngine extends EventEmitter {
  constructor({} = {}) {
    super();
  }


  async getDescription({viewer, target}: getDescriptionSpec): Promise<string | undefined> {
    return target.description;
  }

}
