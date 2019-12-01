
import { Prop } from "./Prop";

// Thought: This is potentially a way to protect against race conditions.
//          It allows us to confirm the possibility of completing an operation,
//          and then finalizing our decision afterwards.
export interface InFlight<T> {
  fulfill(): Promise<T>;
  cancel(): Promise<void>;
}


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
