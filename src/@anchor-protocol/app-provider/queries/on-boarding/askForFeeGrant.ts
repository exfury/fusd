import { UST, u } from "@libs/types"
import { SERVER_BASE_ADDRESS } from ".";
import { string } from "prop-types";

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
function feeGrantServerURL (address: string){
    return `${SERVER_BASE_ADDRESS}/fee-grant/${address}`
}

export async function askForFeeGrant({address}: FeeGrantParams): Promise<void>{

    const fetched = await fetch(feeGrantServerURL(address), {
        method: "POST",
    } )

    if(!fetched.ok){
        throw `Failed asking for a fee Grant. Got error : ${await fetched.text()}`
    }

}