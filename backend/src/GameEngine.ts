
import {
  Location, Character, LocationID, Prop, PropID, CommandContext, Command, CommandHandler,
} from './models';

import EventEmitter from 'events';
import { Resolver, DepthFirstResolver } from 'conditional-love';



export default class GameEngine extends EventEmitter {
  locationMap: Record<LocationID, Location>;
  propMap: Record<PropID, Prop>;
  commandResolvers: Resolver<[CommandContext<Command>], CommandHandler<Command> >[];

  _handleCommand: Resolver<[CommandContext<Command>], CommandHandler<Command> >;

  // TODO: Fix this hackety-hack
  parseInstruction: (instruction: string)=> Command | undefined;

  constructor({parseInstruction}: {parseInstruction: (instruction: string)=> Command | undefined}) {
    super();

    this.locationMap = Object.create(null);
    this.propMap = Object.create(null);

    this.commandResolvers = [];


    this._handleCommand = DepthFirstResolver<[CommandContext<Command>], CommandHandler<Command> >(
      ()=> this.commandResolvers,
    )

    this.parseInstruction = parseInstruction;
  }

  install(resolver: Resolver<[CommandContext<Command>], CommandHandler<Command> >) {
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

    sender.inform(`Received unknown command:\n\n${JSON.stringify(command, null, 2)}`)
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
