
import { Command, Character, CommandContext, CommandHandler } from "../models";
import GameEngine from "../GameEngine";
import { Validate, WhenNameIs, Chain } from "./utils";
import { DepthFirstResolver } from "conditional-love";

export interface LookCommand extends Command {
  name: "look",
}

function isLookCommand(thing: any): thing is LookCommand {
  return (thing.name === "look");
}


const handleLookCommand = Validate(isLookCommand)(function(ctx) {
  look({
    engine: ctx.engine,
    sender: ctx.sender,
  })
});


export const resolveLookCommand = WhenNameIs("look", handleLookCommand);



export const resolveDescriptionCommands = Chain([
  resolveLookCommand,
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
