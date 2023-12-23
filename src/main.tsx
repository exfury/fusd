import React from 'react';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import TerraStationMobileWallet from '@terra-money/terra-station-mobile';
import { getInitialConfig, WalletProvider } from '@terra-money/wallet-kit';
import { createRoot } from 'react-dom/client';
import AddressViewerWallet from 'wallets/viewer';
import LocalWallet from 'wallets/local';

const container = document.getElementById('root');
const root = createRoot(container!);
getInitialConfig().then((defaultNetworks) => {

    const viewer_wallet = new AddressViewerWallet();
    const local_wallet = new LocalWallet();

    root.render(
        <WalletProvider
            extraWallets={[
                new TerraStationMobileWallet(),
                viewer_wallet,
                local_wallet
            ]}
            defaultNetworks={defaultNetworks}
        >
            <App viewer_wallet={viewer_wallet} local_wallet={local_wallet} />
        </WalletProvider>
    );
});
reportWebVitals();





