import {
  Resolver,
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

