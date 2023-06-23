import { IWalletTypes, IWeb3Wallet } from '../types';
import EthereumProvider from '../providers/ethProvider';
import WalletConnectProvider from '@walletconnect/web3-provider';
import QRCodeModal from '@walletconnect/qrcode-modal';
import CWalletAdapter from './WalletAdapter';

export default class WalletConnectWallet extends CWalletAdapter implements IWeb3Wallet {
    walletType = IWalletTypes.WALLETCONNECT;
    walletInstance: WalletConnectProvider | null = null;
    ethProvider: EthereumProvider | null = null;

    subscribeEvents = () => {
        if (!this.walletInstance) {
            throw new Error('WalletConnect:subscribeAuthEvents() - walletInstance is null');
        }

        this.walletInstance.onConnect((connectionData: unknown) => {
            try {
                console.log('WalletConnect:subscribeEvents:connect', connectionData);
                this.ethProvider = new EthereumProvider(this.walletInstance);
                // this.ethProvider = new providers.Web3Provider(this.walletInstance!);
                this.getWalletDetails()
                    .then(() => {
                        this.setIsLoading(false);
                        this.setConnected(true);
                    })

                    .catch((e) =>
                        console.log(
                            'Error in WalletConnect:subscribeEvents:connect:getWalletDetails',
                            e
                        )
                    );
            } catch (e) {
                throw e;
            }
        });

        this.walletInstance.on('chainChanged', (chainId: number) => {
            console.log('WalletConnect:subscribeEvents:chainChanged', chainId);
        });
    };

    adapterInit = async (isMetamaskOnly: boolean = false) => {
        try {
            const provider = new WalletConnectProvider({
                bridge: 'https://bridge.walletconnect.org',
                qrcodeModal: QRCodeModal,
                chainId: parseInt(this.chainConfig!.chainId, 16),
                rpc: {
                    [parseInt(this.chainConfig!.chainId, 16)]: this.chainConfig!.rpcTarget,
                },
                qrcodeModalOptions: {
                    mobileLinks: isMetamaskOnly ? ['metamask'] : ['rainbow', 'trust'],
                    desktopLinks: ['tokenary', 'infinity', 'ambire', 'keyring'],
                },
            });

            this.walletInstance = provider;
            this.subscribeEvents();
            await provider.enable();
        } catch (e) {
            console.error('Error in WalletConnect:adapterInit()', e);
            throw e;
        }
    };

    login = async () => {
        if (!this.walletInstance) {
            throw new Error('WalletConnect:login() - walletInstance is null');
        }
        try {
            this.setIsLoading(true);
            if (this.walletInstance.connected) {
                // create new session
                this.ethProvider = new EthereumProvider(this.walletInstance);
                await this.walletInstance.enable();
                await this.getWalletDetails();
                this.setConnected(true);
            }
        } catch (e) {
            console.error('Error in WalletConnect:login()', e);
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    logout = async () => {
        if (!this.walletInstance) {
            throw new Error('WalletConnect:logout() - walletInstance is null');
        }
        try {
            this.setIsLoading(true);
            if (this.walletInstance.connected) {
                await this.walletInstance.disconnect();
                this.disconnect();
            }
        } catch (e) {
            console.error('Error in WalletConnect:logout()', e);
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };
}
