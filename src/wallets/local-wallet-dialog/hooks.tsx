import { DialogProps, useDialog } from "@libs/use-dialog";
import { VerifyConditionsDialog, VerifyConditionsParams } from "./verify-conditions";
import { VerifyMnemonicDialog, VerifyMnemonicParams } from "./verify-mnemonic";
import { MnemonicDialog, MnemonicFormParams } from "./mnemonic";
import { ComponentType } from "react";

export function useVerifyMnemonicDialog() {
    return useDialog<VerifyMnemonicParams, boolean>(VerifyMnemonicDialog)
}

export function useVerifyConditionsDialog() {
    return useDialog<VerifyConditionsParams, boolean>(VerifyConditionsDialog)
}

export function useMnemonicDialog<P, T>() {
    return useDialog<MnemonicFormParams<P, T>, T | null>(MnemonicDialog as unknown as ComponentType<DialogProps<MnemonicFormParams<P, T>, T | null>>)
}
