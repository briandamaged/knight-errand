
import { Command, CommandContext, CommandHandler, Character } from "../models";
import { CommandResolver, Validate } from "./utils";
import GameEngine from "../GameEngine";
import { DepthFirstResolver } from "conditional-love";

export interface GetCommand extends Command {
  name: "get";
  target: string;
}

export interface DropCommand extends Command {
  name: "drop";
  target: string;
}

export interface ItemsCommand extends Command {
  name: "items";
}


export function isGetCommand(thing: any): thing is GetCommand {
  return (
    thing.name === "get" &&
    typeof(thing.target) === 'string'
  );
}

export function isDropCommand(thing: any): thing is DropCommand {
  return (
    thing.name === "drop" &&
    typeof(thing.target) === 'string'
  );
}


export const handleGetCommand = Validate(isGetCommand)(function(ctx) {
  get({
    engine: ctx.engine,
    sender: ctx.sender,
    target: ctx.command.target,
  });
});

export const handleDropCommand = Validate(isDropCommand)(function(ctx) {
  drop({
    engine: ctx.engine,
    sender: ctx.sender,
    target: ctx.command.target,
  });
});

export const resolveGetCommand = CommandResolver("get", handleGetCommand);
export const resolveDropCommand = CommandResolver("drop", handleDropCommand);


export const resolveItemsCommands = DepthFirstResolver<[CommandContext<Command>], CommandHandler<Command>>(
  ()=> [
    resolveGetCommand,
    resolveDropCommand,
  ]
);


export function get({engine, sender, target}: {engine: GameEngine, sender: Character, target?: string}) {
  const location = engine.getLocation(sender.currentLocationID);
  if(location) {
    const props = engine.getProps(location.propIDs);

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



function drop({engine, sender, target}: {engine: GameEngine, sender: Character, target?: string}) {
  const items = engine.getProps(sender.itemIDs);

  const item = items.find((it)=> it.name === target);
  if(item) {
    const location = engine.getLocation(sender.currentLocationID);

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




