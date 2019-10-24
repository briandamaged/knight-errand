
export interface Command {
  name: string,
}

export interface RawCommand extends Command {
  name: "raw",
  content: string,
}

export interface Character {
  currentLocation: LocationID,
}


type LocationID = string;

export interface Location {
  id: LocationID,
  getDescription(): string,
}
