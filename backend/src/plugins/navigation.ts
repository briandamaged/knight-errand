import GameEngine from "../GameEngine";
import {
  CommandContext, Command, Direction, CommandHandler
} from "../models";

import {
  Location, LocationID
} from '../models/Location';

import { DepthFirstResolver } from "conditional-love";
import { WhenNameIs, Chain, Validate, AS } from "./utils";
import { ParsingContext, withParsingContext } from "../Parser";
import { Character } from "../models/Character";



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


export async function go({engine, sender, direction}: {engine: GameEngine, sender: Character, direction: Direction}) {
  const location = await sender.getCurrentLocation();

  if(location) {
    const destinationID = location.exits[direction];
    if(destinationID) {
      const destination = engine.getLocation(destinationID);
      if(destination) {
        sender.setCurrentLocation(destination);
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
    sender.setCurrentLocation(location);
    sender.entered(location);
  }
}




const directionMap = {
  north: ["north", "n"],
  south: ["south", "s"],
  east: ["east", "e"],
  west: ["west", "w"],
  northeast: ["northeast", "ne"],
  northwest: ["northwest", "nw"],
  southeast: ["southeast", "se"],
  southwest: ["southwest", "sw"],
};



export function* resolveGoInstruction(ctx: ParsingContext): Iterable<Command> {
  if(ctx.words[0] === "go") {
    yield AS<GoCommand>({
      name: "go",
      direction: ctx.words[1],
    });
  }

  for(const [direction, aliases] of Object.entries(directionMap)) {
    for(const a of aliases) {
      if(ctx.words[0] === a) {
        yield AS<GoCommand>({
          name: "go",
          direction: direction,
        });
      }
    }
  }

}



// TODO: Figure out how to handle admin-only commands
export function* resolveTeleportInstruction(ctx: ParsingContext): Iterable<Command> {
  if(ctx.words[0] === "teleport") {
    yield AS<TeleportCommand>({
      name: "teleport",
      locationID: ctx.words[1],
    })
  }
}


export const resolveNavigationInstructions = withParsingContext(
  Chain([
    resolveGoInstruction,
    resolveTeleportInstruction,
  ])
);
