
export interface Command {
  name: string,
}

export interface RawCommand extends Command {
  name: "raw",
  content: string,
}

export type Direction = string;

export interface GoCommand extends Command {
  name: "go",
  direction: Direction,
}

export interface Character {
  currentLocationID: LocationID,
}


type LocationID = string;

export interface Location {
  id: LocationID,
  getDescription(): string,

  exits: {
    [key: string]: LocationID | undefined,
  },
}
