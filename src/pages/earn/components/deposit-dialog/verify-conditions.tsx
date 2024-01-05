import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { FormComponent, FormComponentProps } from './formLayout'
import { DepositDialogWithButtons } from '@libs/neumorphism-ui/components/DialogWithButtons'

const validationSchema = yup.object({
    verify: yup
        .bool()
        .oneOf(
            [true],
            'You have to accept this final message. This is very important'
        ),
})

export function useVerifyConditionsForm(props?: FormComponentProps): FormComponent<boolean> {
    const [accepted, setAccepted] = useState(false)
    const [success, setSuccess] = useState(false)

    /// Only here in case someone goes back to add the submit button
    const [isResetted, setIsResetted] = useState(false)

    const formik = useFormik({
        initialValues: {
            verify: false,
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            setAccepted(true)
            setSuccess(true)
        },
    })

    useEffect(() => {
        if (props?.autoSubmit && formik.isValid && formik.dirty) {
            formik.submitForm()
            toast.success(
                'You have now understood the sensitivity of a mnemonic'
            )
        }
    }, [props?.autoSubmit, formik, formik.dirty, formik.isValid, formik.submitForm])

    return {
        success,
        onSubmitValue: accepted,
        reset: () => {
            setSuccess(false), setAccepted(false)
            setIsResetted(true)
        },
        formElement: (
            <form onSubmit={formik.handleSubmit}>
                <FormControl
                    sx={{ width: '100%', padding: '0px 20px', gap: 2 }}
                    className="form-element"
                >
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox />}
                            id="verify"
                            name="verify"
                            value={formik.values.verify}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            color="primary"
                            label={
                                <span>
                                    By clicking this checkbox, you acknowledge
                                    that those 24 words are very sensitive and
                                    you are at risk of loosing control over your
                                    account if you <strong>LOOSE</strong> them
                                    or if <strong>ANYONE</strong> has access to
                                    them.
                                </span>
                            }
                        />
                        <span style={{ color: 'red', fontSize: '0.9em' }}>
                            {formik.touched.verify && formik.errors.verify}
                        </span>
                    </FormGroup>
                    {isResetted && <Button type="submit">Submit</Button>}
                </FormControl>
            </form>
        ),
    }
}


export const VerifyConditionsDialog = () => {

    const verifyConditions = useVerifyConditionsForm();

    return (
        <DepositDialogWithButtons spacing={3}>
            <Grid item sx={{ width: "100%", margin: "auto" }}>
                {verifyConditions.formElement}
            </Grid>
            <>
            </>
        </DepositDialogWithButtons >
    );
};