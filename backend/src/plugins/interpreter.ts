import { Command } from "../models";
import { Validate, WhenNameIs } from "./utils";

const INTERPRET = "interpret";

export interface InterpretCommand extends Command {
  name: INTERPRET,
  content: string,
}

export function isInterpretCommand(thing: any): thing is InterpretCommand {
  return (
    thing.name === INTERPRET &&
    typeof(thing.content) === "string"
  );
}


export const handleInterpretCommand = Validate(isInterpretCommand)(function(ctx) {
  const newCommand = ctx.engine.parseInstruction(ctx.command.content);
  if(newCommand) {
    ctx.engine.handleCommand({
      sender: ctx.sender,
      command: newCommand,
    });
  } else {
    ctx.sender.inform("I didn't understand that instruction");
  }
});

export const resolveInterpretCommand = WhenNameIs(INTERPRET, handleInterpretCommand);
