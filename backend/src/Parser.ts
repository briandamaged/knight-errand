import {
  Dispatcher, IF, RETURN,
} from "conditional-love";

import { Command } from "./models";


export function createParser() {
  function parseInstruction(instruction: string): Command | undefined {
    const ctx = {
      raw: instruction,
      words: instruction.split(/\s+/),
    };
  
    return _parseInstruction(ctx);
  }
  
  interface ParsingContext {
    raw: string,
    words: string[],
  }
  
  const _parseInstruction = Dispatcher<[ParsingContext], Command | undefined>();
  
  _parseInstruction.use(IF(
    (ctx)=> ctx.words[0] === "look",
    (ctx)=> ({
      name: "look",
    }),
  ));
  
  _parseInstruction.use(IF(
    (ctx)=> ctx.words[0] === "go",
    (ctx)=> ({
      name: "go",
      direction: ctx.words[1],
    }),
  ));
  
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

  for(const [direction, aliases] of Object.entries(directionMap)) {
    for(const alias of aliases) {
      _parseInstruction.use(IF(
        (ctx)=> ctx.words[0] === alias,
        (ctx)=> ({
          name: "go",
          direction: direction,
        })
      ));
    }

  }


  
  _parseInstruction.otherwise(RETURN(undefined));

  return parseInstruction;
}



