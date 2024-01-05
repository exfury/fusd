import { FormControl, Grid } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { FormComponent, FormComponentProps } from './formLayout'

import { DepositDialogWithButtons } from "@libs/neumorphism-ui/components/DialogWithButtons";
import { Divider } from "@mui/material";
import { TextInput } from "@libs/neumorphism-ui/components/TextInput";

function getWordName(i: number) {
    return `word-${i}`
}

export function useVerifyMnemonicForm(
    mnemonic: string[],
    props?: FormComponentProps
): FormComponent<boolean> {
    const [verified, setVerified] = useState(false)
    const [success, setSuccess] = useState(false)

    const formik = useFormik({
        initialValues: mnemonic.reduce((obj, _current, index) => {
            obj[getWordName(index)] = ''
            return obj
        }, {} as Record<string, string>),
        validationSchema: yup.object(
            mnemonic.reduce((obj, current, index) => {
                obj[getWordName(index)] = yup
                    .string()
                    .required('Required word')
                    .oneOf([current], 'Wrong word')
                return obj
            }, {} as Record<string, yup.StringSchema>)
        ),
        onSubmit: () => {
            setVerified(true)
            setSuccess(true)
        },
        validateOnMount: true,
    })

    useEffect(() => {
        if (props?.autoSubmit && formik.isValid && formik.dirty) {
            formik.submitForm()
            toast.success('Mnemonic Verified Successfully')
        }
    }, [props?.autoSubmit, formik.dirty, formik.isValid, formik.submitForm, formik])

    function handlePaste(event: React.ClipboardEvent) {
        const words: string[] = event.clipboardData.getData('text').split(' ')
        formik.setValues(
            words.reduce((obj, current, index) => {
                obj[getWordName(index)] = current
                return obj
            }, {} as Record<string, string>)
        )
        event.preventDefault()
    }

    return {
        success,
        onSubmitValue: verified,
        reset: () => {
            setSuccess(false), setVerified(false)
        },
        formElement: (
            <form onSubmit={formik.handleSubmit} className="form-element">
                <FormControl
                    sx={{ width: '100%', padding: '0px 20px', gap: 2 }}
                >
                    <Grid container spacing={3} sx={{ padding: 1 }}>
                        {mnemonic.map((_, i) => {
                            return (
                                <Grid
                                    item
                                    xs={3}
                                    key={`verify-mnemonic-word - ${i}`}
                                >
                                    <TextInput
                                        label={`Word ${i + 1}`}
                                        size="small"
                                        InputProps={{
                                            style: {
                                                padding: 0,
                                            },
                                        }}
                                        id={getWordName(i)}
                                        type="text"
                                        name={getWordName(i)}
                                        value={formik.values[getWordName(i)]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched[getWordName(i)] &&
                                            Boolean(
                                                formik.errors[getWordName(i)]
                                            )
                                        }
                                        onPaste={handlePaste}
                                        helperText={
                                            (formik.touched[getWordName(i)] as
                                                | boolean
                                                | undefined) &&
                                            (formik.errors[getWordName(i)] as
                                                | string
                                                | undefined)
                                        }
                                    />
                                </Grid>
                            )
                        })}
                    </Grid>
                </FormControl>
            </form>
        ),
    }
}

export interface VerifyMnemonicProps {
    words: string[]
}

export const VerifyMnemonicDialog = ({ words }: VerifyMnemonicProps) => {

    const verifyMnemonic = useVerifyMnemonicForm(words);

    return (
        <DepositDialogWithButtons spacing={3}>
            <Grid item xs={12}>
                We just want to verify here that your mnemonic is safely stored.
                <br />
                After this step, this platform will <strong>NEVER</strong> ask for
                this mnemonic again !
            </Grid>
            <Divider flexItem sx={{ width: "100%", borderColor: "white" }} />

            <Grid item sx={{ width: "100%", margin: "auto" }}>
                {verifyMnemonic.formElement}
            </Grid>
        </DepositDialogWithButtons >
    );
};