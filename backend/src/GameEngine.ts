
import {
  Location, Character, LocationID, Direction, Prop, PropID, CommandContext, Command,
} from './models';

import EventEmitter from 'events';
import { Resolver, DepthFirstResolver } from 'conditional-love';

interface CommandHandler {
  (ctx: CommandContext<Command>): void
}

export default class GameEngine extends EventEmitter {
  locationMap: Record<LocationID, Location>;
  propMap: Record<PropID, Prop>;
  commandResolvers: Resolver<[CommandContext<Command>], CommandHandler>[];

  _handleCommand: Resolver<[CommandContext<Command>], CommandHandler>;

  constructor({} = {}) {
    super();

    this.locationMap = Object.create(null);
    this.propMap = Object.create(null);

    this.commandResolvers = [];


    this._handleCommand = DepthFirstResolver<[CommandContext<Command>], CommandHandler>(
      ()=> this.commandResolvers,
    )
  }

  install(resolver: Resolver<[CommandContext<Command>], CommandHandler>) {
    this.commandResolvers.push(resolver);
  }

  handleCommand({sender, command}: {sender: Character, command: Command}) {
    const ctx: CommandContext<Command> = {sender, command};

    for(const h of this._handleCommand(ctx)) {
      return h(ctx);
    }
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

  drop({sender, target}: {sender: Character, target?: string}) {
    const items = this.getProps(sender.itemIDs);

    const item = items.find((it)=> it.name === target);
    if(item) {
      const location = this.getLocation(sender.currentLocationID);

      if(location) {
        sender.itemIDs = sender.itemIDs.filter((id)=> id !== item.id);
        location.propIDs.push(item.id);
        sender.inform(`You drop the ${item.name}`);
      } else {
        sender.inform(`Hmm... better not.  You seem to be floating in the void`);
      }
    } else {
      sender.inform(`You are not carrying the ${target}`);
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
