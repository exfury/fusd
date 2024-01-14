import { useDialog } from '@libs/use-dialog';
import React, {
    ReactNode, useMemo,
} from 'react';
import { Wallet, utils } from 'ethers';
import { deleteMnemonic } from 'wallets/logic/storage';
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

