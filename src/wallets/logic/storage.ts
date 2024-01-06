import { MnemonicStore, decrypt, encrypt } from './mnemonic-crypto'

const MNEMONIC_STORAGE_KEY = 'ONBOARDING-MNEMONIC-STORE'

export function saveMnemonic(mnemonic: MnemonicStore, pass: string) {
    const encrypted = encrypt(mnemonic, pass)
    localStorage.setItem(MNEMONIC_STORAGE_KEY, encrypted)
}

export function getMnemonic(pass: string): MnemonicStore | null {
    const encrypted = localStorage.getItem(MNEMONIC_STORAGE_KEY)
    if (!encrypted) {
        return null
    }
    return decrypt(encrypted, pass)
}

export function deleteMnemonic() {
    localStorage.removeItem(MNEMONIC_STORAGE_KEY)
}

export function hasMnemonic(): boolean {
    return !!localStorage.getItem(MNEMONIC_STORAGE_KEY)
}
