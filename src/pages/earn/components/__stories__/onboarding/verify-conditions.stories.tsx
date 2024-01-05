import { Meta } from "@storybook/react";
import React from "react";
import { VerifyConditionsDialog } from "../../deposit-dialog/verify-conditions";

export default {
    title: "Cavern/DepositDialog/VerifyConditions",
} as Meta;

export const Basic = () => {

    return (<VerifyConditionsDialog />)
};
