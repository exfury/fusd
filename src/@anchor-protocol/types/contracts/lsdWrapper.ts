import { Rate } from "@libs/types";

/* eslint  @typescript-eslint/no-namespace:0 */
export namespace lsdWrapper {
  export namespace underlyingHub {
    export type State = {
      state: Record<string, never>
    }
    export interface StateResponse {
      exchange_rate: Rate;
    }
  }
}
