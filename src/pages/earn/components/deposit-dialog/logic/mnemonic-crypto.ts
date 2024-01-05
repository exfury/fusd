import encryptRaw from './encrypt'
import decryptRaw from './decrypt'

export type MnemonicStore = string[]

export function encrypt(mnemonic: MnemonicStore, pass: string) {
    return encryptRaw(JSON.stringify(mnemonic), pass)
}

export function decrypt(encryptedMessage: string, pass: string) {
    const decrypted = decryptRaw(encryptedMessage, pass)
    return JSON.parse(decrypted)
}
