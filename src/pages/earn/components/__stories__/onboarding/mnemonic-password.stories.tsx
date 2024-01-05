import { Meta } from "@storybook/react";
import React from "react";
import { MnemonicDialog } from "../../deposit-dialog/mnemonic";
import { usePasswordForm } from "../../deposit-dialog/passwordForm";

export default {
    title: "Cavern/DepositDialog/Mnemonic",
} as Meta;

export const Basic = () => {

    const passwordForm = usePasswordForm();

    return (<MnemonicDialog words={["I", "want", "to", "start", "an", "army"]} formComponent={passwordForm} />)
};
