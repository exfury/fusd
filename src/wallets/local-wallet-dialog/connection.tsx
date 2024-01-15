
import {
    Box,
    Button,
    Divider,
} from '@mui/material'

import { useFormik } from 'formik'
import React from 'react'
import { DialogProps } from '@libs/use-dialog'
import { DepositDialogWithButtons } from '@libs/neumorphism-ui/components/DialogWithButtons'
import { passwordForm, passwordValidationSchema } from './helpers'

export type FormReturn = {
    password: string,
    removeMnemonic?: never
} | {
    password?: never,
    removeMnemonic: boolean
} | null;

export function LocalWalletConnectionDialog({ closeDialog }: DialogProps<void, FormReturn>) {

    const signInForm = useFormik({
        initialValues: {
            password: '',
        },
        validationSchema: passwordValidationSchema,
        onSubmit: (values) => {
            closeDialog({
                password: values.password
            })
        },
    })

    return (

        <DepositDialogWithButtons gridSx={{ alignItems: "flex-start" }} spacing={3} title="Connect Local Wallet" closeDialog={() => {
            closeDialog(null)
        }}>
            {passwordForm(signInForm, "Login", "primary")}
            <Divider />
            You are tired of inputting your password everytime when accessing Cavern Protocol ?
            <br />
            Use now an actual wallet extension to have better control over your account.
            <br />
            Here are some wallet examples :

            <Box sx={{ display: "flex", flexDirection: "row", gap: "50px", flexWrap: "wrap", justifyContent: "center" }}>
                <Button sx={{ display: "flex", flexDirection: "row", gap: "10px" }} variant="text" href="https://docs.terra.money/learn/station/download/station-desktop">
                    <img alt="Station Wallet" src="https://station.terra.money/static/media/favicon.6ba850f5.svg" width="50" />
                    Terra Station
                </Button>
                <Button sx={{ display: "flex", flexDirection: "row", gap: "10px" }} variant="text" href="https://www.keplr.app/download">
                    <img alt="Keplr Wallet" src="https://assets-global.website-files.com/63eb7ddf41cf5b1c8fdfbc74/63edd5d1a40b9a48841ac1d2_Keplr%20Logo.svg" width="100" />
                    Keplr Wallet
                </Button>
            </Box>
        </DepositDialogWithButtons >
    )
}