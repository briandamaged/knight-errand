
import { Command, CommandContext, CommandHandler } from "../models";
import { WhenNameIs, Validate, Chain, AS } from "./utils";
import GameEngine from "../GameEngine";
import { ParsingContext, withParsingContext } from "../Parser";
import { Character } from "../models/Character";

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

export function isItemsCommand(thing: any): thing is ItemsCommand {
  return thing.name === "items";
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

export const handleItemsCommand = Validate(isItemsCommand)(function(ctx) {
  items({
    engine: ctx.engine,
    sender: ctx.sender,
  });
});

export const resolveGetCommand = WhenNameIs("get", handleGetCommand);
export const resolveDropCommand = WhenNameIs("drop", handleDropCommand);
export const resolveItemsCommand = WhenNameIs("items", handleItemsCommand);


export const resolveInventoryCommands = Chain([
  resolveGetCommand,
  resolveDropCommand,
  resolveItemsCommand,
]);


export async function get({engine, sender, target}: {engine: GameEngine, sender: Character, target?: string}) {
  const location = await sender.getCurrentLocation();

  if(location) {
    const props = await engine.getProps(location.propIDs);

    const p = props.find((pp)=> pp.name === target);
    if(p) {
      // Remove the item from the location
      location.propIDs = location.propIDs.filter((id)=> id !== p.id);

      // Place the item into the the sender's inventory
      sender.propIDs.push(p.id);

      sender.inform(`You pick up the ${p.name}`);
    }
  }
}



export async function drop({engine, sender, target}: {engine: GameEngine, sender: Character, target?: string}) {
  const items = await engine.getProps(sender.propIDs);

  const item = items.find((it)=> it.name === target);
  if(item) {
    const location = await sender.getCurrentLocation();

    if(location) {
      sender.propIDs = sender.propIDs.filter((id)=> id !== item.id);
      location.propIDs.push(item.id);
      sender.inform(`You drop the ${item.name}`);
    } else {
      sender.inform(`Hmm... better not.  You seem to be floating in the void`);
    }
  } else {
    sender.inform(`You are not carrying the ${target}`);
  }

}


export async function items({engine, sender}: {engine: GameEngine, sender: Character}) {
  const items = await engine.getProps(sender.propIDs);
  if(items.length === 0) {
    sender.inform("You are not carrying anything");
  } else {
    const entries = items.map((item)=> ` - ${item.name}`);
    const msg = ["You are carrying:", ...entries].join("\n");
    sender.inform(msg);
  }
}



function* _resolveInventoryInstructions(ctx: ParsingContext) {
  if(ctx.words[0] === "get") {
    yield AS<GetCommand>({
      name: "get",
      target: ctx.words[1],
    });
  }

  if(ctx.words[0] === "drop") {
    yield AS<DropCommand>({
      name: "drop",
      target: ctx.words[1],
    });
  }

  for(const alias of ["items", "inventory"]) {
    if(ctx.words[0] === alias) {
      yield AS<ItemsCommand>({
        name: "items",
      });
    }
  }
}


export const resolveInventoryInstructions = withParsingContext(function* (ctx: ParsingContext) {
  if(ctx.words[0] === "get") {
    yield AS<GetCommand>({
      name: "get",
      target: ctx.words[1],
    });
  }

  if(ctx.words[0] === "drop") {
    yield AS<DropCommand>({
      name: "drop",
      target: ctx.words[1],
    });
  }

  for(const alias of ["items", "inventory"]) {
    if(ctx.words[0] === alias) {
      yield AS<ItemsCommand>({
        name: "items",
      });
    }
  }
});
