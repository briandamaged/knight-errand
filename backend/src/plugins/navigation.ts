import GameEngine from "../GameEngine";
import {
  CommandContext, Command, Character, Direction, LocationID, CommandHandler
} from "../models";

import { DepthFirstResolver } from "conditional-love";
import { WhenNameIs, Chain, Validate } from "./utils";



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

const handleGoCommand = Validate(isGoCommand)(function(ctx) {
  go({
    engine: ctx.engine,
    sender: ctx.sender,
    direction: ctx.command.direction,
  });
});

const handleTeleportCommand = Validate(isTeleportCommand)(function(ctx) {
  teleport({
    engine: ctx.engine,
    sender: ctx.sender,
    locationID: ctx.command.locationID,
  });
})

const resolveGoCommand = WhenNameIs("go", handleGoCommand);
const resolveTeleportCommand = WhenNameIs("teleport", handleTeleportCommand);


export const resolveNavigation = Chain([
  resolveGoCommand,
  resolveTeleportCommand,
]);


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
