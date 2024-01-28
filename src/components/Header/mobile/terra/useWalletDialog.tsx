import { buttonBaseStyle } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Box, Modal } from '@mui/material';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';
import { useAccount } from 'contexts/account';
import { Content } from '../../wallet/terra/Content';
import { LOCAL_WALLET_ID } from 'wallets/local';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { useChain } from '@cosmos-kit/react';
import { useNetwork } from '@anchor-protocol/app-provider';

interface FormParams {
  className?: string;
  openSend: () => void;
  openBuyUst: () => void;
}

type FormReturn = void;

export function useWalletDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase(props: DialogProps<FormParams, FormReturn>) {
  const { className, closeDialog, openSend, openBuyUst } = props;
  const { disconnect, connect, availableWallets } = useAccount();
  const { connected, terraWalletAddress, connection } = useAccount();
  const { network } = useNetwork();
  const { openView } = useChain(network.chainName);

  const disconnectWallet = useCallback(() => {
    disconnect();
    closeDialog();
  }, [closeDialog, disconnect]);

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {/* When the wallet is connected, you can print the details */}
        {connected && !!connection && connection && (
          <Content
            walletAddress={terraWalletAddress!}
            connection={connection}
            onClose={closeDialog}
            onDisconnectWallet={disconnectWallet}
            onSend={openSend}
            onBuyUST={openBuyUst}
          />
        )}
        {/* When the wallet is not connected, you can print the login/signup opportunities */}
        {!connected && (

          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {
              availableWallets.filter(({ id }) => {
                return LOCAL_WALLET_ID == id
              })
                .map(({ id, icon, name }) => (
                  <FlatButton
                    key={'connection' + id}
                    className="connect"
                    onClick={() => {
                      connect(id);
                      closeDialog()
                    }}
                  >
                    <IconSpan style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>

                      <img
                        src={
                          icon ===
                            'https://assets.terra.dev/icon/station-extension/icon.png'
                            ? 'https://assets.terra.dev/icon/wallet-provider/station.svg'
                            : icon
                        } style={{ width: "1em" }}

                        alt={name}
                      />
                      {name}
                    </IconSpan>
                  </FlatButton>
                ))
            }

            <BorderButton
              className="connect" type="button" onClick={() => {
                openView()
                closeDialog()
              }}>
              Connect a Wallet
            </BorderButton>
          </Box>
        )}

      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;

  section {
    padding: 0;
  }

  .wallet-address {
    display: inline-block;
  }

  .copy-wallet-address {
    display: inline-block;
    margin-left: 10px;
  }

  .wallet-icon {
    display: none !important;
  }

  ul {
    margin-top: 20px !important;
    font-size: 15px !important;
  }

  .disconnect {
    margin-top: 40px;

    width: 100%;
    height: 40px !important;

    ${buttonBaseStyle};

    background-color: ${({ theme }) => theme.actionButton.backgroundColor};

    &:hover {
      background-color: ${({ theme }) =>
    theme.actionButton.backgroundHoverColor};
    }
  }
`;
