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
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { Close } from '@mui/icons-material';
import { Button } from '@mui/material';
import styled from 'styled-components';

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

  local_wallet.addListener(EventTypes.Connect, async () => {
    await openLocalWalletDialog().then((result) => {
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



      <Toaster>
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <ToastCloseButton onClick={() => toast.dismiss(t.id)}><Close /></ToastCloseButton>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>;
    </DeploymentTargetProvider>
  );
}

const ToastCloseButton = styled(`button`)`
  border: none;
  background: none;
  &:hover{
    color: rgb(130,130,130);
  }
  cursor:pointer;
`
