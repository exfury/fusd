import { Meta } from "@storybook/react";
import React from "react";
import { DepositDialogWithButtons, PaddingActionButton } from "@libs/neumorphism-ui/components/DialogWithButtons";
import { Terra } from "@anchor-protocol/icons";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { kadoIcons, squidIcons } from 'pages/earn/components/terra/deposit-icons';
import { Box } from "@mui/material";
import { Grid } from "@mui/material";

export default {
    title: "cavern/NewDepositDialog",
} as Meta;

export const Basic = () => {


    return (
        <DepositDialogWithButtons closeDialog={(a: void) => undefined}>
            <Grid item>
                <PaddingActionButton>
                    <Terra
                        style={{ height: "1.4em", marginRight: 10 }}
                    />
                    Deposit on Terra
                </PaddingActionButton>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
                <Grid item>
                    <PaddingActionButton >
                        <CreditCardIcon
                            style={{ color: "currentColor", marginRight: 10 }}
                        />
                        Deposit with Credit Card
                    </PaddingActionButton>
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    {kadoIcons.map((icon) => (
                        <Box
                            key={icon.alt}
                            sx={{
                                padding: "5px",
                                margin: "5px",
                                backgroundColor: "#303030",
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "4px"
                            }}
                        >
                            <img src={icon.icon} alt="" title={icon.alt} style={{ height: "0.9em" }} />
                        </Box>
                    ))}
                </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
                <Grid item>
                    <PaddingActionButton disabled>
                        <img
                            src="https://app.squidrouter.com/images/icons/squid_logo.svg"
                            alt="Squid Router"
                            style={{ filter: "invert(1)", height: "1.4em", marginRight: 10 }}
                        />
                        Deposit from any blockchain
                    </PaddingActionButton>
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    {squidIcons.map((icon) => (
                        <Box
                            key={icon.alt}
                            sx={{
                                padding: "5px",
                                margin: "5px",
                                backgroundColor: "#303030",
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "4px"
                            }}
                        >
                            <img src={icon.icon} alt="" title={icon.alt} style={{ height: "1.1em", borderRadius: "50%" }} />
                        </Box>
                    ))} ...
                </Grid>
            </Grid>
        </DepositDialogWithButtons>
    );
};
