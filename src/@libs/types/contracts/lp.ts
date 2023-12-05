import { HumanAddr } from "@libs/types";
/* eslint  @typescript-eslint/no-namespace:0 */

export namespace lp {
  export interface Minter {
    minter: Record<string, never>;
  }

  export interface MinterResponse {
    /** terraswap pair address */
    minter: HumanAddr;
  }
}
