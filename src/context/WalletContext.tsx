import { useEffect, useState, useContext, createContext } from 'react';
import {
    chainInfo,
    defaultWalletContextValue,
    IWalletTypes,
    IWeb3Wallet,
    WalletContextValues,
} from '../types';
import Web3AuthCoreWallet from '../adapters/Web3AuthCoreWallet';
import CoinbaseWallet from '../adapters/CoinbaseWallet';
import MetamaskWallet from '../adapters/MetamaskWallet';
import WalletConnectWallet from '../adapters/WalletConnect';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SAVED_WALLET_LOCALSTORAGE_KEY } from '../constants/localStorage';

const WalletContext = createContext(defaultWalletContextValue);

export const useWalletContext = () => {
    return useContext(WalletContext);
};
interface WalletProviderProps {
    chainConfig: chainInfo;
    children: React.ReactNode;
}

export const WalletProvider = ({ chainConfig, children }: WalletProviderProps) => {
    const [walletType, setWalletType] = useState<IWalletTypes | null>(null);
    const [web3Wallet, setWeb3Wallet] = useState<IWeb3Wallet | null>(null);

    const [connected, setConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [accountAddress, setAccountAddress] = useState<string | null>(null);
    const [accountBalance, setAccountBalance] = useState<number | null>(null);
    const [torusEmail, setTorusEmail] = useState<string | null>(null);
    const [blockExplorerUrl, setBlockExplorerUrl] = useState<string | null>(null);
    const [savedWalletType, setSavedWalletType] = useLocalStorage<IWalletTypes | null>(
        SAVED_WALLET_LOCALSTORAGE_KEY,
        null
    );

    useEffect(() => {
        if (savedWalletType) {
            setWallet(savedWalletType);
        }
    }, []);

    useEffect(() => {
        if (!connected && web3Wallet !== null) {
            setWeb3Wallet(null);
            setWalletType(null);
        } else {
            setSavedWalletType(walletType as IWalletTypes);
        }
    }, [connected, web3Wallet, walletType]);

    const setWallet = async (walletType: IWalletTypes, isMetamaskMobile: boolean = false) => {
        let walletInstance;

        try {
            switch (walletType) {
                case IWalletTypes.METAMASK:
                    walletInstance = new MetamaskWallet({
                        chainConfig,
                        setConnected,
                        setIsLoading,
                        setAccountAddress,
                        setAccountBalance,
                    });
                    await walletInstance.login();
                    break;
                case IWalletTypes.COINBASE:
                    walletInstance = new CoinbaseWallet({
                        chainConfig,
                        setConnected,
                        setIsLoading,
                        setAccountAddress,
                        setAccountBalance,
                    });
                    await walletInstance.adapterInit();
                    await walletInstance.login();
                    break;
                case IWalletTypes.WEB3AUTHCORE:
                    walletInstance = new Web3AuthCoreWallet({
                        chainConfig,
                        setConnected,
                        setIsLoading,
                        setAccountAddress,
                        setAccountBalance,
                        setTorusEmail,
                    });

                    // torus eager connect
                    try {
                        await walletInstance.login();
                    } catch (e) {
                        try {
                            await walletInstance.adapterInit();
                            await walletInstance.login();
                        } catch (err) {
                            if (
                                // @ts-ignore
                                !err.message.includes(
                                    'Failed to connect with walletAlready connected'
                                )
                            ) {
                                throw err;
                            }
                        }
                    }
                    break;
                case IWalletTypes.WALLETCONNECT:
                    walletInstance = new WalletConnectWallet({
                        chainConfig,
                        setConnected,
                        setIsLoading,
                        setAccountAddress,
                        setAccountBalance,
                    });
                    await walletInstance.adapterInit(isMetamaskMobile);
                    await walletInstance.login();
                    break;
                default:
                    break;
            }
            setWalletType(walletType);
            setWeb3Wallet(walletInstance as IWeb3Wallet);
            setBlockExplorerUrl(chainConfig.blockExplorer);
        } catch (e) {
            console.error('Error in WalletContext:setWallet()', e);
            console.warn('Resetting the walletInstance');
            walletInstance = null;
            setWeb3Wallet(walletInstance);
            setWalletType(null);
            setBlockExplorerUrl(null);
            throw e;
        }
    };

    let walletData: WalletContextValues = {
        walletType,
        connected,
        isLoading,
        accountAddress,
        accountBalance,
        torusEmail,
        blockExplorerUrl,
        chainConfig,
        setWallet,
        login: async () => {},
        logout: async () => {},
        signMessage: async () => {
            return '';
        },
        mint: async () => {},
        executeContractFunction: async () => {},
        checkTxn: async () => {},
    };

    if (web3Wallet) {
        walletData = {
            walletType,
            connected,
            isLoading,
            accountAddress,
            accountBalance,
            torusEmail,
            blockExplorerUrl,
            chainConfig,
            setWallet,
            login: web3Wallet.login,
            logout: web3Wallet.logout,
            signMessage: web3Wallet.signMessage,
            mint: web3Wallet.mint,
            executeContractFunction: web3Wallet.executeContractFunction,
            checkTxn: web3Wallet.checkTxn,
        };
    }
    return <WalletContext.Provider value={walletData}>{children}</WalletContext.Provider>;
};
