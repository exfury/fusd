import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { DialogProps } from '@libs/use-dialog'

const validationSchema = yup.object({
    recover: yup
        .bool()
        .oneOf(
            [true],
            'You have to accept that if you loose this key you will loose access to your account'
        ),
    danger: yup
        .bool()
        .oneOf(
            [true],
            'You have to accept that if you someone accesses this key, they can control your accout the way they want'
        ),
    write: yup.bool().oneOf([true], 'You have to write down this mnemonic'),
})

export function ConditionsForm({ closeDialog }: DialogProps<Record<never, string>, boolean>) {

    const formik = useFormik({
        initialValues: {
            recover: false,
            danger: false,
            write: false,
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            closeDialog(true)
        },
    })

    useEffect(() => {
        if (formik.isValid && formik.dirty) {
            formik.submitForm()
            toast.success('You now understand the conditions for your mnemonic')
        }
    }, [formik, formik.isValid, formik.submitForm])

    return (
        <form onSubmit={formik.handleSubmit} className="form-element" style={{ gap: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <FormControl
                sx={{ width: '100%', padding: '0px', gap: 1 }}
            >
                By checking the following boxes, I understand that :{' '}
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox />}
                        id="recover"
                        name="recover"
                        checked={formik.values.recover}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color="primary"
                        label="This mnemonic is the only way of recovering your account. 
                            If you loose it and your password, you will NEVER be able to recover your account."
                    />
                    <span style={{ color: 'red', fontSize: '0.9em' }}>
                        {formik.touched.recover && formik.errors.recover}
                    </span>
                </FormGroup>

                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox />}
                        id="danger"
                        name="danger"
                        checked={formik.values.danger}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color="primary"
                        label="If someone has EVER access to this mnemonic, they will be able to control my account completely."
                    />
                    <span style={{ color: 'red', fontSize: '0.9em' }}>
                        {formik.touched.danger && formik.errors.danger}
                    </span>
                </FormGroup>

                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox />}
                        id="write"
                        name="write"
                        checked={formik.values.write}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color="primary"
                        label="I have written down this mnemonic"
                    />
                    <span style={{ color: 'red', fontSize: '0.9em' }}>
                        {formik.touched.write && formik.errors.write}
                    </span>
                </FormGroup>

            </FormControl>
            <Button type="submit"
                variant="contained"
                color="primary"
                sx={{ maxWidth: "400px" }}>Submit</Button>
        </form>
    )
}
