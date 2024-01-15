import { Meta } from "@storybook/react";
import React, { useEffect } from "react";
import { useMnemonicDialog } from "wallets/local-wallet-dialog/hooks";
import { AccountCreationTitle } from "wallets/local-wallet-dialog/mnemonic"
import { PasswordForm } from "wallets/local-wallet-dialog/passwordForm";

export default {
    title: "Cavern/DepositDialog/Mnemonic",
} as Meta;


export const Basic = () => {

    const [openDialog, mnemonicDialog] = useMnemonicDialog<void, string>();

    useEffect(() => {

        openDialog({
            formDialog: PasswordForm,
            title: <AccountCreationTitle progress={25} />,
            words: ["erosion", "pilot", "cluster", "aisle", "cabbage", "impulse", "struggle", "system", "nasty", "advice", "expect", "regular", "gate", "property", "garment", "mystery", "coin", "chimney", "seat", "clarify", "charge", "plug", "exact", "rebel"],
            formDialogProps: undefined
        });

    }, [openDialog]);

    return mnemonicDialog;
};
