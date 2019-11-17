
import {
  Location, Character, LocationID, Prop, PropID, CommandContext, Command, CommandHandler,
} from './models';

import EventEmitter from 'events';
import { Resolver, DepthFirstResolver } from 'conditional-love';



function injectLocationID<T>(location: T, _id?: LocationID) {
  const id = _id || `${Math.random()}`
  return Object.assign(location, {id});
}

const LocationIDInjector = (
  (params: Record<string, any>)=>
    <T>(location: T)=>
      injectLocationID(location, params.id)
);


function createGetDescription(params: Record<string, any>) {
  if(typeof(params.getDescription) === 'function') {
    return params.getDescription;
  } else {
    const description = (
      (typeof(params.description) === 'string')
        ? params.description
        : "It looks about the way you'd expect"
    );

    return function getDescription() {
      return description;
    }
  }
}

function injectDescription<T>(location: T, params: Record<string, any>) {
  const getDescription = createGetDescription(params);
  return Object.assign(location, {getDescription});
}

const DescriptionInjector = (
  (params: Record<string, any>)=>
    <T>(location: T)=>
      injectDescription(location, params)
);


export default class GameEngine extends EventEmitter {
  locationMap: Record<LocationID, Location>;
  propMap: Record<PropID, Prop>;
  commandResolvers: Resolver<[CommandContext<Command>], CommandHandler<Command> >[];

  _handleCommand: Resolver<[CommandContext<Command>], CommandHandler<Command> >;

  // TODO: Fix this hackety-hack
  _parseInstruction: (instruction: string)=> Iterable<Command>;

  constructor({_parseInstruction}: {_parseInstruction: (instruction: string)=> Iterable<Command>}) {
    super();

    this.locationMap = Object.create(null);
    this.propMap = Object.create(null);

    this.commandResolvers = [];


    this._handleCommand = DepthFirstResolver<[CommandContext<Command>], CommandHandler<Command> >(
      ()=> this.commandResolvers,
    )

    this._parseInstruction = _parseInstruction;
  }

  parseInstruction(instruction: string) {
    for(const cmd of this._parseInstruction(instruction)) {
      return cmd;
    }
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


  _createLocation(params: Record<string, any>): Location {
    const _location = {
      name: (params.name || "unnamed"),

      propIDs: [],
      exits: Object.create(null),
    };

    // TODO: Create a composition of Injector functions
    const injectLocationID = LocationIDInjector(params);
    const injectDescription = DescriptionInjector(params);

    // TODO: Apply the composition of Injector functions to _location
    const location = injectDescription(injectLocationID(_location));

    return location;
  }

  createLocation(params: Record<string, any>) {
    const location = this._createLocation(params);
    this.addLocation(location);
    return location;
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
