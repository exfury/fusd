import { UST, u } from "@libs/types"
import { SERVER_BASE_ADDRESS } from ".";

export interface OnBoardingTx{
    id: number,
    address: string,
    tx_hash: string,
    kado_amount: u<UST> | undefined,
    tx_events: any
    timestamp: string,
    has_fee_grant: boolean,
    executed: boolean,
}

export interface FeeGrantParams{
    address: string,
    txhash: string,
}
function indicateExecutedServerURL (address: string, txhash: string){
    return `${SERVER_BASE_ADDRESS}/executed/${address}/${txhash}`
}

export async function indicateOnboardingExecuted({address, txhash}: FeeGrantParams): Promise<void>{

    const fetched = await fetch(indicateExecutedServerURL(address, txhash), {
        method: "POST",
    } )

    if(!fetched.ok){
        throw `Failed asking for a fee Grant. Got error : ${await fetched.text()}`
    }

}