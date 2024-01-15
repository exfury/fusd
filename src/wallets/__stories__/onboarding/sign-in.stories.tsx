import { Meta } from "@storybook/react";
import { useEffect } from "react";
import { useDialog } from "@libs/use-dialog";
import { LocalWalletConnectionDialog } from "wallets/local-wallet-dialog/connection";

export default {
    title: "Cavern/DepositDialog/Connection",
} as Meta;


export const Basic = () => {

    const [openConnection, connection] = useDialog(LocalWalletConnectionDialog);
    useEffect(() => {
        openConnection()

    }, [openConnection]);
    return connection;
};