import React from 'react';
import { useBorrowRedeemCollateralTx } from '@anchor-protocol/app-provider';
import { bAsset, Rate, u } from '@anchor-protocol/types';
import { EstimatedFee, useCW20Balance } from '@libs/app-provider';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { RedeemCollateralDialog } from '../RedeemCollateralDialog';
import { RedeemCollateralFormParams } from '../types';
import { normalize } from '@anchor-protocol/formatter';
import { RedeemWrappedCollateralDialog } from '../RedeemWrappedCollateralDialog';
import { useBorrowRedeemWrappedCollateralTx } from '@anchor-protocol/app-provider/tx/borrow/redeemWrappedCollateral';

export const TerraRedeemCollateralDialog = (
  props: DialogProps<RedeemCollateralFormParams>,
) => {
  const { collateral } = props;

  const { connected, terraWalletAddress } = useAccount();

  const cw20Balance = useCW20Balance<bAsset>(
    collateral.collateral_token,
    terraWalletAddress,
  );

  const uTokenBalance = normalize(cw20Balance, 6, collateral.decimals);

  /// We can add no warnings here, because collateral is a constant
  if (!("info" in collateral)) {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [postTx, txResult] = useBorrowRedeemCollateralTx(collateral);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const proceed = useCallback(
      (redeemAmount: bAsset, txFee: EstimatedFee) => {
        if (connected && postTx) {
          postTx({ redeemAmount, txFee });
        }
      },
      [connected, postTx],
    );

    return (
      <RedeemCollateralDialog
        {...props}
        txResult={txResult}
        collateral={collateral}
        uTokenBalance={uTokenBalance}
        proceedable={postTx !== undefined}
        onProceed={proceed}
      />)

  } else {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [postTx, txResult] = useBorrowRedeemWrappedCollateralTx(collateral);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const proceed = useCallback(
      (redeemWrappedAmount: u<bAsset>, txFee: EstimatedFee, exchangeRate: Rate) => {
        if (connected && postTx) {
          postTx({ redeemWrappedAmount, exchangeRate, txFee });
        }
      },
      [connected, postTx],
    );
    return (<RedeemWrappedCollateralDialog
      {...props}
      txResult={txResult}
      collateral={collateral}
      uTokenBalance={uTokenBalance}
      proceedable={postTx !== undefined}
      onProceed={proceed}
    />);
  }
};
