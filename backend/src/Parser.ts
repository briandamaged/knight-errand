import {
  Dispatcher, IF, RETURN, Resolver,
} from "conditional-love";

import { Command } from "./models";


export interface ParsingContext {
  raw: string,
  normalized: string,
  words: string[],
}


export function createParsingContext(instruction: string): ParsingContext {
  const normalized = instruction.toLowerCase();
  return {
    raw: instruction,
    normalized: normalized,
    words: normalized.split(/\s+/),
  };
}


// Decorator that converts an Instruction into a ParsingContext
export const withParsingContext = (
  (next: Resolver<[ParsingContext], Command>)=>
    function* addParsingContext(this: any, instruction: string) {
      const ctx = createParsingContext(instruction);
      yield* next.call(this, ctx);
    }
);



export function isEnabledWord(word: string) {
  return (["on", "true", "1"].includes(word));
}

export function isDisabledWord(word: string) {
  return (["off", "false", "0"].includes(word));
}





export function createParser() {
  function parseInstruction(instruction: string): Command | undefined {
    const normalized = instruction.toLowerCase();
    const ctx: ParsingContext = {
      raw: instruction,
      normalized: normalized,
      words: normalized.split(/\s+/),
    };
  
    return _parseInstruction(ctx);
  }
  
  const _parseInstruction = Dispatcher<[ParsingContext], Command | undefined>();
  
  for(const alias of ["look", "l"]) {
    _parseInstruction.use(IF(
      (ctx)=> ctx.words[0] === alias,
      (ctx)=> ({
        name: "look",
      }),
    ));
  }


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


  _parseInstruction.use(IF(
    (ctx)=> ctx.words[0] === "autolook",
    (ctx)=> {
      if(["on", "true", "1"].includes(ctx.words[1])) {
        return {
          name: "autolook",
          state: true,
        };
      } else if(["off", "false", "0"].includes(ctx.words[1])) {
        return {
          name: "autolook",
          state: false,
        };
      } else {
        return {
          name: "autolook",
        }
      }
    }
  ));


  for(const alias of ["help", "?"]) {
    _parseInstruction.use(IF(
      (ctx)=> ctx.words[0] === alias,
      (ctx)=> ({
        name: "help",
      }),
    ));
  }

  _parseInstruction.use(IF(
    (ctx)=> ctx.words[0] === "get",
    (ctx)=> ({
      name: "get",
      target: ctx.words[1],
    }),
  ));

  _parseInstruction.use(IF(
    (ctx)=> ctx.words[0] === "drop",
    (ctx)=> ({
      name: "drop",
      target: ctx.words[1],
    }),
  ));

  for(const alias of ["items", "inventory"]) {
    _parseInstruction.use(IF(
      (ctx)=> ctx.words[0] === alias,
      (ctx)=> ({
        name: "items",
      }),
    ));
  }

  _parseInstruction.use(IF(
    (ctx)=> ctx.words[0] === "reset!",
    (ctx)=> ({
      name: "reset",
    })
  ));
  
  _parseInstruction.otherwise(RETURN(undefined));

  return parseInstruction;
}



