import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import { useAccount } from 'contexts/account';
import { useDialog } from '@libs/use-dialog';
import { useBuyUstDialog } from '../useBuyUstDialog';
import { OnBoardingTx, fetchOnBoardingTxs, useFetchIndexHelper } from '@anchor-protocol/app-provider/queries/on-boarding/fetchOnBoardingTxs';
import { ActOnOnboardingDialog } from './ActOnOnboardingDialog';
import toast from 'react-hot-toast';
import { LoadingDialogResult, useLoadingDialog } from './LoadingDialog';


// We fetch every 10 seconds
const FETCH_TX_TIMEOUT = 10000;

export function useCreditCardDepositDialog(): [
  () => Promise<void>,
  ReactNode,
] {

  const [openKadoDialog, kadoDialog] = useBuyUstDialog();
  const [openActOnTransactionDialog, actOnTransactionDialog] = useDialog(ActOnOnboardingDialog);
  const [openLoadDialog, loadDialog] = useLoadingDialog();

  // window.addEventListener(
  //   "message",
  //   (event) => {
  //     console.log(event);
  //     if (event.origin !== "http://example.org:8080") return;

  //     // …
  //   },
  //   false,
  // );

  const { terraWalletAddress } = useAccount();
  const { totalTxs, currentCount, indexPromise } = useFetchIndexHelper(terraWalletAddress);
  console.log(totalTxs, currentCount)
  const outsideVariableRef = useRef(currentCount);

  const creditCardDepositFlow = async () => {

    if (!terraWalletAddress || !indexPromise) {
      return
    }
    // We start by Scanning kado related transactions 

    await openLoadDialog({
      title: "Loading Wallet",
      text: () => `Please wait for your wallet to be indexed for onboarding transactions`,
      promise: indexPromise,
    });
    const txs = await openLoadDialog({
      title: "Loading Wallet",
      text: "Please wait for your wallet to be indexed for onboarding transactions (fetching transactions)",
      promise: fetchOnBoardingTxs(terraWalletAddress).catch(() => [])
    }) as LoadingDialogResult<OnBoardingTx[]> ?? [];

    const filteredTxs = txs.filter((tx) => !!tx.kado_amount);
    // If there are some new transactions that the user didn't act upon, we open the dialog for the user to choose what to deposit
    if (filteredTxs.length != 0) {
      const actOnTransaction = await openActOnTransactionDialog({
        txs: filteredTxs,
        beforeDeposit: true
      });
      console.log(actOnTransaction)
      if (actOnTransaction) {
        return
      }
    }

    const currentTxs = await openLoadDialog({
      title: "Loading Wallet",
      text: "Please wait until your wallet has been indexed for onboarding transactions",
      promise: fetchOnBoardingTxs(terraWalletAddress).catch(() => [])
    }) as LoadingDialogResult<OnBoardingTx[]> ?? [];

    // Else, or if the user returns, we try to onboard via kado
    const kadoPromise = openKadoDialog({ address: terraWalletAddress });
    // Parallel to the Kado Deposit Dialog, we scan regularly for Kado related transactions 
    let currentTxFetchTimeout: undefined | NodeJS.Timeout = undefined;
    const newTxsPromise: Promise<OnBoardingTx[]> = new Promise((resolve) => {

      const fetchFunction = async (resolve: (_: OnBoardingTx[]) => void) => {
        // We fetch the nex txs
        fetchOnBoardingTxs(terraWalletAddress).then((txs) => {
          // If there is new transactions, we ONLY return the new transactions
          if (txs.length > currentTxs.length) {
            const returnTxs = txs.filter(({ tx_hash }) => !currentTxs.some((tx) => {
              tx.tx_hash == tx_hash
            }));
            resolve(returnTxs)
            return;
          }
          console.log("Got txs but failed fetching new txs, retrying")
          currentTxFetchTimeout = setTimeout(() => fetchFunction(resolve), FETCH_TX_TIMEOUT);

        }).catch((error) => {
          console.log("Error when fetching new transactions : still retrying", error);
          currentTxFetchTimeout = setTimeout(() => fetchFunction(resolve), FETCH_TX_TIMEOUT);
        })

      }
      fetchFunction(resolve)
    });

    // If nextTxsPromise resolves before kadoPromise, we need to say that to the user
    toast.promise(newTxsPromise, {
      loading: "Cavern is loading your deposits in the background. You can deposit funds freely",
      success: "You successfully onboarded Terra, you can close the Kado dialog",
      error: "Error when communicating with Cavern Protocol. You can initialize the deposit and come back later to finalize."
    }, {
      duration: 6000
    })

    // If kado resolves (user closes the dialog), we open the act on transaction dialog when it resolves
    await kadoPromise.then(() => openActOnTransactionDialog({
      txs: newTxsPromise,
      beforeDeposit: false
    }));

    if (currentTxFetchTimeout) {
      clearTimeout(currentTxFetchTimeout)
    }
  };


  // With this newTxsPromise, we show to the user that a new transaction appeared on their account and that they can deposit.
  // This can be an overlay of Kado ?

  // If the kadoPromise returns, we open the fetching transaction dialog for the user to see what was happening in the background


  return [creditCardDepositFlow, (
    <>
      {kadoDialog}
      {actOnTransactionDialog}
      {loadDialog}
    </>
  )];
}