import { CW20Addr, HumanAddr, u, UST } from "@libs/types";

/* eslint  @typescript-eslint/no-namespace:0 */
export namespace basset {
  export namespace converter {
    export interface Config {
      config: Record<string, never>;
    }

    export interface ConfigResponse {
      owner: HumanAddr;
      anchor_token_address: CW20Addr | null;
      wormhole_token_address: CW20Addr | null;
    }

    // ---------------------------------------------
    // CW20 hooks
    // ---------------------------------------------
    export interface ConvertWormholeToAnchor {
      convert_wormhole_to_anchor: Record<string, never>;
    }

    export interface ConvertAnchorToWormhole {
      convert_anchor_to_wormhole: Record<string, never>;
    }
  }

  export namespace reward {
    export interface AccruedRewards {
      accrued_rewards: {
        address: HumanAddr;
      };
    }

    export interface AccruedRewardsResponse {
      rewards: u<UST>;
    }
  }
}
