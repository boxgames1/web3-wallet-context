import { IWalletTypes, IWeb3Wallet } from '../types';
import EthereumProvider from '../providers/ethProvider';
import { ADAPTER_EVENTS } from './Web3AuthTypes';
import { Web3AuthCore } from '@web3auth/core';
import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter';
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin';
import CWalletAdapter from './WalletAdapter';

export default class Web3AuthCoreWallet extends CWalletAdapter implements IWeb3Wallet {
    walletType = IWalletTypes.WEB3AUTHCORE;
    walletInstance: Web3AuthCore | null = null;
    ethProvider: EthereumProvider | null = null;

    subscribeAuthEvents = () => {
        if (!this.walletInstance) {
            throw new Error('Web3AuthCoreWallet:subscribeAuthEvents() - walletInstance is null');
        }
        // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
        this.walletInstance.on(ADAPTER_EVENTS.CONNECTED, () => {
            if (!this.walletInstance) {
                throw new Error(
                    'Web3AuthCoreWallet:subscribeAuthEvents() - walletInstance is null'
                );
            }
            try {
                console.log('Web3AuthCoreWallet:SubscribeAuthEvents:ADAPTER_EVENTS.CONNECTED');

                this.walletInstance
                    .getUserInfo()
                    .then((userInfo) =>
                        userInfo?.email && this.setTorusEmail
                            ? this.setTorusEmail(userInfo.email)
                            : ''
                    );

                this.ethProvider = new EthereumProvider(this.walletInstance.provider);
                this.getWalletDetails().then(() => this.setIsLoading(false));
                this.setConnected(true);
            } catch (e) {
                console.error(
                    'Error in Web3AuthCoreWallet:SubscribeAuthEvents:ADAPTER_EVENTS.CONNECTED',
                    e
                );
                throw e;
            }
        });

        // this.walletInstance.on(ADAPTER_EVENTS.CONNECTING, () => {
        //     this.setIsLoading(true);
        // });

        // this.walletInstance.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        //     this.setIsLoading(false);
        //     this.setAccountAddress(null);
        //     this.setAccountBalance(null);
        //     this.setIsConnected(false);
        // });

        this.walletInstance.on(ADAPTER_EVENTS.ERRORED, (e: unknown) => {
            // console.error(
            //     'Error in Web3AuthCoreWallet:SubscribeAuthEvents:ADAPTER_EVENTS.ERRORED',
            //     e
            // );
            throw e;
        });
    };

    adapterInit = async () => {
        this.setIsLoading(true);
        try {
            const web3auth = new Web3AuthCore({
                chainConfig: this.chainConfig as any,
                enableLogging: true,
            });

            const torusWalletAdapter = new TorusWalletAdapter({
                loginSettings: {
                    verifier: '',
                },
                initParams: {
                    buildEnv: 'testing',
                },
                chainConfig: this.chainConfig as any,
            });

            const torusPlugin = new TorusWalletConnectorPlugin({
                torusWalletOpts: { buttonPosition: 'bottom-left', modalZIndex: 10 },
                walletInitOptions: {
                    whiteLabel: {
                        theme: { isDark: true, colors: { primary: '#00a8ff' } },
                        logoDark: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                        logoLight: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                    },
                    useWalletConnect: true,
                    enableLogging: true,
                },
            });

            await web3auth.addPlugin(torusPlugin);
            web3auth.configureAdapter(torusWalletAdapter);
            this.walletInstance = web3auth;
            this.subscribeAuthEvents();
            await web3auth.init();
        } catch (e) {
            console.error('Error in Web3AuthCoreWallet:adapterInit()', e);
            throw e;
        }
    };

    login = async () => {
        try {
            this.setIsLoading(true);
            console.log('Web3AuthCoreWallet:login()');
            if (!this.walletInstance) {
                throw new Error('Web3AuthCoreWallet:login() - walletInstance is null');
            }
            await this.walletInstance.connectTo('torus-evm');
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    logout = async () => {
        if (!this.walletInstance) {
            throw new Error('Web3AuthCoreWallet:logout() - walletInstance is null');
        }
        try {
            this.setIsLoading(true);
            await this.walletInstance.logout();
            this.disconnect();
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };
}
