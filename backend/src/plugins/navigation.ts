import GameEngine from "../GameEngine";
import { CommandContext, Command, Character, Direction, LocationID, GoCommand } from "../models";


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





export function NavigationPlugin(engine: GameEngine) {


  function* NavigationResolver(ctx: CommandContext<Command>) {
    if(ctx.command.name === "go") {
      yield function(_ctx: CommandContext<Command>) {
        go({
          engine: engine,
          sender: ctx.sender,
          direction: (_ctx.command as GoCommand).direction,
        })
      }
    }
  }

  return NavigationResolver;
}

