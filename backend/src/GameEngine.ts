
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
    const ctx: CommandContext<Command> = {
      sender: sender,
      engine: this,
      command: command,
    };

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


}
