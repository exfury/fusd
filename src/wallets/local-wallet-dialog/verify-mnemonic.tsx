import { Button, FormControl, Grid, styled } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import { DepositDialogWithButtons } from "@libs/neumorphism-ui/components/DialogWithButtons";
import { Divider } from "@mui/material";
import { TextInput } from "@libs/neumorphism-ui/components/TextInput";
import { DialogProps } from '@libs/use-dialog'
import { AccountCreationTitle } from './mnemonic'

function getWordName(i: number) {
    return `word-${i}`
}

export interface VerifyMnemonicParams {
    className?: string | undefined,
    words: string[]
}

const VERIFY_WORDS = [1, 6, 9, 16, 21, 22];

function VerifyMnemonicDialogBase(
    { closeDialog, words, className }: DialogProps<VerifyMnemonicParams, boolean>
) {


    const formik = useFormik({
        initialValues: VERIFY_WORDS.reduce((obj, current) => {
            obj[getWordName(current)] = ''
            return obj
        }, {} as Record<string, string>),
        validationSchema: yup.object(
            VERIFY_WORDS.reduce((obj, current) => {
                obj[getWordName(current)] = yup
                    .string()
                    .required('Required')
                    .oneOf([words[current]], 'Wrong')
                return obj
            }, {} as Record<string, yup.StringSchema>)
        ),
        onSubmit: () => {
            closeDialog(true)
        },
        validateOnMount: true,
    })

    useEffect(() => {
        if (formik.isValid && formik.dirty) {
            formik.submitForm()
        }
    }, [formik.dirty, formik.isValid, formik.submitForm, formik])

    return (

        <form onSubmit={formik.handleSubmit} className="form-element">
            <DepositDialogWithButtons className={className} spacing={3} title={<AccountCreationTitle progress={50} />} closeDialog={() => {
                closeDialog(false)
            }}>
                <Grid item xs={12}>
                    We just want to verify here that your mnemonic is safely stored.
                    <br />
                    We are only asking for some of the words, because that would be tiring to type the whole thing.
                    After this step, this platform will <strong>NEVER</strong> ask for
                    this mnemonic again !
                </Grid>
                <Divider flexItem sx={{ width: "100%", borderColor: "white" }} />

                <Grid item sx={{ width: "100%", margin: "auto" }}>
                    <FormControl
                        sx={{ width: '100%', padding: '0px', gap: 2, display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "8px" }}
                    >
                        <Grid container spacing={3} sx={{ padding: 1 }}>
                            {VERIFY_WORDS.map((word_index) => {
                                return (
                                    <Grid
                                        item
                                        xs={4}
                                        sm={4}
                                        key={`verify-mnemonic-word - ${word_index}`}
                                    >
                                        <TextInput
                                            label={`Word ${word_index + 1}`}
                                            size="small"
                                            InputProps={{
                                                style: {
                                                    padding: 0,
                                                },
                                            }}
                                            id={getWordName(word_index)}
                                            type="text"
                                            name={getWordName(word_index)}
                                            value={formik.values[getWordName(word_index)]}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched[getWordName(word_index)] &&
                                                Boolean(
                                                    formik.errors[getWordName(word_index)]
                                                )
                                            }
                                            helperText={
                                                (formik.touched[getWordName(word_index)] as
                                                    | boolean
                                                    | undefined) &&
                                                (formik.errors[getWordName(word_index)] as
                                                    | string
                                                    | undefined)
                                            }
                                        />
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Button type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ maxWidth: "400px" }}>Submit</Button>
                    </FormControl>
                </Grid>
            </DepositDialogWithButtons >
        </form>
    )
}

export const VerifyMnemonicDialog = styled(VerifyMnemonicDialogBase)`

    @media (max-width: 700px) {
        .dialog-content{
            margin-left: 10px !important;
            margin-right: 10px !important;
        }
        .MuiGrid-item{
            padding-left:3px !important;
        }
    }

`
