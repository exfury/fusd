import { useNetwork } from '@anchor-protocol/app-provider';
import { truncate } from '@libs/formatter';
import React from 'react';
import { getTransactionDetailUrl } from 'utils/terrascope';

export interface TxHashProps {
  txHash: string;
  className?: string
}

export function TxHashLink({ txHash, className }: TxHashProps) {
  const { network } = useNetwork();
  return (
    <a
      href={getTransactionDetailUrl(network.name, txHash)}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {truncate(txHash)}
    </a>
  );
}
