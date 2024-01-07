
import { HelpOutline } from '@mui/icons-material'
import {
    Box,
    Button,
    Divider,
    Grid,
    Tooltip,
    Typography,
} from '@mui/material'

import { ButtonOwnProps } from '@mui/material/Button'
import { FormikContextType, useFormik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { TextInput } from '@libs/neumorphism-ui/components/TextInput'
import { DialogProps } from '@libs/use-dialog'
import { getMnemonic } from 'wallets/logic/storage'
import { DepositDialogWithButtons } from '@libs/neumorphism-ui/components/DialogWithButtons'
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm'
import { useAlert } from '@libs/neumorphism-ui/components/useAlert'
import { copyWords } from './mnemonic'

export type FormReturn = {
    password: string,
    removeMnemonic?: never
} | {
    password?: never,
    removeMnemonic: boolean
} | null;

export const passwordValidationSchema = yup.object({
    password: yup
        .string()
        .test({
            name: 'Can decode mnemonic',
            message: 'Wrong password',
            test: (password) => {
                try {
                    if (!password) {
                        return false
                    }
                    const decoded_mnemonic = getMnemonic(password)
                    return !!decoded_mnemonic
                } catch (e) {
                    return false
                }
            },
        }),
})

export function passwordForm(
    formik: FormikContextType<{ password: string }>,
    buttonText: string,
    buttonColor: ButtonOwnProps["color"],
) {
    return (
        <form onSubmit={formik.handleSubmit} className="form-element">
            <Grid container gap={2} sx={{ justifyContent: "center", alignItems: "center" }}>
                <Grid item xs={12} sm={5}
                    sx={{
                        minWidth: "300px"
                    }}>
                    <TextInput
                        label={
                            <>Password <Tooltip title="This password will never be saved anywhere">
                                <HelpOutline
                                    aria-label="help"
                                    sx={{ fontSize: 15 }}
                                />
                            </Tooltip></>
                        }
                        id="password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password &&
                            formik.errors.password
                        }
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        type="submit"
                        color={buttonColor}
                        sx={{ maxWidth: "400px" }}
                    >
                        {buttonText}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}



export function LocalWalletManageDialog({ closeDialog }: DialogProps<void, FormReturn>) {

    const retrieveForm = useFormik({
        initialValues: {
            password: '',
        },
        validationSchema: passwordValidationSchema,
        onSubmit: (values) => {

            const mnemonic = getMnemonic(values.password);
            if (!mnemonic) {
                closeDialog(null)
                return;
            }

            openAlert({
                title:
                    <Typography variant="h4" component="h2" sx={{
                        color: (theme) => theme.palette.warning.light
                    }}>
                        Here is your account mnemonic
                    </Typography>,
                description:
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                        <Box><strong>ONLY</strong> share it with people and apps you trust.</Box>
                        <Grid container spacing={2} sx={{ padding: 1 }}>
                            {mnemonic.map(function (word, i) {
                                return (
                                    <Grid item xs={3} key={`${word} - ${i}`}>
                                        <TextInput
                                            label={`Word ${i + 1}`}
                                            defaultValue={word}
                                            size="small"
                                            InputProps={{
                                                readOnly: true, // This makes the input read-only
                                                style: {
                                                    padding: 0,
                                                },
                                            }}
                                        ></TextInput>
                                    </Grid>
                                )
                            })}
                        </Grid>

                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            sx={{ maxWidth: "400px" }}
                            onClick={() => copyWords(mnemonic)}
                        >
                            Copy all words
                        </Button>
                    </Box>,
                agree: 'Close',
            })
        },
    })

    const [openConfirm, confirmElement] = useConfirm();

    const [openAlert, alertElement] = useAlert();


    return (

        <DepositDialogWithButtons gridSx={{ alignItems: "flex-end" }} spacing={3} title="Manage Local Wallet" closeDialog={() => {
            closeDialog(null)
        }}>

            {passwordForm(retrieveForm, "Retrieve Mnemonic", "warning")}
            <Divider />

            <Button variant="contained"
                type="submit"
                color="error"
                sx={{ maxWidth: "400px" }}
                onClick={async () => {

                    const confirmed = await openConfirm({
                        title:
                            <Typography variant="h4" component="h2" sx={{
                                color: (theme) => theme.palette.error.light
                            }}>
                                Local account destruction
                            </Typography>,
                        description:
                            <Box>
                                If you agree here, your local account will be deleted forever, you won't be able to retrieve it
                            </Box>,
                        agree: 'Delete forever',
                        disagree: 'Cancel',
                    });
                    if (confirmed) {
                        closeDialog({
                            removeMnemonic: true
                        })
                    }
                }}>DELETE LOCAL ACCOUNT</Button>

            {confirmElement}
            {alertElement}
        </DepositDialogWithButtons>
    )
}