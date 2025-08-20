import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WagmiConfig, createClient, configureChains } from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { defineChain } from 'viem';
import { zkSync } from 'viem/chains';

export const sepTestNet = defineChain({
    id: 360,
    name: 'Layer 69',
    nativeCurrency: { name: 'sep', symbol: 'L1T', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://mainnet.shape.network/'] }
    },
    blockExplorers: {
        default: {
            name: 'Rainbow Road',
            url: 'https://shapescan.xyz/'
        }
    }
});
// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    [zkSync],
    [publicProvider()]
);
console.log(chains);
// Set up client
const client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    provider,
    webSocketProvider
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiConfig client={client}>
            <App />
        </WagmiConfig>
    </React.StrictMode>
);
