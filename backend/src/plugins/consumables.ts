import {
  Command, Character, Prop, Location, CommandContext, PropContainer,
} from "../models";

import GameEngine from "../GameEngine";
import { Validate, WhenNameIs, AS, Chain } from "./utils";
import { ParsingContext, withParsingContext } from "../Parser";

// TODO: We'll prolly want to extract this
type Target = string;


export interface Edible {
  canBeEatenBy({eater}: {eater: Character}): boolean,
  beEatenBy({eater}: {eater: Character}): void,
}

function isEdible(thing: any): thing is Edible {
  return (
    typeof(thing.canBeEatenBy) === 'function' &&
    typeof(thing.beEatenBy) === 'function'
  );
}


export interface EatCommand extends Command {
  name: "eat",
  target: Target,
}

export interface DrinkCommand extends Command {
  name: "drink",
  target: Target,
}


function isEatCommand(thing: any): thing is EatCommand {
  return (
    thing.name === "eat" &&
    typeof(thing.target) !== 'undefined'
  );
}

function isDrinkCommand(thing: any): thing is DrinkCommand {
  return (
    thing.name === "drink" &&
    typeof(thing.target) !== 'undefined'
  );
}



// TODO: Extract this
function* chain<OUTPUT>(iterables: Iterable<Iterable<OUTPUT>>): Iterable<OUTPUT> {
  for(const iter of iterables) {
    yield* iter;
  }
}

// TODO: Extract this
function* resolvePropSources({engine, sender}: {engine: GameEngine, sender: Character}): Iterable<PropContainer> {
  yield sender;

  const location = engine.getLocation(sender.currentLocationID);
  if(location) {
    yield location;
  }
}


interface ContainedProp {
  container: PropContainer;
  prop: Prop;
}

// TODO: Extract this
function* resolveProps({engine, sender, target}: {engine: GameEngine, sender: Character, target: Target}): Iterable<ContainedProp> {
  const sources = resolvePropSources({engine, sender});

  for(const s of sources) {
    const props = engine.getProps(s.propIDs);

    for(const p of props) {
      if(p.name === target) {
        yield {
          container: s,
          prop: p,
        };
      }
    }
  }

}


export const handleEatCommand = Validate(isEatCommand)(function(ctx: CommandContext<EatCommand>) {
  eat({
    engine: ctx.engine,
    sender: ctx.sender,
    target: ctx.command.target,
  });
});

export const handleDrinkCommand = Validate(isDrinkCommand)(function(ctx: CommandContext<DrinkCommand>) {
  drink({
    engine: ctx.engine,
    sender: ctx.sender,
    target: ctx.command.target,
  });
});



export const resolveEatCommand = WhenNameIs("eat", handleEatCommand);
export const resolveDrinkCommand = WhenNameIs("drink", handleDrinkCommand);


export const resolveConsumableCommands = Chain([
  resolveEatCommand,
  resolveDrinkCommand,
]);


export async function eat({engine, sender, target}: {engine: GameEngine, sender: Character, target: Target}) {
  const props = resolveProps({engine, sender, target});

  for(const {container, prop} of props) {
    if(isEdible(prop)) {
      if(prop.canBeEatenBy({eater: sender})) {
        sender.inform(`You eat the ${prop.name}`);
        prop.beEatenBy({eater: sender});

        // Remove the Prop from the container
        container.propIDs = container.propIDs.filter((id)=> id !== prop.id);
        delete engine.propMap[prop.id];
      } else {
        sender.inform(`Magic or something prevented you from eating it`);
      }
    } else {
      sender.inform(`The ${prop.name} does not appear to be edible`);
    }

    return;
  }

  sender.inform(`You don't see any ${target}`);
}


export async function drink({engine, sender, target}: {engine: GameEngine, sender: Character, target: Target}) {
  const props = resolveProps({engine, sender, target});

  for(const p of props) {
    return sender.inform(`You drink the ${p.name}`);
  }

  sender.inform(`You don't see any ${target}`);
}


export function* _resolveConsumableInstructions(ctx: ParsingContext) {
  if(ctx.words[0] === "eat") {
    yield AS<EatCommand>({
      name: "eat",
      target: ctx.words[1],
    });
  }

  if(ctx.words[0] === "drink") {
    yield AS<DrinkCommand>({
      name: "drink",
      target: ctx.words[1],
    });
  }
}


export const resolveConsumableInstructions = withParsingContext(_resolveConsumableInstructions);