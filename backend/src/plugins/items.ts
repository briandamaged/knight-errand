
import { Command, CommandContext, CommandHandler } from "../models";
import { CommandResolver } from "./utils";
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


export const resolveGetCommand = CommandResolver("get", function(ctx) {
  if(isGetCommand(ctx.command)) {
    get({
      engine: ctx.engine,
      sender: ctx.sender,
      target: ctx.command.target,
    });
  } else {
    // TODO: Complain about validation error
  }
});




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



export const resolveItemsCommands = DepthFirstResolver<CommandContext<Command>, CommandHandler<Command>>(
  ()=> [
    resolveGetCommand,
  ]
);
