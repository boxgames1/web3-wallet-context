export const projectChainInfo = {
    polygon: {
        chainNamespace: 'eip155',
        rpcTarget: 'https://polygon-rpc.com',
        blockExplorer: 'https://polygonscan.com/',
        chainId: '0x89',
        displayName: 'Polygon Mainnet',
        ticker: 'matic',
        tickerName: 'Matic',
        decimals: 18,
    },
    mumbai: {
        chainNamespace: 'eip155',
        rpcTarget: 'https://matic-mumbai.chainstacklabs.com',
        blockExplorer: 'https://mumbai.polygonscan.com/',
        chainId: '0x13881',
        displayName: 'Mumbai Testnet',
        ticker: 'matic',
        tickerName: 'Matic',
        decimals: 18,
    },
    goerli: {
        chainNamespace: 'eip155',
        chainId: '0x5', // "0x4", "Ox5"
        rpcTarget: 'https://rpc.ankr.com/eth_goerli', // eth_rinkeby, eth_goerli
        displayName: 'Goerli Testnet',
        blockExplorer: 'https://goerli.etherscan.io/', // rinkeby, goerli
        ticker: 'ETH',
        tickerName: 'Ethereum',
        decimals: 18,
    },
    ethereum: {
        chainNamespace: 'eip155',
        chainId: '0x1',
        rpcTarget: 'https://rpc.ankr.com/eth',
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: 'Ethereum Mainnet',
        blockExplorer: 'https://etherscan.io',
        ticker: 'ETH',
        tickerName: 'Ethereum',
        decimals: 18,
    },
};
