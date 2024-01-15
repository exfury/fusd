import { Meta } from "@storybook/react";
import { useEffect } from "react";
import { useVerifyConditionsDialog } from "wallets/local-wallet-dialog/hooks";

export default {
    title: "Cavern/DepositDialog/VerifyConditions",
} as Meta;

export const Basic = () => {

    const [openVerifyConditions, conditionsForm] = useVerifyConditionsDialog();

    useEffect(() => {
        openVerifyConditions({})
    }, [openVerifyConditions]);
    return conditionsForm;
};