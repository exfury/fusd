import { Meta } from "@storybook/react";
import React from "react";
import { VerifyMnemonicDialog } from "../../deposit-dialog/verify-mnemonic";

export default {
    title: "Cavern/DepositDialog/VerifyMnemonic",
} as Meta;

export const Basic = () => {

    return (<VerifyMnemonicDialog words={["I", "want", "to", "start", "an", "army"]} />)
};
