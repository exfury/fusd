import { DialogTitle, Modal } from '@mui/material';
import { Dialog as MaterialUIDialog } from '@mui/material';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { dialogStyle } from './useInsuranceCoverageDialog';
import { HumanAddr } from '@libs/types';
import { Close } from '@mui/icons-material';

interface FormParams {
  className?: string;
  address: HumanAddr | undefined
}

type FormReturn = void;

export function useBuyUstDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  address,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {

  const [openKado, setOpenKado] = React.useState(true);

  const handleClickOpen = () => {
    setOpenKado(true);
  };

  const handleClose = () => {
    setOpenKado(false);
    closeDialog()
  };

  return (
    <Modal open onClose={() => closeDialog()}>
      <KadoDialog
        open={openKado}
        address={address}
        depositAmount={"100"}
        onClose={handleClose}
      />
    </Modal>
  );
}


export interface KadoDialogProps {
  open: boolean;
  address: HumanAddr | undefined,
  depositAmount: string | undefined,
  onClose: () => void;
}

export function KadoDialog(props: KadoDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

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
    <MaterialUIDialog onClose={() => { null }} open={open} >
      <DialogTitle sx={{ textAlign: "center", display: "flex", flexDirection: "row", gap: "20px", alignItems: "center", justifyContent: "space-between" }}>Deposit USDC with Credit Card <Close sx={{ cursor: "pointer" }} onClick={onClose}></Close></DialogTitle>
      <iframe title="buy-kado-money" src={kadoURL} width="480" height="620" style={{ border: "0px" }}></iframe>
    </MaterialUIDialog>
  );
}

const Component = styled(ComponentBase)`
  width: 458px;

  ${dialogStyle};

  section {
    i {
      img {
        max-width: 32px;
      }
    }
  }
`;
