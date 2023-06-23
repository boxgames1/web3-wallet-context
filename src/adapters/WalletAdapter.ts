import { ethers } from 'ethers';
import EthereumProvider from '../providers/ethProvider';
import { chainInfo, IWalletTypes, IWeb3WalletConstructorArgs } from '../types';

export default abstract class CWalletAdapter {
    walletType: IWalletTypes | null = null;
    walletInstance: any | null = null;
    ethProvider: EthereumProvider | null = null;
    chainConfig: chainInfo | null;
    setConnected;
    setIsLoading;
    setAccountAddress;
    setAccountBalance;
    setTorusEmail;

    disconnect = () => {
        this.setAccountAddress(null);
        this.setAccountBalance(null);
        if (this.setTorusEmail) this.setTorusEmail(null);
        this.setConnected(false);
    };

    getWalletDetails = async () => {
        if (!this.ethProvider) {
            throw new Error(`Error in ${this.walletType}:getWalletDetails() - ethProvider is null`);
        }
        try {
            const address = await this.ethProvider.getAddress();
            const balance = await this.ethProvider.getBalance();
            this.setAccountAddress(address);
            this.setAccountBalance(balance ? balance.toFixed(2) : 0.0);
        } catch (e) {
            console.error(`Error in ${this.walletType}:getWalletDetails()`, e);
            throw e;
        }
    };

    executeContractFunction = async (
        tokenAddress: string,
        tokenId: number,
        contractFunction: string,
        contractAbi: ethers.ContractInterface
    ) => {
        if (!this.ethProvider) {
            throw new Error('${this.walletType}:executeContractFunction() - ethProvider is null');
        }

        try {
            const res = await this.ethProvider.executeContractFunction(
                tokenAddress,
                tokenId,
                contractFunction,
                contractAbi
            );
            console.warn(`${this.walletType}:executeContractFunction() result`, res);
            return res;
        } catch (e) {
            throw e;
        }
    };

    checkTxn = async (txn: string) => {
        if (!this.ethProvider) {
            throw new Error(`${this.walletType}:checkTxn() - ethProvider is null`);
        }

        try {
            return await this.ethProvider.checkTxn(txn);
        } catch (e) {
            throw e;
        }
    };

    mint = async (tokenAddress: string, tokenId: number, price: string) => {
        if (!this.ethProvider) {
            throw new Error(`${this.walletType}:mint() - ethProvider is null`);
        }

        try {
            return await this.ethProvider.mint(tokenAddress, tokenId, price);
        } catch (e) {
            throw e;
        }
    };

    signMessage = async (message: string) => {
        if (!this.ethProvider) {
            throw new Error(`${this.walletType}:signMessage() - ethProvider is null`);
        }

        try {
            return await this.ethProvider.signMessage(message);
        } catch (e) {
            throw e;
        }
    };

    constructor({
        chainConfig,
        setConnected,
        setIsLoading,
        setAccountAddress,
        setAccountBalance,
        setTorusEmail,
    }: IWeb3WalletConstructorArgs) {
        this.chainConfig = chainConfig;
        this.setConnected = setConnected;
        this.setIsLoading = setIsLoading;
        this.setAccountAddress = setAccountAddress;
        this.setAccountBalance = setAccountBalance;
        this.setTorusEmail = setTorusEmail;
    }
}
