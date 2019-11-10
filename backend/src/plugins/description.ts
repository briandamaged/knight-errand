
import { Command, Character, CommandContext, CommandHandler } from "../models";
import GameEngine from "../GameEngine";
import { Validate, WhenNameIs, Chain } from "./utils";
import { DepthFirstResolver } from "conditional-love";

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



export function look({engine, sender}: {engine: GameEngine, sender: Character}) {
  const location = engine.getLocation(sender.currentLocationID);
  if(location) {
    const items = engine.getProps(location.propIDs);

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
