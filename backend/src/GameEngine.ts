
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

  getProps(ids: PropID[]): Prop[] {
    return (
      ids
        .map((id)=> this.getProp(id))
        .filter((prop)=> prop) // Remove undefineds
    ) as Prop[];
  }



  look({sender}: {sender: Character}) {
    const location = this.getLocation(sender.currentLocationID);
    if(location) {
      const items = this.getProps(location.propIDs);

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


  get({sender, target}: {sender: Character, target?: string}) {
    const location = this.getLocation(sender.currentLocationID);
    if(location) {
      const props = this.getProps(location.propIDs);

      const p = props.find((pp)=> pp.name === target);
      if(p) {
        // Remove the item from the location
        location.propIDs = location.propIDs.filter((id)=> id !== p.id);

        // Place the item into the the sender's inventory
        sender.itemIDs.push(p.id);

        sender.inform(`You pick up the ${p.name}`);
      }
    }
  }


  items({sender}: {sender: Character}) {
    const items = this.getProps(sender.itemIDs);
    if(items.length === 0) {
      sender.inform("You are not carrying anything");
    } else {
      const entries = items.map((item)=> ` - ${item.name}`);
      const msg = ["You are carrying:", ...entries].join("\n");
      sender.inform(msg);
    }
  }

}
