import { Meta } from "@storybook/react";
import React, { useEffect, useMemo } from "react";
import { useDialog } from "@libs/use-dialog";
import { AccountCreationTitle, MnemonicDialog, FormParams as MnemonicFormParams } from "wallets/local-wallet-dialog/mnemonic"
import { PasswordForm } from "wallets/local-wallet-dialog/passwordForm";

export default {
    title: "Cavern/DepositDialog/Mnemonic",
} as Meta;

export const Basic = () => {

    const [openDialog, mnemonicDialog] = useDialog<MnemonicFormParams<null, string>, string | null>(MnemonicDialog);

    useEffect(() => {

        openDialog({
            formDialog: PasswordForm,
            title: <AccountCreationTitle progress={25} />,
            words: ["I", "want", "to", "start", "an", "army"],
            formDialogProps: null
        });

    }, [openDialog]);

    return mnemonicDialog;
};
