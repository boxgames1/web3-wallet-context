import { IWalletTypes, IWeb3Wallet } from '../types';
import EthereumProvider from '../providers/ethProvider';
import CoinbaseWalletSDK, { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';
import CWalletAdapter from './WalletAdapter';
import { useMobileDetect } from '../hooks/useMobileDetect';

export default class CoinbaseWallet extends CWalletAdapter implements IWeb3Wallet {
    walletType = IWalletTypes.COINBASE;
    walletInstance: CoinbaseWalletProvider | null = null;
    ethProvider: EthereumProvider | null = null;
    device = useMobileDetect();

    adapterInit = async () => {
        try {
            const coinbase = new CoinbaseWalletSDK({
                appName: ' Wallet Provider',
                darkMode: true,
            });

            this.walletInstance = coinbase.makeWeb3Provider(
                this.chainConfig!.rpcTarget,
                parseInt(this.chainConfig!.chainId, 16)
            );

            try {
                const chainSwitchResult = await this.walletInstance.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: this.chainConfig!.chainId }],
                });
                console.log('CoinbaseWallet:adapterInit():chainSwitchResult', chainSwitchResult);
            } catch (chainSwitchError) {
                console.error('CoinbaseWallet:adapterInit():chainSwitchError', chainSwitchError);
            }
        } catch (e) {
            console.error('Error in CoinbaseWallet:adapterInit()', e);
            throw e;
        }
    };

    login = async () => {
        if (!this.walletInstance) {
            throw new Error(' CoinbaseWallet:login() - walletInstance is null');
        }
        try {
            const isMobile = this.device.isMobile();
            // If the device is mobile, Coinbase app automatically opens its own browser and
            // app stalls in loading state
            if (!isMobile) {
                this.setIsLoading(true);
            }
            await this.walletInstance.enable();
            this.ethProvider = new EthereumProvider(this.walletInstance as any);
            await this.getWalletDetails();
            this.setConnected(true);
        } catch (e) {
            console.error('Error in CoinbaseWallet:login()', e);
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    logout = async () => {
        if (!this.walletInstance) {
            throw new Error('CoinbaseWallet:logout() - walletInstance is null');
        }
        try {
            this.setIsLoading(true);
            this.walletInstance.close();
            this.disconnect();
        } catch (e) {
            console.error('Error in CoinbaseWallet:logout()', e);
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };
}
