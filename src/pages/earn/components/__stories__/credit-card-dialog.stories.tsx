import { Meta } from "@storybook/react";
import React from "react";
import { DepositDialogWithButtons, PaddingActionButton } from "@libs/neumorphism-ui/components/DialogWithButtons";
import { Cavern, Terra } from "@anchor-protocol/icons";
import { Grid } from "@mui/material";

export default {
    title: "cavern/CreditCardDialog",
} as Meta;

export const Basic = () => {

    return (
        <DepositDialogWithButtons closeDialog={(a: void) => undefined}>
            <Grid item xs={12}>
                <PaddingActionButton>
                    <Cavern style={{ height: "1.9em", marginRight: 10 }} />
                    Create an account
                </PaddingActionButton>
            </Grid>
            <Grid item>
                <PaddingActionButton>
                    <Terra
                        style={{ height: "1.4em", marginRight: 10 }}
                    />
                    You already have a Terra Wallet
                </PaddingActionButton>
            </Grid>
        </DepositDialogWithButtons >
    );
};
