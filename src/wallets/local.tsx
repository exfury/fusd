import Connector from "@walletconnect/core"
import {
    ConnectResponse,
    Wallet,
} from "@terra-money/wallet-interface"
import { CreateTxOptions, MnemonicKey } from "@terra-money/feather.js"
import { MAINNET } from "@anchor-protocol/app-provider"
import { hasMnemonic, saveMnemonic } from "wallets/logic/storage";
import { getKey, getWallet } from "./logic/mnemonic-crypto";

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

    async connect() {
        const cachedAddress = this.getAddress();
        if (cachedAddress) {
            return {
                addresses: {
                    [MAINNET.chainID]: cachedAddress
                },
                id: this.id
            }
        }

        // We notify the listeners that an connect event has triggered
        this._triggerListener(EventTypes.Connect, {});

        // This returns once they are done
        return new Promise<ConnectResponse & { id?: string }>((resolve, reject) => {
            this.addListener(EventTypes.Connected, (data: { address: string | null }) => {
                if (!data.address) {
                    resolve({ addresses: {} })
                } else {
                    resolve({
                        addresses: {
                            [MAINNET.chainID]: data.address,
                        },
                        id: this.id
                    })
                }
            })
        })
    }

    async disconnect() {
        this._key = undefined
    }

    async post(tx: CreateTxOptions) {

        throw "You can't submit a transaction using the Address viewer"
        return {} as any
    }

    async sign(_: CreateTxOptions) {
        throw "You can't submit a transaction using the Address viewer"
        return {} as any
    }

    private _listeners: Record<string, ((e: any) => void)[]> = {}

    addListener(event: EventTypes, cb: (data: any) => void) {
        this._listeners[event] = [...(this._listeners[event] ?? []), cb]
    }

    removeListener(event: EventTypes, cb?: (data: any) => void) {
        this._listeners[event]?.filter((callback) => cb !== callback)
    }

    private _triggerListener(event: EventTypes, data: any) {
        console.log(this._listeners)
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