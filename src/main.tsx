import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { zkSync, sepolia } from 'viem/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    [zkSync, sepolia],
    [alchemyProvider({ apiKey: 'yg_blwdfJFZL3aFZfYRBoDeDBsPPis8p' }), publicProvider()]
);

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
