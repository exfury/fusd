import { Meta } from "@storybook/react";
import { useEffect } from "react";
import { useDialog } from "@libs/use-dialog";
import { VerifyConditionsDialog } from "wallets/local-wallet-dialog/verify-conditions";

export default {
    title: "Cavern/DepositDialog/VerifyConditions",
} as Meta;

export const Basic = () => {

    const [openVerifyConditions, conditionsForm] = useDialog(VerifyConditionsDialog);

    useEffect(() => {
        openVerifyConditions()

    }, [openVerifyConditions]);
    return conditionsForm;
};