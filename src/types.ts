/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';
import { CHAIN_NAMESPACES } from './adapters/Web3AuthTypes';

export enum IWalletTypes {
    WEB3AUTHCORE = 'WEB3AUTHCORE',
    WEB3AUTH = 'WEB3AUTH',
    METAMASK = 'METAMASK',
    WALLETCONNECT = 'WALLETCONNECT',
    COINBASE = 'COINBASE',
}

export interface chainInfo {
    chainNamespace: CHAIN_NAMESPACES;
    rpcTarget: string;
    blockExplorer: string;
    chainId: string;
    displayName: string;
    ticker: string;
    tickerName: string;
    decimals: number;
}

export interface WalletContextValues {
    walletType: IWalletTypes | null;
    connected: boolean;
    isLoading: boolean;
    accountAddress: string | null;
    accountBalance: string | number | null;
    torusEmail: string | null;
    blockExplorerUrl: string | null;
    chainConfig: chainInfo | null;
    setWallet: (walletType: IWalletTypes, isMetamaskMobile?: boolean) => void;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    mint: (tokenAddress: string, tokenId: number, price: string) => Promise<any>;
    executeContractFunction: (
        tokenAddress: string,
        tokenId: number,
        contractFunction: string,
        contractAbi: ethers.ContractInterface
    ) => Promise<any>;
    checkTxn: (txn: string) => Promise<any>;
}

export const defaultWalletContextValue: WalletContextValues = {
    walletType: null,
    connected: false,
    isLoading: false,
    accountAddress: null,
    accountBalance: null,
    torusEmail: null,
    blockExplorerUrl: null,
    chainConfig: null,
    setWallet: async () => {},
    login: async () => {},
    logout: async () => {},
    signMessage: async () => {
        return '';
    },
    mint: async () => {},
    executeContractFunction: async () => {},
    checkTxn: async () => {},
};

export interface IWeb3WalletConstructorArgs {
    chainConfig: chainInfo;
    setConnected: (isConnected: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setAccountAddress: (address: string | null) => void;
    setAccountBalance: (balance: string | number | null) => void;
    setTorusEmail?: (email: string | null) => void;
}

export interface IWeb3Wallet {
    walletType: IWalletTypes;
    walletInstance: any;
    setConnected: (isConnected: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setAccountAddress: (address: string | null) => void;
    setAccountBalance: (balance: string | number | null) => void;
    setTorusEmail?: (email: string | null) => void;
    adapterInit: (isMetamaskMobile?: boolean) => Promise<void>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    executeContractFunction: (
        tokenAddress: string,
        tokenId: number,
        contractFunction: string,
        contractAbi: ethers.ContractInterface
    ) => Promise<any>;
    mint: (tokenAddress: string, tokenId: number, price: string) => Promise<any>;
    signMessage: (message: string) => Promise<string>;
    checkTxn: (txn: string) => Promise<any>;
}

export interface IWalletProvider {
    getAddress: () => Promise<string>;
    getBalance: (accountAddress: string) => Promise<number>;
    mint: (
        tokenAddress: string,
        tokenId: number,
        price: string,
        functionAbi?: ethers.ContractInterface,
        functionName?: string
    ) => Promise<any>;
    checkTxn: (txn: string) => Promise<any>;
    executeContractFunction: (
        tokenAddress: string,
        tokenId: number,
        contractFunction: string,
        contractAbi: ethers.ContractInterface
    ) => Promise<any>;
    signMessage: (message: string) => Promise<string>;
}
