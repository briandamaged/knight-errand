
import { PropContainer, PropID, Prop } from "./Prop";

export type LocationID = string;

export interface Location extends PropContainer {
  id: LocationID;
  name: string;

  getDescription(): string;

  getProps(): Promise<Prop[]>;

  canProduce(target: string): Promise<boolean>;
  produce(target: string): Promise<Prop>;

  exits: {
    [key: string]: LocationID | undefined,
  };
}
