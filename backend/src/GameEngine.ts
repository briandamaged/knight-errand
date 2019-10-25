
import {
  Location, Character, LocationID, Direction,
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


  go({sender, direction}: {sender: Character, direction: Direction}) {
    const location = this.getLocation(sender.currentLocationID);

    if(location) {
      const destinationID = location.exits[direction];
      if(destinationID) {
        const destination = this.getLocation(destinationID);
        if(destination) {
          sender.currentLocationID = destination.id;
          sender.inform("You walk valiantly!");
        } else {
          sender.inform(`Could not load Location with id = ${JSON.stringify(destinationID)}`);
        }
      } else {
        sender.inform("There does not appear to be an exit in that direction");
      }
    } else {
      sender.inform("Somehow, you appear to be floating in the void.  How fun!");
    }
  }

}
