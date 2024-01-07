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
import { useAccount } from 'contexts/account';
import { LocalWalletManageDialog } from 'wallets/local-wallet-dialog/manage';
import { useWallet } from '@terra-money/wallet-kit';


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


export function useManageWalletDialog(): [
    () => Promise<LocalWalletResult>,
    ReactNode,
] {

    const { disconnect } = useWallet();

    const words = useMemo(() => {

        const wallet = Wallet.fromMnemonic(
            utils.entropyToMnemonic(utils.randomBytes(32))
        )

        const mnemonic = wallet.mnemonic.phrase;
        return mnemonic.split(' ')
    }, []) // must be memoized and stay the same across renders
        ;
    const [openManagerDialog, manageDialog] = useDialog(LocalWalletManageDialog);


    const openLocalWallet = async () => {
        const manage = await openManagerDialog();
        if (!manage) {
            throw "Cancelled login"
        }
        if (manage.removeMnemonic) {
            // We delete the mnemonic and return
            deleteMnemonic()
            disconnect();
            throw "Local Account deleted"
        } else {
            throw "Unreachable"
        }
    }


    return [openLocalWallet, manageDialog]
}

// First we display the mnemonic with the password
// Then we display the mnemonic with the conditions
// Then we make the user set the mnoemonic again
// Finally we display the last conditions
// And a final screen saying the wallet is created and connected alright !

