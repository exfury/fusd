import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    styled,
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { DepositDialogWithButtons } from '@libs/neumorphism-ui/components/DialogWithButtons'
import { DialogProps } from '@libs/use-dialog'
import { AccountCreationTitle } from './mnemonic'

const validationSchema = yup.object({
    verify: yup
        .bool()
        .oneOf(
            [true],
            'You have to accept this final message. This is very important'
        ),
})

export interface VerifyConditionsParams {
    className?: string | undefined
}

function VerifyConditionsDialogBase({ closeDialog, className }: DialogProps<VerifyConditionsParams, boolean>) {

    const formik = useFormik({
        initialValues: {
            verify: false,
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            closeDialog(true)
        },
    })

    useEffect(() => {
        if (formik.isValid && formik.dirty) {
            formik.submitForm()
        }
    }, [formik, formik.dirty, formik.isValid, formik.submitForm])

    return (

        <DepositDialogWithButtons className={className} spacing={3} title={<AccountCreationTitle progress={75} />} closeDialog={() => closeDialog(false)}>
            <>
            </>
            <Grid item sx={{ width: "100%", margin: "auto" }}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl
                        sx={{ width: '100%', padding: '0px 20px', gap: 2, display: "flex", justifyContent: "center", alignItems: "center" }}
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
                        <Button type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ maxWidth: "400px" }}>Submit</Button>
                    </FormControl>
                </form>
            </Grid>
        </DepositDialogWithButtons >

    )
}

export const VerifyConditionsDialog = styled(VerifyConditionsDialogBase)`
@media (max-width: 700px) {
    .dialog-content{
        margin-left: 10px !important;
        margin-right: 10px !important;
    }
}
`
