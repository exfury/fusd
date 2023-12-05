import { Meta } from "@storybook/react";
import React from "react";
import { DepositDialogWithButtons } from "@libs/neumorphism-ui/components/DialogWithButtons";

export default {
    title: "cavern/NewDepositDialog",
} as Meta;

export const Basic = () => {


    return (
        <DepositDialogWithButtons closeDialog={(a: void) => undefined}>
        </DepositDialogWithButtons>
    );
};
