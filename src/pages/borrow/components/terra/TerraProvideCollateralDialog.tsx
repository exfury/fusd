import React from 'react';
import { useBorrowProvideCollateralTx } from '@anchor-protocol/app-provider';
import { bAsset, Rate, u } from '@anchor-protocol/types';
import { EstimatedFee, useCW20Balance } from '@libs/app-provider';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { ProvideCollateralDialog } from '../ProvideCollateralDialog';
import { ProvideCollateralFormParams } from '../types';
import { normalize } from '@anchor-protocol/formatter';
import { ProvideWrappedCollateralDialog } from '../ProvideWrappedCollateralDialog';
import { useBorrowProvideWrappedCollateralTx } from '@anchor-protocol/app-provider/tx/borrow/provideWrappedCollateral';
import { useLSDBalance } from 'pages/swap/queries/balanceQuery';

export const TerraProvideCollateralDialog = (
  props: DialogProps<ProvideCollateralFormParams>,
) => {
  const { collateral } = props;

  const { connected, terraWalletAddress } = useAccount();


  // In the normal collateral case
  // This is a const, so no problem
  if (!("info" in collateral)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cw20Balance = useCW20Balance<bAsset>(
      collateral.collateral_token,
      terraWalletAddress,
    );
    const uTokenBalance = normalize(cw20Balance, 6, collateral.decimals);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [postTx, txResult] = useBorrowProvideCollateralTx(collateral);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const proceed = useCallback(
      (depositAmount: bAsset, txFee: EstimatedFee) => {
        if (connected && postTx) {
          postTx({
            depositAmount,
            txFee
          });
        }
      },
      [connected, postTx],
    );

    return (<ProvideCollateralDialog
      {...props}
      txResult={txResult}
      uTokenBalance={uTokenBalance}
      collateral={collateral}
      proceedable={postTx !== undefined}
      onProceed={proceed}
    />)

  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const balance = useLSDBalance(
      collateral.info,
    ) as u<bAsset>;
    const uTokenBalance = normalize(balance, 6, collateral.decimals);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [postTx, txResult] = useBorrowProvideWrappedCollateralTx(collateral);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const proceed = useCallback(
      (depositAmount: bAsset, txFee: EstimatedFee, lunaAmount: u<bAsset>, exchangeRate: Rate) => {
        if (connected && postTx) {
          postTx({
            depositAmount,
            txFee,
            lunaAmount,
            exchangeRate
          });
        }
      },
      [connected, postTx],
    );

    return (
      <ProvideWrappedCollateralDialog
        {...props}
        txResult={txResult}
        uTokenBalance={uTokenBalance}
        collateral={collateral}
        proceedable={postTx !== undefined}
        onProceed={proceed}
      />)
  }

};
