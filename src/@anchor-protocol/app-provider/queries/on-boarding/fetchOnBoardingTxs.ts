import { UST, u } from "@libs/types"
import { SERVER_BASE_ADDRESS } from ".";
import { useEffect, useMemo, useState } from "react";
import { UseQueryResult, useQuery } from "react-query";
import { createQueryFn, createSimpleQueryFn } from "@libs/react-query-utils";
import { ANCHOR_QUERY_KEY } from "@anchor-protocol/app-provider/env";
import toast from "react-hot-toast";

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

const ONBOARDING_ROUTES = {
    onboarding:"txs",
    index: "index",
    txCount: "tx-count",
    txTotal: "tx-total"
}


function onboardingServerURL (address: string, route_type: keyof typeof ONBOARDING_ROUTES){
    return `${SERVER_BASE_ADDRESS}/${ONBOARDING_ROUTES[route_type]}/${address}`
}

export async function fetchOnBoardingTxs(walletAddress: string): Promise<OnBoardingTx[]>{

    const txs = await fetch(onboardingServerURL(walletAddress, "onboarding"), {
        signal: AbortSignal.timeout( 5000 ),
      } );
    const txs_json = await txs.json() as OnBoardingTx[]
    console.group(txs_json)

    return txs_json;
}

export async function fetchIndexWallet(walletAddress: string): Promise<void>{
    await fetch(onboardingServerURL(walletAddress, "index"));
}


export async function fetchIndexedTxs(walletAddress: string): Promise<number>{
    const response = await fetch(onboardingServerURL(walletAddress, "txCount"));
    return await response.json() as number
}

export async function fetchTotalTxs(walletAddress: string): Promise<number>{
    const response = await fetch(onboardingServerURL(walletAddress, "txTotal"));
    return await response.json() as number
}



export function useFetchIndexHelper(address: string | undefined):{
    totalTxs: number | undefined,
    currentCount: UseQueryResult<number, unknown>
    indexPromise: Promise<void> | undefined
}{
    const [indexResolved, setIndexResolved] = useState(false);
    const [currentCount, setCurrentCount] = useState<undefined|number>()

    const indexQuery = useMemo(()=>{
        if(!address){
            return undefined
        }
        return fetchIndexWallet(address).then(()=> setIndexResolved(true));
    } ,[address, setIndexResolved]);

    const totalQuery = useQuery( [
        ANCHOR_QUERY_KEY.TOTAL_ONBOARDING_TX_INDEX,
        address!
    ],
    createSimpleQueryFn(fetchTotalTxs),
    {
        enabled: !!address && !indexResolved
    })
    const currentCountQuery = useQuery( [
        ANCHOR_QUERY_KEY.ONBOARDING_TX_INDEX_COUNT,
        address!
    ],
    createSimpleQueryFn(fetchIndexedTxs),
    {
        enabled: !!address && !indexResolved,
        refetchInterval: 5000,
        onSuccess: (count)=>{
            if(count != currentCount){
                if(totalQuery.status =="success"){
                    if(count != totalQuery.data){
                        toast.loading(`Indexing transactions (${count ?? "?"}/${totalQuery.data ?? "?"})`, {
                            duration: 3000
                        });
                    }else{
                        toast.success(`All transactions indexed`, {
                            duration: 3000
                        });
                    }
                }
                setCurrentCount(count)
            }
        }   

    })    

    return {
        totalTxs: totalQuery.data,
        currentCount: currentCountQuery,
        indexPromise: indexQuery
    }
}
