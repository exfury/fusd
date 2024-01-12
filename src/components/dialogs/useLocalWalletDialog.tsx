import { useDialog } from '@libs/use-dialog';
import React, {
  ReactNode, useMemo,
} from 'react';
import { AccountCreationTitle, MnemonicDialog } from 'wallets/local-wallet-dialog/mnemonic';
import { PasswordForm } from 'wallets/local-wallet-dialog/passwordForm';
import { Wallet, utils } from 'ethers';
import { FormParams as MnemonicFormParams } from "wallets/local-wallet-dialog/mnemonic"
import { ConditionsForm } from 'wallets/local-wallet-dialog/conditionsForm';
import { VerifyConditionsDialog } from 'wallets/local-wallet-dialog/verify-conditions';
import { VerifyMnemonicDialog } from 'wallets/local-wallet-dialog/verify-mnemonic';
import { FinalLocalWalletCreationDialog } from 'wallets/local-wallet-dialog/final-dialog';
import { deleteMnemonic, getMnemonic, hasMnemonic } from 'wallets/logic/storage';
import { LocalWalletConnectionDialog } from 'wallets/local-wallet-dialog/connection';

export type LocalWalletResult = {
  create: {
    password: string,
    mnemonic: string[]
  };
  connect?: never
} | {
  connect?: {
    mnemonic: string[]
  },
  create?: never
};


export function useLocalWalletDialog(): [
  () => Promise<LocalWalletResult>,
  ReactNode,
] {

  const words = useMemo(() => {

    const wallet = Wallet.fromMnemonic(
      utils.entropyToMnemonic(utils.randomBytes(32))
    )

    const mnemonic = wallet.mnemonic.phrase;
    return mnemonic.split(' ')
  }, []) // must be memoized and stay the same across renders

  const [openMnemonicDialog, mnemonicDialog] = useDialog<MnemonicFormParams<null, string>, string | null>(MnemonicDialog);
  const [openVerifyMnemonicDialog, verifyMnemonicDialog] = useDialog(VerifyMnemonicDialog);
  const [openVerifyConditionsDialog, verifyConditionsDialog] = useDialog(VerifyConditionsDialog);
  const [openFinalDialog, finalDialog] = useDialog(FinalLocalWalletCreationDialog);
  const [openConnectionDialog, connectionDialog] = useDialog(LocalWalletConnectionDialog);


  const openLocalWallet = async () => {


    // If a mnemonic already exists, we ask for the password and return it
    if (hasMnemonic()) {

      const connection = await openConnectionDialog();
      if (!connection) {
        throw "Cancelled login"
      }
      if (connection.password) {
        const mnemonic = getMnemonic(connection.password);
        if (!mnemonic) {
          throw "Wrong password"
        }
        return {
          connect: {
            mnemonic
          }
        }
      } else if (connection.removeMnemonic) {
        // We delete the mnemonic and return
        deleteMnemonic()
        throw "Local Account deleted"
      }
    }

    // If not, we create a wallet
    const password = await openMnemonicDialog({
      words,
      formDialog: PasswordForm,
      formDialogProps: null,
      title: <AccountCreationTitle progress={0} />
    });

    if (!password) {
      throw "Cancelled wallet creation"
    }

    const conditions = await openMnemonicDialog({
      words,
      formDialog: ConditionsForm,
      formDialogProps: null,
      title: <AccountCreationTitle progress={25} />
    });

    if (!conditions) {
      throw "Mnemonic Conditions not accepted"
    }

    const verifiedMnemonics = await openVerifyMnemonicDialog({ words });

    if (!verifiedMnemonics) {
      throw "Mnemonic not correcly verified"
    }

    const verifiedConditions = await openVerifyConditionsDialog();

    if (!verifiedConditions) {
      throw "Conditions not correcly verified"
    }

    // We save everything inside the browser

    openFinalDialog();

    return {
      create: {
        password,
        mnemonic: words
      }
    }
  };



  return [openLocalWallet, (
    <>
      {mnemonicDialog}
      {verifyMnemonicDialog}
      {verifyConditionsDialog}
      {finalDialog}
      {connectionDialog}
    </>

  )]
}

// First we display the mnemonic with the password
// Then we display the mnemonic with the conditions
// Then we make the user set the mnoemonic again
// Finally we display the last conditions
// And a final screen saying the wallet is created and connected alright !

