import React, { ReactNode } from 'react';
import { Grid, Modal, styled } from "@mui/material";
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { ActionButton } from "@libs/neumorphism-ui/components/ActionButton";

export function ComponentBase({ closeDialog, children }: { closeDialog: () => void } & { children: ReactNode[] }): React.JSX.Element {

    return (
        <Modal open onClose={() => closeDialog()}>
            <Dialog onClose={() => closeDialog()}>
                <Title>Deposit</Title>

                <Grid container spacing={3}>
                    {children}
                </Grid>
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

export const PaddingActionButton = styled(ActionButton)`
  padding: 20px 40px;
`;


