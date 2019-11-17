
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




interface EngineAware {
  getEngine(): FakeGameEngine;
}


interface FakeLocation {
  id: LocationID;
  getProps(): Promise<Iterable<Prop>>;
}

interface Describable {
  getDescription(): string;
}


function createGetDescription(params: Record<string, any>) {
  if(typeof(params.getDescription) === 'function') {
    return params.getDescription;
  }

  const description = (
    (typeof(params.description) === 'string')
      ? params.description
      : "It looks about the way you'd expect"
  );

  return function getDescription() {
    return description;
  }
}

function injectDescription<T>(location: T, params: Record<string, any>): T & Describable {

  const retval = Object.assign(location, {
    getDescription: createGetDescription(params),
  });

  return retval;
}

const DescriptionInjector = (
  (params: Record<string, any>)=>
    <T>(location: T)=>
      injectDescription(location, params)
);



const LocationIDInjector = (
  (params: Record<string, any>)=>
    function injectLocationID<T>(location: T): T & {id: LocationID} {
      const id = (
        (typeof(params.id) === 'undefined')
          ? `${Math.random()}`
          : params.id
      );

      return Object.assign(location, {id: id});
    }
)







class FakeGameEngine {
  createLocation(params: Record<string, any>): EngineAware & FakeLocation {
    const engine = this;
    const location = {
      getEngine() {
        return engine;
      },

      async getProps() {
        return [];
      }
    }

    const injectLocationID = LocationIDInjector(params);
    const injectDescription = DescriptionInjector(params);

    return injectLocationID(injectDescription(location));
  }

}


const fakeEngine = new FakeGameEngine();


const foo = fakeEngine.createLocation({
  id: "foo.id",
  getDescription() {
    return this.id;
  }
});


const bar: any = foo;

console.log(bar.getDescription());

