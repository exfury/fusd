import React, { ReactNode } from 'react';
import { Grid, Modal, SxProps, Theme, styled } from "@mui/material";
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { ActionButton } from "@libs/neumorphism-ui/components/ActionButton";


export interface DialogWithButtonProps {
    closeDialog?: () => void,
    children: ReactNode[],
    spacing?: number
    title?: ReactNode
    gridSx?: SxProps<Theme>;
    className?: string | undefined;
}

export function ComponentBase({ closeDialog, children, spacing, title, gridSx, className }: DialogWithButtonProps): React.JSX.Element {

    return (
        <Modal open onClose={() => {
            if (closeDialog) {
                closeDialog()
            }
        }}>
            <Dialog className={className} onClose={() => {
                if (closeDialog) {
                    closeDialog()
                }

            }}>
                <Title>{title ?? "Deposit"}</Title>

                <Grid container gap={spacing ?? 3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px", ...gridSx }}>
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
`

export const DepositDialogWithButtons = styled(ComponentBase) <DialogWithButtonProps>`
width: 720px;
@media (min-width: 700px) {
    .dialog-content{
        margin-top: 24px !important;
        margin-bottom: 24px !important;
    }
}
.dialog-content{
    margin-top: 60px;
    margin-bottom: 60px;
}
`

export const PaddingActionButton = styled(ActionButton)`
  padding: 20px 40px;
`;


