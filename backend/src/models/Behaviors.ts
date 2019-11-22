
import { Prop } from "./Prop";

export interface ProduceFunc {
  (): Promise<Prop>;
}

export interface Producer {
  tryProduce(target: string): AsyncIterable<ProduceFunc>;
}

export function isProducer(thing: any): thing is Producer {
  return (
    typeof(thing.tryProduce) === 'function'
  );
}
