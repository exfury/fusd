import { Meta } from "@storybook/react";
import React from "react";
import { AccountCreationTitle, MnemonicDialog } from "wallets/local-wallet-dialog/mnemonic"
import { ConditionsForm } from "wallets/local-wallet-dialog/conditionsForm";
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import { CircularProgressWithLabel } from "components/primitives/circular-progress";
import { Box } from "@mui/material";

export default {
    title: "Cavern/DepositDialog/Conditions",
} as Meta;

export const Basic = () => {
    return <MnemonicDialog
        words={["I", "want", "to", "start", "an", "army"]}
        title={<AccountCreationTitle progress={0} />}
        formDialog={ConditionsForm}
        closeDialog={(_: boolean | null) => { _; }}
        formDialogProps={{}}
    />
};
