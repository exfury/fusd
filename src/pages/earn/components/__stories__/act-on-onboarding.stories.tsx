import { Meta } from "@storybook/react";
import React from "react";
import { UST, u } from "@libs/types";
import { ActOnOnboardingDialog } from "../terra/ActOnOnboardingDialog";
import { OnBoardingTx } from "@anchor-protocol/app-provider/queries/on-boarding/fetchOnBoardingTxs";

export default {
    title: "cavern/OnBoardingDialog",
} as Meta;

export const Basic = () => {


    const tx: OnBoardingTx[] = [{
        tx_hash: "EBB00A12835776FD57832BB6B916B31C499263C387359730AB0A929FC47619F6",
        kado_amount: "100000" as u<UST>,
        id: 1,
        address: "terraAddress",
        tx_events: "",
        timestamp: "2024-01-06T22:21:26Z",
        has_fee_grant: false,
        executed: false,
    }, {
        tx_hash: "EBB00A12835776FD57832BB6B916B31C499263C387359730AB0A929FC47619F6",
        kado_amount: "10000" as u<UST>,
        id: 2,
        address: "terraAddress",
        tx_events: "",
        timestamp: "2024-01-06T22:21:26Z",
        has_fee_grant: false,
        executed: false,
    }];
    return (
        <ActOnOnboardingDialog txs={tx} closeDialog={(tx: OnBoardingTx | null) => console.log("Chosen tx")} beforeDeposit={false} />
    );
};
