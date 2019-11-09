import GameEngine from "../GameEngine";
import { CommandContext, Command, Character, Direction, LocationID} from "../models";
import { DepthFirstResolver } from "conditional-love";


interface CommandHandler<CMD extends Command = Command> {
  (ctx: CommandContext<CMD>): void
}

const CommandResolver = (
  <CMD extends Command = Command>(name: string, handler: CommandHandler<CMD>)=>
    function* resolveCommand(ctx: CommandContext<CMD>) {
      if(ctx.command.name === name) {
        yield handler;
      }
    }
)




interface GoCommand extends Command {
  name: "go";
  direction: string;
}

interface TeleportCommand extends Command {
  name: "teleport";
  locationID: LocationID;
}



// TODO: Consider using Joi validation
function isGoCommand(thing: any): thing is GoCommand {
  return (
    thing.name === "go" &&
    typeof(thing.direction) === 'string'
  );
}


function isTeleportCommand(thing: any): thing is TeleportCommand {
  return (
    thing.name === "teleport" &&
    typeof(thing.locationID) === 'string'
  )
}


const resolveGoCommand = CommandResolver("go", function(ctx) {
  if(isGoCommand(ctx.command)) {
    go({
      engine: ctx.engine,
      sender: ctx.sender,
      direction: ctx.command.direction,
    });
  } else {
    // TODO: Validation error of some kind?
    console.log("Noooooooooooo!")
  }
});

const resolveTeleportCommand = CommandResolver("teleport", function(ctx) {
  if(isTeleportCommand(ctx.command)) {
    teleport({
      engine: ctx.engine,
      sender: ctx.sender,
      locationID: ctx.command.locationID,
    });
  } else {
    // TODO: Validation error of some kind?
    console.log("Noooooooooooo!")
  }
});



export const resolveNavigation = DepthFirstResolver<[CommandContext<Command>], CommandHandler<Command> >(
  ()=> [
    resolveGoCommand,
    resolveTeleportCommand,
  ]
)




export function go({engine, sender, direction}: {engine: GameEngine, sender: Character, direction: Direction}) {
  const location = engine.getLocation(sender.currentLocationID);

  if(location) {
    const destinationID = location.exits[direction];
    if(destinationID) {
      const destination = engine.getLocation(destinationID);
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


export function teleport({engine, sender, locationID}: {engine: GameEngine, sender: Character, locationID: LocationID}) {
  const location = engine.getLocation(locationID);
  if(location) {
    sender.currentLocationID = location.id;
    sender.entered(location);
  }
}
