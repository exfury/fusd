import { HelpOutline } from '@mui/icons-material'
import {
    Button,
    Grid,
    Tooltip,
} from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { TextInput } from '@libs/neumorphism-ui/components/TextInput'
import { DialogProps } from '@libs/use-dialog'

const validationSchema = yup.object({
    password: yup.string().required('You have to provide a password'),
    repeatPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('You have to repeat your password'),
})

// interface FormParams { }

type FormReturn = string;

export function PasswordForm({ closeDialog }: DialogProps<void, FormReturn>) {

    const formik = useFormik({
        initialValues: {
            password: '',
            repeatPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            closeDialog(values.password)
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className="form-element">
            <Grid container gap={2} sx={{ justifyContent: "center", alignItems: "center" }}>
                <Grid item xs={12} sm={5}>
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
                <Grid item xs={12} sm={5}>

                    <TextInput
                        label="Repeat your Password"

                        id="repeatPassword"
                        type="password"
                        name="repeatPassword"
                        value={formik.values.repeatPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.repeatPassword &&
                            Boolean(formik.errors.repeatPassword)
                        }
                        helperText={
                            formik.touched.repeatPassword &&
                            formik.errors.repeatPassword
                        }
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        sx={{ maxWidth: "400px" }}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}
