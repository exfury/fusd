import React from 'react';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { TerraApp } from 'apps/TerraApp';
import { DeploymentTargetProvider } from '@anchor-protocol/app-provider/contexts/target';
import CssBaseline from '@mui/material/CssBaseline';
import AddressViewerWallet, { EventTypes } from 'wallets/viewer';
import { useReadonlyWalletDialog } from 'components/dialogs/useReadonlyWalletDialog';
import { CLASSIC, MAINNET, TESTNET } from '@anchor-protocol/app-provider';
import { ThemeProvider } from 'contexts/theme';
import { lightTheme, darkTheme } from 'themes/terra';
import LocalWallet from 'wallets/local';
import { useLocalWalletDialog } from 'components/dialogs/useLocalWalletDialog';

export function App({ viewer_wallet, local_wallet }: { viewer_wallet: AddressViewerWallet, local_wallet: LocalWallet }): React.JSX.Element {

  // We register the viewer_wallet_dialog
  const [openReadonlyDialog, readonlyDialog] = useReadonlyWalletDialog();

  viewer_wallet.addListener(EventTypes.Connect, () => {
    openReadonlyDialog({
      networks: [MAINNET, TESTNET, CLASSIC]
    }).then((result) => {
      if (result) {
        viewer_wallet.close(result.address)
      } else {
        viewer_wallet.close(undefined)
      }
    })
  })

  // We register the local_wallet
  const [openLocalWalletDialog, localWalletDialog] = useLocalWalletDialog();
  console.log("test")

  local_wallet.addListener(EventTypes.Connect, () => {
    openLocalWalletDialog().then((result) => {
      if (result.connect) {
        local_wallet.closeConnectAccount(result.connect.mnemonic)
      } else if (result.create) {
        local_wallet.closeCreateAccount(result.create?.password, result.create?.mnemonic)
      } else {
        throw "Couldn't connect local wallet"
      }
    })
  })

  return (
    <DeploymentTargetProvider>
      <ThemeProvider
        initialTheme="dark"
        lightTheme={lightTheme}
        darkTheme={darkTheme}
      >
        <CssBaseline />
        <DeploymentSwitch
          terra={<TerraApp />}
        />
        {readonlyDialog}
        {localWalletDialog}
      </ThemeProvider>
    </DeploymentTargetProvider>
  );
}
