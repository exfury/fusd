import React, { ReactNode } from 'react';
import { Grid, Modal, styled } from "@mui/material";
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { ActionButton } from "@libs/neumorphism-ui/components/ActionButton";


export interface DialogWithButtonProps {
    closeDialog?: () => void,
    children: ReactNode[],
    spacing?: number
}

export function ComponentBase({ closeDialog, children, spacing }: DialogWithButtonProps): React.JSX.Element {

    return (
        <Modal open onClose={() => {
            if (closeDialog) {
                closeDialog()
            }
        }}>
            <Dialog onClose={() => {
                if (closeDialog) {
                    closeDialog()
                }
            }}>
                <Title>Deposit</Title>

                <Grid container gap={spacing ?? 3}>
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

export const DepositDialogWithButtons = styled(ComponentBase) <DialogWithButtonProps>`
width: 720px;
`

export const PaddingActionButton = styled(ActionButton)`
  padding: 20px 40px;
`;


