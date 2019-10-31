
import {
  Location, Character, LocationID, Direction, Prop, PropID,
} from './models';

import EventEmitter from 'events';

export default class GameEngine extends EventEmitter {
  locationMap: Record<LocationID, Location>;
  propMap: Record<PropID, Prop>;

  constructor({} = {}) {
    super();

    this.locationMap = Object.create(null);
    this.propMap = Object.create(null);
  }

  addLocation(location: Location) {
    this.locationMap[location.id] = location;
  }

  getLocation(id?: LocationID) {
    if(id) {
      return this.locationMap[id];
    }
  }



  addProp(prop: Prop) {
    this.propMap[prop.id] = prop;
  }

  getProp(id?: PropID) {
    if(id) {
      return this.propMap[id];
    }
  }



  look({sender}: {sender: Character}) {
    const location = this.getLocation(sender.currentLocationID);
    if(location) {
      const items = (
        location
          .propIDs
          .map((id)=> this.getProp(id))
          .filter((prop)=> typeof(prop) !== 'undefined')
      );

      sender.inform(`
${location.name}
-----

${location.getDescription()}

Items:
${items.map((item)=> ` - ${item.name}`).join("\n")}

Available Exits:
${ Object.keys(location.exits).map((x)=> ` - ${x}`).join("\n") }
      `);
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
          sender.entered(destination);
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


  teleport({sender, locationID}: {sender: Character, locationID: LocationID}) {
    const location = this.getLocation(locationID);
    if(location) {
      sender.currentLocationID = location.id;
      sender.entered(location);
    }
  }

}
