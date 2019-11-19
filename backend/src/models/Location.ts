
import { PropContainer, PropID, Prop } from "./Prop";

export type LocationID = string;

export interface Location extends PropContainer {
  id: LocationID;
  name: string;

  getDescription(): string;

  propIDs: PropID[];

  getProps(): Promise<Prop[]>;

  exits: {
    [key: string]: LocationID | undefined,
  };
}
