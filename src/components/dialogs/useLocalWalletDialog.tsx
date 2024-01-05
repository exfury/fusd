import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { MnemonicKey } from '@terra-money/feather.js';
import React, {
  ReactNode, useMemo,
} from 'react';
import styled from 'styled-components';
import { CavernNetworkInfo } from '@anchor-protocol/app-provider';
import { MnemonicDialog } from 'pages/earn/components/deposit-dialog/mnemonic';
import { PasswordForm } from 'pages/earn/components/deposit-dialog/passwordForm';

interface FormParams {
  className?: string;
  networks: CavernNetworkInfo[]
}

type FormReturn = {
  address: string,
  chainID: string
} | null;

export function useLocalWalletDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  networks,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {

  // First we display the mnemonic with the password
  // Then we display the mnemonix with the conditions
  // Then we make the user set the mnoemonic again
  // Finally we display the last conditions
  // And a final screen saying the wallet is created and connected alright !

  const words = useMemo(() => {
    const { mnemonic } = new MnemonicKey()
    return mnemonic.split(' ')
  }, []) // must be memoized and stay the same across renders

  const [openPasswordForm, passwordForm] = useDialog(PasswordForm);
  const [openMnemonicDialog, mnemonicDialog] = useDialog(MnemonicDialog);

  const passwordFormPromise = openPasswordForm();

  openMnemonicDialog({
    words,
    formDialog: [passwordFormPromise, passwordForm]
  }).then((v) => console.log(v));

  return <>{mnemonicDialog}</>

}

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;
    margin-bottom: 50px;
  }

  .address-description,
  .network-description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: ${({ theme }) => theme.textColor};

    > :last-child {
      font-size: 12px;
    }

    margin-bottom: 12px;
  }

  .address-description {
    margin-top: 24px;
  }

  .connect {
    margin-top: 40px;
    width: 100%;
    height: 60px;
  }
`;
