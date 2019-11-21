import { Command } from "../models";
import { ParsingContext, withParsingContext } from "../Parser";
import { AS, WhenNameIs, Validate, Chain } from "./utils";
import { Character } from "../models/Character";


export interface OpenCommand extends Command {
  name: "open",
  target: string,
}

export interface CloseCommand extends Command {
  name: "close",
  target: string,
}


function isOpenCommand(thing: any): thing is OpenCommand {
  return (
    thing.name === "open" &&
    typeof(thing.target) !== 'undefined'
  );
}

function isCloseCommand(thing: any): thing is CloseCommand {
  return (
    thing.name === "close" &&
    typeof(thing.target) !== 'undefined'
  )
}


const handleOpenCommand = Validate(isOpenCommand)(function(ctx) {
  open({
    sender: ctx.sender,
    target: ctx.command.target,
  });
});

const handleCloseCommand = Validate(isCloseCommand)(function(ctx) {
  close({
    sender: ctx.sender,
    target: ctx.command.target,
  });
});


export const resolveOpenCommand = WhenNameIs("open", handleOpenCommand);
export const resolveCloseCommand = WhenNameIs("close", handleCloseCommand);

export const resolveDoorCommands = Chain([
  resolveOpenCommand,
  resolveCloseCommand,
]);


async function open({sender, target}: {sender: Character, target: string}) {
  sender.inform("OPEN");
}

async function close({sender, target}: {sender: Character, target: string}) {
  sender.inform("CLOSE");
}


export function* _resolveDoorInstructions(ctx: ParsingContext) {
  if(ctx.words[0] === 'open') {
    yield AS<OpenCommand>({
      name: "open",
      target: ctx.words[1],
    });
  }

  if(ctx.words[0] === 'close') {
    yield AS<CloseCommand>({
      name: "close",
      target: ctx.words[1],
    });
  }
}

export const resolveDoorInstructions = withParsingContext(_resolveDoorInstructions);
