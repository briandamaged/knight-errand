
import { EventEmitter } from "events";
import GameEngine from "../GameEngine";
import { Location, LocationID } from "./Location";

import {
  Prop, PropID, PropContainer
} from './Prop';

import { Character } from "./Character";

export interface CommandContext<CMD extends Command = Command> {
  sender: Character;
  engine: GameEngine;
  command: CMD;
}

export interface Command {
  name: string,
}

export interface CommandHandler<CMD extends Command> {
  (ctx: CommandContext<CMD>): void
}

export type Direction = string;
