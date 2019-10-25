
import {
  Location, Character, LocationID,
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

  getLocation(id: LocationID | undefined) {
    if(id) {
      return this.locationMap[id];
    }
  }

  look({sender}: {sender: Character}) {
    const location = this.getLocation(sender.currentLocationID);
    if(location) {
      sender.inform(location.getDescription());
    }
  }
}
