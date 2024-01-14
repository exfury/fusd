
import { HelpOutline } from '@mui/icons-material'
import {
    Button,
    Grid,
    Tooltip,
} from '@mui/material'

import { ButtonOwnProps } from '@mui/material/Button'
import { FormikContextType } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { TextInput } from '@libs/neumorphism-ui/components/TextInput'
import { getMnemonic } from 'wallets/logic/storage'

export function copyWords(words: string[]) {
    navigator.clipboard.writeText(words.join(' '))
}


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
        <form onSubmit={formik.handleSubmit} className="form-element" style={{ width: "100%" }} >
            <Grid container gap={3} sx={{ justifyContent: "center", alignItems: "center" }}>
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
                        sx={{ display: "flex", justifyContent: "center" }}
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
        </ form>
    )
}
