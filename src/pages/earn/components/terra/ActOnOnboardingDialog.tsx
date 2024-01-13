
import React, { useEffect, useMemo, useState } from 'react';
import { DialogProps } from '@libs/use-dialog';
import { OnBoardingTx } from '@anchor-protocol/app-provider/queries/on-boarding/fetchOnBoardingTxs';
import { DepositDialogWithButtons } from '@libs/neumorphism-ui/components/DialogWithButtons';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { demicrofy, formatOutput } from '@anchor-protocol/formatter';
import { TxHashLink as TxHashLinkBase } from 'components/links/TxHashLink';
import styled from 'styled-components';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { Box, IconButton, Modal } from '@mui/material';
import { Mail, Telegram, Twitter } from '@mui/icons-material';
import { useLoadingDialog } from './LoadingDialog';
import { askForFeeGrant } from '@anchor-protocol/app-provider/queries/on-boarding/askForFeeGrant';
import { simulateFetch } from '@libs/query-client';
import { useApp } from '@libs/app-provider/contexts/app';
import { useAnchorBank, useAnchorWebapp, useEarnDepositTx, useNetwork } from '@anchor-protocol/app-provider';
import { useAccount } from 'contexts/account';
import { Coin, Coins, MsgExecuteContract } from '@terra-money/feather.js';
import big from "big.js";
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { BroadcastTxStreamResult } from '../types';
import { StreamStatus } from '@rx-stream/react';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { Gas, Luna, u } from '@libs/types';
import { TxStreamPhase } from '@libs/app-fns';


export interface FormParams {
    txs: Promise<OnBoardingTx[]> | OnBoardingTx[];
    beforeDeposit: boolean
}

export type OnBoardingReturn = OnBoardingTx | null;


export function ActOnOnboardingDialog({ txs, beforeDeposit, closeDialog }: DialogProps<FormParams, OnBoardingReturn>): React.JSX.Element {

    const [txsToDisplay, setTxs] = useState<OnBoardingTx[]>([]);
    const [openLoadDialog, loadDialog] = useLoadingDialog<boolean>();
    const [openSimulateDialog, simulateDialog] = useLoadingDialog<number | undefined>();

    const { lcdClient } = useNetwork();
    const { gasPrice, constants } = useApp();
    const { queryClient, contractAddress } = useAnchorWebapp();
    const { pubkey, terraWalletAddress } = useAccount();
    const {
        tokenBalances: { uUST },
    } = useAnchorBank();

    const [deposit, depositTxResult] = useEarnDepositTx(contractAddress.admin.feeAddress);

    const [txToDeposit, setTxToDeposit] = useState<null | OnBoardingTx>(null);

    const renderBroadcastTx = useMemo(() => {

        return (
            <TxResultRenderer
                resultRendering={(depositTxResult as BroadcastTxStreamResult).value}
                onExit={(status: TxStreamPhase) => {
                    if (status == TxStreamPhase.SUCCEED) {
                        closeDialog(txToDeposit)
                        return;
                    }
                    closeDialog(null)
                }}
            />
        );
    }, [closeDialog, depositTxResult, txToDeposit]);

    useEffect(() => {
        // If is Promise
        if (!Array.isArray(txs)) {
            txs.then((v) => setTxs(v))
        } else {
            setTxs(txs)
        }
    }, [txs])

    const title = beforeDeposit ? "Unresolved Deposits" : "Finalize Deposit on Cavern";

    const text = beforeDeposit ?
        "We display here the past deposits with credit cards that you made that didn't result in a Cavern Deposit."
        : "";

    const onSubmitDeposit = async (tx: OnBoardingTx) => {
        if (!terraWalletAddress || !queryClient || !tx.kado_amount || !deposit) {
            return null
        }

        // Take minimum for the depositAmount
        const depositAmount = big(tx.kado_amount).gte(big(uUST)) ? uUST : tx.kado_amount

        console.log(tx.kado_amount, uUST, depositAmount.toString())

        // We start by loading the fee-grant for the user
        const fee_granted = await openLoadDialog({
            title: "Fee-Grant Permissions",
            text: "Please wait until your wallet is made ready for a deposit",
            promise: askForFeeGrant({
                address: tx.address,
                txhash: tx.tx_hash
            })
        });
        if (!fee_granted) {
            return;
        }

        // We then simulate the transaction
        const msgs = [
            new MsgExecuteContract(
                terraWalletAddress,
                contractAddress.moneyMarket.market,
                {
                    // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/market/src/msg.rs#L65
                    deposit_stable: {},
                },

                // coins
                new Coins([
                    new Coin(
                        contractAddress.native.usd,
                        depositAmount
                    ),
                ])
            ),
        ];

        const gasWanted = await openSimulateDialog({
            title: "Simulation the transaction",
            text: "Please wait until we simulate the transaction to make sure that everything will work before confirming",
            promise: simulateFetch({
                ...queryClient,
                pubkey,
                msgs,
                address: terraWalletAddress,
                lcdClient,
                gasInfo: {
                    gasAdjustment: constants.gasAdjustment,
                    gasPrice: gasPrice,
                }
            })
        });
        if (!gasWanted) {
            throw "Gas Wanted is zero, tx Fee compute error"
        }

        const txFee = Math.ceil(gasWanted * parseFloat(gasPrice.uluna)).toString() as u<Luna>

        setTxToDeposit(tx);

        // We then initiate the deposit transaction
        deposit({
            depositAmount: demicrofy(depositAmount, 6),
            txFee: {
                gasWanted: gasWanted as Gas,
                txFee
            },
        });
    }

    if (
        depositTxResult?.status === StreamStatus.IN_PROGRESS ||
        depositTxResult?.status === StreamStatus.DONE
    ) {
        return (
            <Modal open disableEnforceFocus>
                <Dialog>{renderBroadcastTx}</Dialog>
            </Modal>
        );
    }

    return (
        <DepositDialogWithButtons title={title} closeDialog={() => closeDialog(null)}>
            <Box>
                {text}
                <br />
                You don't see your deposits after a while here ? Please contact us.
                <Box sx={{ display: "inline", marginLeft: "15px" }}>
                    < IconButton
                        component="a"
                        href="https://twitter.com/CavernProtocol"
                        target="_blank"
                        rel="noreferrer"
                        color="primary"
                    >
                        <Twitter />
                    </IconButton >
                    <IconButton
                        component="a"
                        href="https://t.me/cavernprotocolofficial"
                        target="_blank"
                        color="primary"
                        rel="noreferrer"
                    >
                        <Telegram />
                    </IconButton>
                    <IconButton
                        component="a"
                        href="mailto:cavern.protocol@gmail.com"
                        target="_blank"
                        color="primary"
                        rel="noreferrer"
                    >
                        <Mail />
                    </IconButton>
                </Box >
                <br />
                {beforeDeposit && "Close this dialog if you want to make an additional deposit"}

            </Box >
            <HorizontalScrollTable minWidth={400} >
                <colgroup>
                    <col style={{ width: 200 }} />
                    <col style={{ width: 200 }} />
                    <col style={{ width: 200 }} />
                    <col style={{ width: 250 }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>
                            Transaction Hash
                        </th>
                        <th>
                            <IconSpan>
                                USD Value{' '}
                                <InfoTooltip>
                                    USD Amount available to deposit on Cavern Protocol
                                </InfoTooltip>
                            </IconSpan>
                        </th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {txsToDisplay.map((tx, i) => {
                        const date = new Date(Date.parse(tx.timestamp));
                        return (
                            <tr key={i}>
                                <td>
                                    <TxHashLink txHash={tx.tx_hash} />
                                </td>
                                <td >
                                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                                        <div className="value">{formatOutput(demicrofy(tx.kado_amount!, 6))} axlUSDC</div>
                                        <i>
                                            <TokenIcon
                                                token="ust"
                                            />
                                        </i></Box>
                                </td>
                                <td>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                        <Box>
                                            {date.toLocaleDateString()}
                                        </Box>
                                        <Box sx={{ fontSize: "0.86em" }}>
                                            {date.toLocaleTimeString()}
                                        </Box>
                                    </Box>
                                </td>
                                <td>
                                    <BorderButton sx={{ padding: "0px 20px" }} onClick={() => onSubmitDeposit(tx)}>
                                        Deposit on Cavern
                                    </BorderButton>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </HorizontalScrollTable>

            {loadDialog}
            {simulateDialog}
        </DepositDialogWithButtons >
    );
}

export const TxHashLink = styled(TxHashLinkBase)`
    color: ${({ theme }) => theme.textColor};
    font-size: 0.9em
`