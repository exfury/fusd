import { DollarCoin } from '@anchor-protocol/icons';
import { ButtonBaseProps } from '@mui/material';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import React from 'react';
import styled from 'styled-components';
import { useAccount } from 'contexts/account';

export function BuyUstButton(buttonProps: ButtonBaseProps) {
  const [openBuyUst, buyUstElement] = useBuyUstDialog();
  const { terraWalletAddress } = useAccount();

  return (
    <>
      <Button {...buttonProps} onClick={() => openBuyUst({
        address: terraWalletAddress,
        depositAmount: "100"
      })}>
        <DollarCoin /> Buy axlUSDC
      </Button>
      {buyUstElement}
    </>
  );
}

const Button = styled(BorderButton)`
  padding: 0 10px;

  border: none !important;

  font-size: 16px;
  height: 34px;

  svg {
    font-size: 1em;
    transform: scale(1.2);
    margin-right: 8px;
  }
`;
