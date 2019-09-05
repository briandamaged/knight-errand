
type Agent = object; // TODO
type Entity = object; // TODO

export interface Location {
  id: string;
  description: string;

  // Is it really necessary to distinguish betw/ Agents and Entities?
  occupants: Agent[];
  entities: Entity[];

  plugins: Plugin[];
}


export interface Plugin {
  name: string;
  [key: string]: any;
}


const TownSquare: Location = {
  id: "TownSquare",
  description: "It's really more of an oval than a square.",

  occupants: [],
  entities: [],

  plugins: [],
}
