
import { Command, CommandContext, CommandHandler } from "../models";
import GameEngine from "../GameEngine";
import { Validate, WhenNameIs, Chain, AS } from "./utils";
import { DepthFirstResolver } from "conditional-love";
import { ParsingContext, withParsingContext, isEnabledWord, isDisabledWord } from "../Parser";
import { Character } from "../models/Character";

export interface LookCommand extends Command {
  name: "look",
}

export interface AutoLookCommand extends Command {
  name: "autolook",
  state?: boolean,
}

function isLookCommand(thing: any): thing is LookCommand {
  return (thing.name === "look");
}

function isAutoLookCommand(thing: any): thing is AutoLookCommand {
  return (
    thing.name === "autolook" &&
    ["boolean", "undefined"].includes(typeof(thing.enabled))
  )
}


const handleLookCommand = Validate(isLookCommand)(function(ctx) {
  look({
    engine: ctx.engine,
    sender: ctx.sender,
  })
});

const handleAutolookCommand = Validate(isAutoLookCommand)(function(ctx) {
  autolook({
    sender: ctx.sender,
    state: ctx.command.state,
  });
});


export const resolveLookCommand = WhenNameIs("look", handleLookCommand);
export const resolveAutoLookCommand = WhenNameIs("autolook", handleAutolookCommand);


export const resolveDescriptionCommands = Chain([
  resolveLookCommand,
  resolveAutoLookCommand,
]);



export async function look({engine, sender}: {engine: GameEngine, sender: Character}) {
  const location = await sender.getCurrentLocation();
  if(location) {
    const items = await engine.getProps(location.propIDs);

    sender.inform(`
${location.name}
-----

${location.getDescription()}

Items:
${items.map((item)=> ` - ${item.name}`).join("\n")}

Available Exits:
${ Object.keys(location.exits).map((x)=> ` - ${x}`).join("\n") }
    `);
  }
}




export function autolook({sender, state}: {sender: Character, state?: boolean}) {
  function getCurrentState() {
    return (
      (sender.autolook)
        ? "enabled"
        : "disabled"
    )
  }

  if(typeof(state) === "boolean") {
    sender.autolook = state;
    sender.inform(`AutoLook has been ${getCurrentState()}`);
  } else {
    sender.inform(`Autolook is currently ${getCurrentState()}`);
  }
}


function* resolveLookInstruction(ctx: ParsingContext): Iterable<Command> {
  for(const alias of ["look", "l", "describe"]) {
    if(ctx.words[0] === alias) {
      yield AS<LookCommand>({
        name: "look",
      });
    }
  }
}



export function getDesiredAutoLookState(word: string) {
  if(isEnabledWord(word)) {
    return true;
  } else if(isDisabledWord(word)) {
    return false;
  }
}


export function* resolveAutoLookInstruction(ctx: ParsingContext): Iterable<Command> {
  if(ctx.words[0] === 'autolook') {
    yield AS<AutoLookCommand>({
      name: "autolook",
      state: getDesiredAutoLookState(ctx.words[1]),
    });
  }
}


export const resolveDescriptionInstructions = withParsingContext(
  Chain([
    resolveLookInstruction,
    resolveAutoLookInstruction,
  ])
)
