import { BidByUser } from "@anchor-protocol/app-fns";
import { LSDContracts } from "@anchor-protocol/app-provider";
import { CW20Addr } from "@libs/types";
import { DeepPartial } from "chart.js/types/utils";
import { RegisteredLSDs } from "env";
import { useAnchorWebapp } from "../../contexts/context";
import { useBidByUserByCollateralQuery } from "./bidByUser";

export type LSDLiquidationBidsResponse = {
  name: RegisteredLSDs | "aLuna";
  info: DeepPartial<LSDContracts>;
  bids: BidByUser | undefined;
}[];

export function useAllBidByUserByCollateralQuery(): LSDLiquidationBidsResponse {
  const { contractAddress } =
    useAnchorWebapp();

  const { data: aLunaLiquidationBids } = useBidByUserByCollateralQuery(
    contractAddress.cw20.aLuna
  );

  const allLiquidationBids = Object.entries(contractAddress.lsds).map(
    ([key, contracts]) => {  
      // ContractAddress array is constant, it's allowed to do that
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data: bids } = useBidByUserByCollateralQuery(
        contracts.token as CW20Addr
      );
      return {
        name: key as RegisteredLSDs,
        bids,
        info: contracts,
      };
    }
  );
  return [
    ...allLiquidationBids,
    {
      name: "aLuna",
      bids: aLunaLiquidationBids,
      info: {
        token: contractAddress.cw20.aLuna,
        info: {
          symbol: "aluna",
        },
      },
    },
  ];
}
