import { useAnchorWebapp, useNetwork } from '@anchor-protocol/app-provider';
import { Gas, Luna, u } from '@libs/types';
import { Msg } from '@terra-money/feather.js';
import { useCallback, useMemo, useState } from 'react';
import { useApp } from '../contexts/app';
import debounce from 'lodash.debounce';
import { simulateFetch } from '@libs/query-client';
import React from "react";
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { useAccount } from 'contexts/account';

const errorMap = {
  "Not enough ibc/": "Too much axlUSDC was borrowed, you can't withdraw your funds for now",
  "max borrow factor; borrow demand too high": "You can't borrow more funds, there is no axlUSDC available",
  "Borrow amount too high; Loan liability becomes greater than borrow limit": "You can't borrow more than your borrow limit",
  "Withdraw amount cannot exceed the user's spendable amount": "You can't withdraw locked funds. Borrow less to unlock them.",
  "Unlock amount too high; Loan liability becomes greater than borrow limit:": "You can't withdraw locked funds. Borrow less to unlock them.",
  "Overflow: Cannot Wub with": "Amount is too high",
}

function mapEstimateFeeError(error: Error): string {
  const stringError = error.toString()
  for (const [key, value] of Object.entries(errorMap)) {
    if (stringError.includes(key)) {
      return value
    }
  }
  return stringError
}

export interface EstimatedFee {
  gasWanted: Gas;
  txFee: u<Luna>;
}

export interface EstimatedHumanFee {
  gasWanted: Gas;
  txFee: u<Luna>;
}

export function defaultFee(): EstimatedFee {
  return {
    gasWanted: 0 as Gas,
    txFee: '0' as u<Luna>,
  };
}

export function useEstimateFee(): (msgs: Msg[]) => Promise<EstimatedFee | undefined> {
  const { lcdClient } = useNetwork();
  const { gasPrice, constants } = useApp();
  const { queryClient } = useAnchorWebapp();
  const { pubkey, terraWalletAddress } = useAccount();

  return useCallback(
    async (msgs: Msg[]) => {
      if (!terraWalletAddress || !queryClient) {
        return undefined;
      }

      // We first try simulating the fee with the global method
      const gasWanted = await simulateFetch({
        ...queryClient,
        pubkey,
        msgs,
        address: terraWalletAddress,
        lcdClient,
        gasInfo: {
          gasAdjustment: constants.gasAdjustment,
          gasPrice: gasPrice,
        }
      })
      if (!gasWanted) {
        throw "Gas Wanted is zero, tx Fee compute error"
      }

      return {
        gasWanted: gasWanted as Gas,
        txFee: Math.ceil(gasWanted * parseFloat(gasPrice.uluna)).toString() as u<Luna>
      };

    },
    [terraWalletAddress, queryClient, pubkey, lcdClient, constants.gasAdjustment, gasPrice],
  );
}

export function useFeeEstimation(): [
  EstimatedFee | undefined,
  string | JSX.Element | undefined,
  (msgs: Msg[] | null) => void,
  boolean
] {
  const estimateFee = useEstimateFee();
  const [estimatedFeeError, setEstimatedFeeError] = useState<
    string | JSX.Element | undefined
  >();

  const [estimatedFee, setEstimatedFee] = useState<EstimatedFee | undefined>();
  const [isEstimatingFee, setIsEstimatingFee] = useState(false);

  return [
    estimatedFee,
    estimatedFeeError,
    useMemo(() => {
      return debounce((msgs: Msg[] | null) => {
        setEstimatedFeeError(undefined);
        setEstimatedFee(undefined);
        if (!msgs) {
          setIsEstimatingFee(false);
          return;
        }
        setIsEstimatingFee(true);

        estimateFee(msgs)
          .then((estimated) => {
            setEstimatedFeeError(undefined);
            setEstimatedFee(estimated);
            setIsEstimatingFee(false);
          })
          .catch((error) => {

            const mappedError = mapEstimateFeeError(error);
            setEstimatedFeeError(() => (<div style={{ display: "flex", alignItems: "center" }}>
              Error simulating the transaction
              <InfoTooltip style={{ display: "inline", marginLeft: 10 }}>
                {mappedError}
              </InfoTooltip>
            </div>));
            setEstimatedFee(undefined);
            setIsEstimatingFee(false);
          })
      }, 500);
    }, [estimateFee, setEstimatedFeeError, setEstimatedFee]),
    isEstimatingFee
  ];
}
