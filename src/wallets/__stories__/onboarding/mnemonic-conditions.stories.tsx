import { Meta } from "@storybook/react";
import React from "react";
import { AccountCreationTitle, MnemonicDialog } from "wallets/local-wallet-dialog/mnemonic"
import { ConditionsForm } from "wallets/local-wallet-dialog/conditionsForm";

export default {
    title: "Cavern/DepositDialog/Conditions",
} as Meta;

export const Basic = () => {
    return <MnemonicDialog
        words={["erosion", "pilot", "cluster", "aisle", "cabbage", "impulse", "struggle", "system", "nasty", "advice", "expect", "regular", "gate", "property", "garment", "mystery", "coin", "chimney", "seat", "clarify", "charge", "plug", "exact", "rebel"]}
        title={<AccountCreationTitle progress={0} />}
        formDialog={ConditionsForm}
        closeDialog={(_: unknown) => { _; }}
        formDialogProps={{}}
    />
};
