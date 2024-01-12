import React, { ReactNode } from 'react';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { FormParams, FormReturn } from './types';
import { useTerraDepositDialog } from './terra';
import { Box, Grid } from "@mui/material";
import { DepositDialogWithButtons, PaddingActionButton } from '@libs/neumorphism-ui/components/DialogWithButtons';
import { Terra } from '@anchor-protocol/icons';
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { kadoIcons, squidIcons } from './terra/deposit-icons';
import { useCreditCardDepositDialog } from './terra/CreditCardDepositDialog';

function DepositDialog({ closeDialog }: DialogProps<FormParams, FormReturn>): React.JSX.Element {

  const [openTerraDepositDialog, terraDepositDialog] = useTerraDepositDialog();

  const [openCreditCardDialog, creditCardDialog] = useCreditCardDepositDialog();

  return (<DepositDialogWithButtons closeDialog={() => closeDialog()}>
    <Grid item>
      <PaddingActionButton onClick={openTerraDepositDialog}>
        <Terra
          style={{ height: "1.4em", marginRight: 10 }}
        />
        Deposit on Terra
      </PaddingActionButton>
    </Grid>
    <Grid item container alignItems="center" spacing={2}>
      <Grid item>
        <PaddingActionButton onClick={() => openCreditCardDialog().then(() => closeDialog())}>
          <CreditCardIcon
            style={{ color: "currentColor", marginRight: 10 }}
          />
          Deposit with Credit Card
        </PaddingActionButton>
      </Grid>
      <Grid item sx={{ display: "flex", alignItems: "center" }}>
        {kadoIcons.map((icon) => (
          <Box
            key={icon.alt}
            sx={{
              padding: "5px",
              margin: "5px",
              backgroundColor: "#303030",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px"
            }}
          >
            <img src={icon.icon} alt="" title={icon.alt} style={{ height: "0.9em" }} />
          </Box>
        ))}
      </Grid>
    </Grid>
    <Grid item container alignItems="center" spacing={2}>
      <Grid item>
        <PaddingActionButton disabled>
          <img
            src="https://app.squidrouter.com/images/icons/squid_logo.svg"
            alt="Squid Router"
            style={{ filter: "invert(1)", height: "1.4em", marginRight: 10 }}
          />
          Deposit from any blockchain
        </PaddingActionButton>
      </Grid>
      <Grid item sx={{ display: "flex", alignItems: "center" }}>
        {squidIcons.map((icon) => (
          <Box
            key={icon.alt}
            sx={{
              padding: "5px",
              margin: "5px",
              backgroundColor: "#303030",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px"
            }}
          >
            <img src={icon.icon} alt="" title={icon.alt} style={{ height: "1.1em", borderRadius: "50%" }} />
          </Box>
        ))} ...
      </Grid>
    </Grid>
    {terraDepositDialog}
    {creditCardDialog}
  </DepositDialogWithButtons>
  );
}


export function useDepositDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(DepositDialog);
}
