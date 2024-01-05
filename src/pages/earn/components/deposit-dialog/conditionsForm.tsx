import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { FormComponent, FormComponentProps } from './formLayout'

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

export function useConditionsForm(props?: FormComponentProps): FormComponent<boolean> {
    const [accepted, setAccepted] = useState(false)
    const [success, setSuccess] = useState(false)

    /// Only here in case someone goes back to add the submit button
    const [isResetted, setIsResetted] = useState(false)

    const formik = useFormik({
        initialValues: {
            recover: false,
            danger: false,
            write: false,
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            setAccepted(true)
            setSuccess(true)
        },
    })

    useEffect(() => {
        if (formik.isValid && formik.dirty) {
            if (props?.autoSubmit) {
                formik.submitForm()
                toast.success('You now understand the conditions for your mnemonic')
            }
        }
    }, [formik, formik.isValid, formik.submitForm, props?.autoSubmit])

    return {
        success,
        onSubmitValue: accepted,
        reset: () => {
            setSuccess(false)
            setAccepted(false)
            setIsResetted(true)
        },
        formElement: (
            <form onSubmit={formik.handleSubmit} className="form-element">
                <FormControl
                    sx={{ width: '100%', padding: '0px 20px', gap: 2 }}
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
                            label="This mnemonic is the only way of recovering your account. If you loose it, you will never be able to recover your account in case you loose your password."
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
                    {isResetted && <Button type="submit">Submit</Button>}
                </FormControl>
            </form>
        ),
    }
}
