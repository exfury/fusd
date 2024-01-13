
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
import { Box, Divider, Grid, IconButton, Modal, Tooltip, Table, TableBody, TableContainer, TableHead, TableRow, TableCell } from '@mui/material';
import { HelpOutline, Mail, Telegram, Twitter } from '@mui/icons-material';
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
import { useMediaQuery } from 'react-responsive';


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

    const isVerySmall = useMediaQuery({ maxWidth: 700 });

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
        <DepositDialogWithButtons title={
            <Box sx={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "center" }}>
                {title}
                <Tooltip title={text}>
                    <HelpOutline
                        aria-label="help"
                        sx={{ fontSize: 15, cursor: "pointer" }}
                    />
                </Tooltip>
            </Box>
        } closeDialog={() => closeDialog(null)}>
            <Box>
                {beforeDeposit && "Close this dialog if you want to make an additional deposit"}
            </Box >
            {!isVerySmall && <TableContainer style={{ maxHeight: 300, overflow: 'scroll' }}>
                <Table
                    sx={{ minWidth: 550, padding: '0px' }}
                    aria-label="simple table"
                    stickyHeader
                >
                    <TableHead>
                        <TableRow>
                            <TitleStyleCell className="table-header">Transaction Hash</TitleStyleCell>
                            <TitleStyleCell align="right" className="table-header">
                                USD Value
                            </TitleStyleCell>
                            <TitleStyleCell align="right" className="table-header">
                                Date
                            </TitleStyleCell>
                            <TitleStyleCell align="right" className="table-header">
                                Action
                            </TitleStyleCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {txsToDisplay.map((tx, index: number) => {
                            const date = new Date(Date.parse(tx.timestamp));

                            return (
                                <TableRow
                                    key={`${tx.timestamp}-${index}`}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledCell scope="row">
                                        <TxHashLink txHash={tx.tx_hash} />
                                    </StyledCell>
                                    <StyledCell align="right">
                                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                                            <div className="value">{formatOutput(demicrofy(tx.kado_amount!, 6))} axlUSDC</div>
                                            <i>
                                                <TokenIcon
                                                    token="ust"
                                                />
                                            </i></Box>
                                    </StyledCell>
                                    <StyledCell align="right">
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <Box>
                                                {date.toLocaleDateString()}
                                            </Box>
                                            <Box sx={{ fontSize: "0.86em" }}>
                                                {date.toLocaleTimeString()}
                                            </Box>
                                        </Box>
                                    </StyledCell>
                                    <StyledCell align="right">
                                        <BorderButton sx={{ padding: "0px 20px" }} onClick={() => onSubmitDeposit(tx)}>
                                            Deposit on Cavern
                                        </BorderButton>
                                    </StyledCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>}




            {isVerySmall &&
                <Grid container sx={{ padding: "16px 16px", maxHeight: "300px", marginTop: "10px", marginLeft: 0, overflowY: "scroll" }} gap={3}>

                    {txsToDisplay.map((tx, index) => {
                        const date = new Date(Date.parse(tx.timestamp));
                        return (<Grid container spacing={2} key={index}>
                            <Grid item xs={6}>
                                Time
                            </Grid>
                            <Grid item xs={6} sx={{ fontWeight: "bold" }}>
                                <Box>
                                    {date.toLocaleDateString()}
                                </Box>
                                <Box sx={{ fontSize: "0.86em" }}>
                                    {date.toLocaleTimeString()}
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                USDC deposited
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                                    <div className="value">{formatOutput(demicrofy(tx.kado_amount!, 6))} axlUSDC</div>
                                    <i>
                                        <TokenIcon
                                            token="ust"
                                        />
                                    </i>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                Transaction Hash
                            </Grid>
                            <Grid item xs={6} >
                                <TxHashLink txHash={tx.tx_hash} />
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: "center" }}>
                                <BorderButton sx={{ padding: "0px 20px" }} onClick={() => onSubmitDeposit(tx)}>
                                    Deposit on Cavern
                                </BorderButton>
                            </Grid>
                            <Grid item xs={12}>
                                {index != (txsToDisplay.length - 1) && <Divider orientation="horizontal" flexItem variant="middle" sx={{ backgroundColor: "white" }} />}
                            </Grid>
                        </Grid>

                        )
                    })}
                </Grid>
            }

            You don't see your deposits after a while here ? Please contact us.
            <br />
            <Box sx={{ marginLeft: "15px", textAlign: "center" }}>
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
            {loadDialog}
            {simulateDialog}
        </DepositDialogWithButtons >
    );
}

const TxHashLink = styled(TxHashLinkBase)`
    color: ${({ theme }) => theme.textColor};
    font-size: 0.9em
`

const StyledCell = styled(TableCell)`
    padding: 20px 0px !important;
    font-size: 1em !important;
    text-align: center !important;
`

const TitleStyleCell = styled(StyledCell)`

  background-color:${({ theme }) => theme.sectionBackgroundColor} !important;
`