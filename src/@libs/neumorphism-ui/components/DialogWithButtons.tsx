import React, { ReactNode } from 'react';
import { Grid, Modal, styled } from "@mui/material";
import { Box } from "@mui/material";
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { ActionButton } from "@libs/neumorphism-ui/components/ActionButton";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Terra } from "@anchor-protocol/icons";
import { useTerraDepositDialog } from 'pages/earn/components/terra';
const kadoIcons = [
    {
        icon: "https://kado-asset-haus.s3.amazonaws.com/images/payments/dark/vi.png",
        alt: "Visa",
    },

    {
        icon: "https://kado-asset-haus.s3.amazonaws.com/images/payments/dark/mc.png",
        alt: "MasterCard",
    },

    {
        icon: "https://kado-asset-haus.s3.amazonaws.com/images/payments/dark/apple.png",
        alt: "Apple Pay",
    },

    {
        icon: "https://kado-asset-haus.s3.amazonaws.com/images/payments/dark/bank.png",
        alt: "Bank Deposit",
    },

    {
        icon: "https://kado-asset-haus.s3.amazonaws.com/images/payments/dark/sepa.png",
        alt: "Sepa Transfers",
    },
    {
        icon: "https://kado-asset-haus.s3.amazonaws.com/images/payments/dark/pix.png",
        alt: "Pix",
    },
];

const squidIcons = [
    {
        "icon": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg",
        "alt": "Ethereum"
    },
    {
        "icon": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/arb.svg",
        "alt": "Arbitrum"
    },
    {
        "icon": "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png",
        "alt": "Optimism"
    },
    {
        "icon": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/osmo.svg",
        "alt": "Osmosis"
    },
    {
        "icon": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/bnb.svg",
        "alt": "BNB Chain"
    }
]
export function ComponentBase({ closeDialog }: { closeDialog: () => void }): React.JSX.Element {

    const [openTerraDialog, terraDialog] = useTerraDepositDialog();

    return (
        <Modal open onClose={() => closeDialog()}>
            <Dialog onClose={() => closeDialog()}>
                <Title>Deposit</Title>

                <Grid container spacing={3}>
                    <Grid item>
                        <PaddingActionButton onClick={openTerraDialog}>
                            <Terra
                                style={{ height: "1.4em", marginRight: 10 }}
                            />
                            Deposit on Terra
                        </PaddingActionButton>
                    </Grid>
                    <Grid item container alignItems="center" spacing={2}>
                        <Grid item>
                            <PaddingActionButton disabled>
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
                </Grid>
                {terraDialog}
            </Dialog>
        </Modal>

    );
}
const Title = styled("h1")`

  font-size: 27px;
  text-align: center;
  font-weight: 300;

  margin-bottom: 50px;
  margin-top: 50px;
`

export const DepositDialogWithButtons = styled(ComponentBase) <{ closeDialog: () => void } & { children: ReactNode[] }>`
width: 720px;
`

const PaddingActionButton = styled(ActionButton)`
  padding: 20px 40px;
`;


