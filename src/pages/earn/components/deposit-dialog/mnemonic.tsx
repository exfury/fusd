import React from "react";
import { DepositDialogWithButtons } from "@libs/neumorphism-ui/components/DialogWithButtons";
import { Button, Divider, Grid } from "@mui/material";
import { TextInput } from "@libs/neumorphism-ui/components/TextInput";
import { FormComponent } from "./formLayout";
import { DialogProps, OpenDialog } from "@libs/use-dialog";


interface FormParams<P, T> {
    words: string[],
    formDialog: [Promise<T>, React.ReactNode],
}

export function MnemonicDialog<P, T>({ words, formDialog, closeDialog }: DialogProps<FormParams<P, T>, T>) {

    formDialog[0].then((value) => closeDialog(value));

    function copyWords() {
        navigator.clipboard.writeText(words.join(' '))
    }
    return (
        <DepositDialogWithButtons spacing={3}>
            <Grid item xs={12}>
                <strong>
                    Those {words.length} words (also named <i>mnemonic</i>)
                    represent your account.
                </strong>
                <br />
                <strong>
                    Please keep those words somewhere, you will use them to
                    recover your account
                </strong>
            </Grid>
            <Grid item sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
                <Grid container spacing={2} sx={{ padding: 1 }}>
                    {words.map(function (word, i) {
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
                    onClick={copyWords}
                >
                    Copy all words
                </Button>
            </Grid>
            <Divider flexItem sx={{ width: "100%", borderColor: "white" }} />

            <Grid item sx={{ width: "100%", margin: "auto" }}>
                {formDialog[1]}
            </Grid>
        </DepositDialogWithButtons >
    );
}