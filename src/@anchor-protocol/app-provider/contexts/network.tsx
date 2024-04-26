import { LCDClient, LCDClientConfig } from '@terra-money/feather.js';
import { createContext, useContext } from 'react';

export type CavernNetworkInfo = LCDClientConfig & { name: string, chainName: string };


export const TESTNET: CavernNetworkInfo = {
  name: "testnet",
  chainID: 'pisco-1',
  lcd: 'https://pisco-lcd.erisprotocol.com/',
  prefix: "terra",
  gasAdjustment: 1.6,
  gasPrices: "0.015uluna",
  chainName: "terra2",
};

export const CLASSIC: CavernNetworkInfo = {
  name: "classic",
  chainID: 'columbus-5',
  lcd: 'https://columbus-lcd.terra.dev',
  prefix: "terra",
  gasAdjustment: 1.6,
  gasPrices: "0.015uluna",
  chainName: "terra",
};

export const MAINNET: CavernNetworkInfo = {
  name: "mainnet",
  chainID: 'furya-1',
  lcd: 'https://api.furya.xyz/',
  prefix: "furya",
  gasAdjustment: 1.6,
  gasPrices: "28.325ufury",
  chainName: "furya",
};

export const AllLCDClients: Record<string, LCDClient> = {
  [TESTNET.chainID]: new LCDClient({
    [TESTNET.chainID]: TESTNET,
  }),
  [MAINNET.chainID]: new LCDClient({
    [MAINNET.chainID]: MAINNET,
  }),
  [CLASSIC.chainID]: new LCDClient({
    [CLASSIC.chainID]: CLASSIC,
  }),
}

const RPCClients: Record<string, string> = {
  [TESTNET.chainID]: "https://pisco-rpc.erisprotocol.com/",
  [MAINNET.chainID]: `https://rpc.furya.xyz/`,
}

export const NetworkContext = createContext<CavernNetworkInfo>(MAINNET);

type UseNetworkReturn = {
  network: CavernNetworkInfo;
  lcdClient: LCDClient;
  rpcClient: string;
};

const useNetwork = (): UseNetworkReturn => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('The NetworkContext has not been defined.');
  }
  return {
    network: context,
    lcdClient: AllLCDClients[context.chainID ?? MAINNET.chainID],
    rpcClient: RPCClients[context.chainID ?? MAINNET.chainID],
  };
};

export { useNetwork };
