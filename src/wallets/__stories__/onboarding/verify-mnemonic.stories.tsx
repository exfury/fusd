import { Meta } from "@storybook/react";
import { useEffect } from "react";
import { useDialog } from "@libs/use-dialog";
import { VerifyMnemonicDialog } from "wallets/local-wallet-dialog/verify-mnemonic";

export default {
    title: "Cavern/DepositDialog/VerifyMnemonic",
} as Meta;


export const Basic = () => {

    const [openVerifyMnemonic, conditionsForm] = useDialog(VerifyMnemonicDialog);
    useEffect(() => {
        openVerifyMnemonic({
            words: ["I", "want", "to", "start", "an", "army"]
        })

    }, [openVerifyMnemonic]);
    return conditionsForm;
};