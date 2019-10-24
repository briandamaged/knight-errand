
import {
  Location,
} from './models';

import EventEmitter from 'events';

export default class GameEngine extends EventEmitter {
  locationMap: Record<string, Location>;

  constructor({} = {}) {
    super();

    this.locationMap = Object.create(null);
  }

  addLocation(location: Location) {
    this.locationMap[location.id] = location;
  }
}
