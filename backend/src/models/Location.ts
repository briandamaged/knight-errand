
import { PropContainer, PropID, Prop } from "./Prop";
import { Producer } from "./Behaviors";

export type LocationID = string;

export interface Location extends PropContainer, Producer {
  id: LocationID;
  name: string;

  getDescription(): string;

  getProps(): Promise<Prop[]>;

  exits: {
    [key: string]: LocationID | undefined,
  };
}
