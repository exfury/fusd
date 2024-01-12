
import React, { ReactNode, useState } from 'react';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { DepositDialogWithButtons } from '@libs/neumorphism-ui/components/DialogWithButtons';
import { TxHashLink as TxHashLinkBase } from 'components/links/TxHashLink';
import styled, { useTheme } from 'styled-components';
import { Box } from '@mui/material';
import { GuardStyled } from 'components/tx/TxResultRenderer';
import { Close } from '@mui/icons-material';

export interface DialogParams<T> {
    title?: ReactNode,
    text: ReactNode | (() => ReactNode),
    promise: Promise<T>
    catchOnError?: boolean
}


export function LoadingDialod<T>({ title, text, promise, closeDialog, catchOnError }: DialogProps<DialogParams<T>, T | null>): React.JSX.Element {

    const [error, setError] = useState<undefined | string>(undefined);

    promise
        .then((result) => {
            console.log("got results", result)
            closeDialog(result)
        })
        .catch(async (error) => {
            console.log("Error here ! ", error)
            // In case of an error, we replace the dialog content by the error content.
            if (catchOnError === undefined || catchOnError) {
                setError(error.toString())
            }

        });

    const {
        colors: { primary },
    } = useTheme();

    return (
        <DepositDialogWithButtons title={title ?? "Loading..."} closeDialog={() => closeDialog(null)}>
            <Box>
                {typeof text == "function" ? text() : text}
            </Box >
            {error && <Box>
                <figure style={{ textAlign: "center" }}>
                    <Close sx={{
                        borderRadius: "40px",
                        backgroundColor: "red",
                        padding: "10px",
                        width: "80px",
                        height: "80px",
                        marginTop: "20px",
                        marginBottom: "20px",
                    }} />
                </figure>
                There was an error during loading :
                <br />
                {error}
            </Box>}


            {!error && <figure>
                <GuardStyled color={primary} />
            </figure>
            }

        </DepositDialogWithButtons >
    );
}

export const TxHashLink = styled(TxHashLinkBase)`
    color: ${({ theme }) => theme.textColor};
    font-size: 0.9em
`

export type OpenLoadingDialog<T> = OpenDialog<DialogParams<T>, T | null>;
export type LoadingDialogResult<T> = T | null;

export function useLoadingDialog<T>(): [
    OpenLoadingDialog<T>,
    ReactNode
] {
    return useDialog(LoadingDialod) as [
        OpenLoadingDialog<T>,
        ReactNode
    ];
}