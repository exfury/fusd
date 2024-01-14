import { Meta } from "@storybook/react";
import { useEffect } from "react";
import { useVerifyMnemonicDialog } from "wallets/local-wallet-dialog/verify-mnemonic";

export default {
    title: "Cavern/DepositDialog/VerifyMnemonic",
} as Meta;


export const Basic = () => {

    const [openVerifyMnemonic, conditionsForm] = useVerifyMnemonicDialog();
    useEffect(() => {
        openVerifyMnemonic({
            words: ["erosion", "pilot", "cluster", "aisle", "cabbage", "impulse", "struggle", "system", "nasty", "advice", "expect", "regular", "gate", "property", "garment", "mystery", "coin", "chimney", "seat", "clarify", "charge", "plug", "exact", "rebel"]
        })

    }, [openVerifyMnemonic]);
    return conditionsForm;
};