import EthereumProvider from '../providers/ethProvider';
// import detectEthereumProvider from '@metamask/detect-provider';
import { IWalletTypes, IWeb3Wallet } from '../types';
import CWalletAdapter from './WalletAdapter';

// /https://docs.metamask.io/guide/rpc-api.html
export default class MetamaskWallet extends CWalletAdapter implements IWeb3Wallet {
    walletType = IWalletTypes.METAMASK;
    walletInstance: any | null = null;
    ethProvider: EthereumProvider | null = null;

    subscribeAuthEvents = () => {
        if (!this.walletInstance) {
            throw new Error('MetamaskWallet:subscribeAuthEvents() - walletInstance is null');
        }

        this.walletInstance.on('connect', (connectInfo: any) => {
            try {
                console.log(
                    'MetamaskWallet:subscribeAuthEvents():connect connectionInfo',
                    connectInfo
                );
            } catch (e) {
                console.error('Error in MetamaskWallet:subscribeAuthEvents():connect', e);
                throw e;
            }
        });

        this.walletInstance.on('accountsChanged', (accounts: string[]) => {
            try {
                console.log(
                    'MetamaskWallet:subscribeAuthEvents():accountsChanged accounts',
                    accounts
                );
                if (accounts.length === 0) {
                    this.disconnect();
                }
            } catch (e) {
                console.error('Error in MetamaskWallet:subscribeAuthEvents():accountsChanged', e);
                throw e;
            }
        });

        this.walletInstance.on('message', (eventInfo: any) => {
            try {
                console.log('MetamaskWallet:subscribeAuthEvents():message eventInfo', eventInfo);
            } catch (e) {
                console.error('Error in MetamaskWallet:subscribeAuthEvents():message', e);
                throw e;
            }
        });

        this.walletInstance.on('disconnect', (eventInfo: any) => {
            try {
                console.log('MetamaskWallet:subscribeAuthEvents():disconnect eventInfo', eventInfo);
                this.disconnect();
            } catch (e) {
                console.error('Error in MetamaskWallet:subscribeAuthEvents():disconnect', e);
                throw e;
            }
        });
    };

    adapterInit = async () => {
        try {
            const { ethereum } = window;
            let provider: any = ethereum;

            if (!provider) {
                throw new Error('You need to install metamask');
            }

            // @ts-ignore
            if (ethereum.providers) {
                // @ts-ignore
                provider = ethereum.providers.find(
                    (provider: { isMetaMask: boolean; isBraveWallet: boolean }) =>
                        provider.isMetaMask && !provider.isBraveWallet
                );
            }

            if (!provider.isMetaMask) {
                throw new Error('You need to install THE metamask');
            }

            try {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: this.chainConfig!.chainId }],
                });
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902 || JSON.stringify(switchError).includes('4902')) {
                    try {
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: this.chainConfig!.chainId,
                                    chainName: this.chainConfig!.displayName,
                                    rpcUrls: [this.chainConfig!.rpcTarget],
                                    nativeCurrency: {
                                        name: this.chainConfig!.tickerName,
                                        symbol: this.chainConfig!.ticker,
                                        decimals: this.chainConfig!.decimals,
                                    },
                                    blockExplorerUrls: [this.chainConfig!.blockExplorer],
                                },
                            ],
                        });
                    } catch (addError: any) {
                        if (addError.code === 4001) {
                            throw new Error('You must add this chain (network) to continue');
                        }
                        if (JSON.stringify(addError).includes('networkErr')) {
                            throw new Error('Network Error, please try again');
                        }
                        throw new Error(addError.message);
                    }
                } else {
                    throw new Error(switchError.message);
                }
            }

            // @ts-ignore
            await provider.request({ method: 'eth_requestAccounts' });
            this.walletInstance = provider;
            this.ethProvider = new EthereumProvider(this.walletInstance);
            this.subscribeAuthEvents();
        } catch (e) {
            console.error('Error in MetamaskWallet:adapterInit()', e);
            throw e;
        }
    };

    login = async () => {
        try {
            this.setIsLoading(true);
            console.log('MetamaskWallet:login()');
            await this.adapterInit();
            await this.getWalletDetails();
            this.setConnected(true);
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    logout = async () => {
        try {
            this.setIsLoading(true);
            console.log('MetamaskWallet:logout()');
            // Metamask actually does not disconnect
            this.disconnect();
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };
}
