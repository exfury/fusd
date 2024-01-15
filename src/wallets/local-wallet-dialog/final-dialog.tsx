import React from "react";
import { DepositDialogWithButtons } from "@libs/neumorphism-ui/components/DialogWithButtons";
import { DialogProps } from "@libs/use-dialog";
import { Button, Grid } from "@mui/material";
import { AccountCreationTitle } from "./mnemonic";


export function FinalLocalWalletCreationDialog({ closeDialog }: DialogProps<void, void>) {
    return (
        <DepositDialogWithButtons title={<AccountCreationTitle progress={100} />} spacing={3} closeDialog={() => closeDialog()} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }} >
            <></>
            <Grid item xs={12}>
                You just created you account successfully.
                <br />
                You are now connected to the platform and you can start using it freely.
                <br />
                You will use your password to confirm all transactions.
                <br />
                You will <strong>ONLY</strong> need your mnemonic in case you want to transfer or reset your password.
            </Grid>
            <Grid item>
                <Button type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ maxWidth: "400px" }}
                    onClick={() => closeDialog()}>Close</Button>
            </Grid>


        </DepositDialogWithButtons>
    )
}
