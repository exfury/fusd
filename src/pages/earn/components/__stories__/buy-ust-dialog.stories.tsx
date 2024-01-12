import { Meta } from "@storybook/react";
import React from "react";
import { KadoDialog } from "../useBuyUstDialog";
import { HumanAddr } from "@libs/types";

export default {
    title: "cavern/BuyUstDialog",
} as Meta;

export const Basic = () => {

    return (
        <KadoDialog depositAmount={"500"} open={true} address={"terra1neen87w9ztnze6wypztrg9nwug7kkr3k53wv3t" as HumanAddr} onClose={() => console.log("Closed dialog")} />
    );
};
