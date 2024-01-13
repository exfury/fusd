import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { dialogStyle } from './useInsuranceCoverageDialog';
import { HumanAddr } from '@libs/types';
import { DepositDialogWithButtons } from '@libs/neumorphism-ui/components/DialogWithButtons';


type FormReturn = void;

export function useBuyUstDialog(): [
  OpenDialog<KadoDialogProps, FormReturn>,
  ReactNode,
] {
  return useDialog(KadoDialog);
}


export interface KadoDialogProps {
  className?: string;
  address: HumanAddr | undefined,
  depositAmount?: string | undefined,
}

function KadoDialogBase(props: DialogProps<KadoDialogProps, void>) {


  //https://app.kado.money/
  let kadoURL = "https://sandbox--kado.netlify.app/";
  kadoURL += "?onPayCurrency=USD&theme=dark"
  kadoURL += "&onRevCurrency=USDC&cryptoList=USDC"
  kadoURL += "&network=TERRA&networkList=TERRA"
  kadoURL += "&product=BUY&productList=BUY";
  kadoURL += props.address ? `&onToAddress=${props.address}` : "";
  kadoURL += props.depositAmount ? `&onPayAmount=${props.depositAmount}` : "";
  kadoURL += props.address ? `&userRef=CAVERN_DIRECT_DEPOSIT_${props.address}` : ""

  return (
    <DepositDialogWithButtons className={props.className} closeDialog={props.closeDialog} sx={{ margin: "0px !important" }} >
      <></>
      {/* <DialogTitle sx={{ textAlign: "center", display: "flex", flexDirection: "row", gap: "20px", alignItems: "center", justifyContent: "space-between" }}>Deposit USDC with Credit Card <Close sx={{ cursor: "pointer" }} onClick={() => props.closeDialog()}></Close></DialogTitle> */}
      <iframe title="buy-kado-money" src={kadoURL} width="550" height="700" style={{ border: "0px" }}></iframe>
    </DepositDialogWithButtons>
  );
}

export const KadoDialog = styled(KadoDialogBase)`

  ${dialogStyle};

  section {
    i {
      img {
        max-width: 32px;
      }
    }
  }
  .dialog-content{
    margin-left: 0px !important;
    margin-right: 0px !important;
  }

  iframe {
      max-width: 100% !important;
  }
`;
