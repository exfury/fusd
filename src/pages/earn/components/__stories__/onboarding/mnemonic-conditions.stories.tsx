import { Meta } from "@storybook/react";
import React from "react";
import { MnemonicDialog } from "../../deposit-dialog/mnemonic";
import { useConditionsForm } from "../../deposit-dialog/conditionsForm";

export default {
    title: "Cavern/DepositDialog/Conditions",
} as Meta;

export const Basic = () => {

    const conditionsForm = useConditionsForm();

    return (<MnemonicDialog words={["I", "want", "to", "start", "an", "army"]} formComponent={conditionsForm} />)
};
