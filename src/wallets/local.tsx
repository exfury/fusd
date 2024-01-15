import Connector from "@walletconnect/core"
import {
    ConnectResponse,
    Wallet,
} from "@terra-money/wallet-interface"
import { CreateTxOptions, LCDClient, MnemonicKey, SimplePublicKey, Wallet as TerraWallet, Tx, WaitTxBroadcastResult } from "@terra-money/feather.js"
import { AllLCDClients, MAINNET } from "@anchor-protocol/app-provider"
import { hasMnemonic, saveMnemonic } from "wallets/logic/storage";
import { PostResponse } from "@terra-money/wallet-kit";

export enum EventTypes {
    NetworkChange = "networkChange",
    WalletChange = "walletChange",
    Disconnect = "disconnect",
    Connect = "connect",
    Connected = "connected"
}

export const LOCAL_WALLET_ID = "cavern-local-wallet";

export default class LocalWallet implements Wallet {
    private _key: MnemonicKey | undefined = undefined
    private _connector: Connector | null = null
    private _connected = false;
    private _listener: Record<string, () => void[]> = {};
    private _promiseListeners: Record<string, ((data: any) => Promise<void>)[]> = {};
    private _justCreated: boolean;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        this._justCreated = true;
    }

    async info() {
        return {
            [MAINNET.chainID]: MAINNET
        }
    }
    closeCreateAccount(password: string, mnemonic: string[]) {
        this._key = new MnemonicKey({
            mnemonic: mnemonic.join(" ")
        });
        if (mnemonic) {
            saveMnemonic(mnemonic, password);
        }
        this._triggerListener(EventTypes.Connected, { address: this.getAddress() });
    }

    closeConnectAccount(mnemonic: string[]) {
        this._key = new MnemonicKey({
            mnemonic: mnemonic.join(" ")
        });
        this._triggerListener(EventTypes.Connected, { address: this.getAddress() });
    }

    connectionError(error?: string) {
        this._triggerListener(EventTypes.Connected, { error });
    }

    async connect() {
        const cachedAddress = this.getAddress();
        const pubKey = await this.getPublicKey();
        if (cachedAddress && pubKey) {
            return {
                addresses: {
                    [MAINNET.chainID]: cachedAddress
                },
                pubkey: {
                    330: pubKey
                },
                id: this.id
            }
        }

        // We notify the listeners that an connect event has triggered
        await this._triggerListener(EventTypes.Connect, {})

        // This returns once they are done
        return new Promise<ConnectResponse & { id?: string }>((resolve, reject) => {
            this.addListener(EventTypes.Connected, async (data: { address: string | null, error: string | null }) => {
                const pubkey = await this.getPublicKey();
                if (!data.address || !pubkey) {
                    reject(data.error)
                } else {
                    resolve({
                        addresses: {
                            [MAINNET.chainID]: data.address,
                        },
                        pubkey: {
                            330: pubkey
                        },
                        id: this.id
                    })
                }
            })
        })
    }

    async getPublicKey(): Promise<string | null> {
        if (!this._key?.publicKey) {
            return null
        }
        const pubkey = this._key.publicKey as SimplePublicKey;
        return pubkey.key
    }

    getChainID(): string {
        return MAINNET.chainID
    }

    getLCD(): LCDClient {
        return AllLCDClients[this.getChainID()]
    }

    getWallet(): TerraWallet {
        if (!this._key) {
            throw "Local Wallet was not connected. Please contact support, something wrong happened"
        }

        return new TerraWallet(this.getLCD(), this._key);
    }

    async getPubkey(): Promise<ConnectResponse> {
        if (this._key && this._key.publicKey) {
            return {
                addresses: {
                    [MAINNET.chainID]: this.getAddress()!,
                },
                pubkey: {
                    330: this._key.publicKey.toJSON()
                }
            }
        }
        throw "Account is not connected"
    }


    async disconnect() {
        this._key = undefined
    }

    async post(tx: CreateTxOptions): Promise<PostResponse> {
        const signedTx = await this.sign(tx);
        const broadcastResult = await this.getLCD().tx.broadcast(signedTx, this.getChainID()) as WaitTxBroadcastResult & { code: number };

        if (broadcastResult.code != 0) {
            throw `Transaction failed : ${broadcastResult.raw_log}`
        }
        return broadcastResult
    }

    async sign(tx: CreateTxOptions): Promise<Tx> {

        const wallet = this.getWallet();

        const response = await wallet.createAndSignTx(tx)
        return response
    }

    private _listeners: Record<string, ((e: any) => void)[]> = {}

    addListener(event: EventTypes, cb: (data: any) => void) {
        this._listeners[event] = [...(this._listeners[event] ?? []), cb]
    }

    removeListener(event: EventTypes, cb?: (data: any) => void) {
        this._listeners[event]?.filter((callback) => cb !== callback)
    }

    private async _triggerListener(event: EventTypes, data: any) {
        this._listeners[event]?.forEach((cb) => cb(data))
    }

    getAddress(): string | undefined {
        return this._key?.accAddress(MAINNET.prefix);
    }

    isInstalled = true

    id = LOCAL_WALLET_ID

    details = {
        name: hasMnemonic() ? "Log in" : "Create an Account",
        icon: "https://cavernprotocol.com/logo.png",
        website: "https://cavernprotocol.com",
    }
}