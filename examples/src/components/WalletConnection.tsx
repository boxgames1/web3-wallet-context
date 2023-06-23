import { useState } from 'react';
import { IWalletTypes, useWalletContext, WalletContextValues } from 'web3-wallet-context';

const WalletConnection = () => {
    const [error, setError] = useState<string>('');
    const {
        isLoading,
        connected,
        setWallet,
        accountAddress,
        accountBalance,
        blockExplorerUrl,
        chainConfig,
        walletType,
    }: WalletContextValues = useWalletContext();

    const handleLogin = async (walletType: IWalletTypes) => {
        try {
            await setWallet(walletType);
        } catch (e: any) {
            setError(e.message!);
        }
    };
    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div>
            <strong>Connect to</strong>
            {isLoading ? (
                <div>Loading...</div>
            ) : connected ? (
                <div>
                    <strong>Connected</strong>
                    <div>
                        <div>Wallet address: {accountAddress}</div>
                        <div>Account Balance: {accountBalance}</div>
                        <div>Chain Config: {chainConfig?.displayName}</div>
                        <div>blockExplorerUrl: {blockExplorerUrl}</div>
                        <div>WalletType: {walletType}</div>
                    </div>
                </div>
            ) : (
                <div className='list'>
                    <button onClick={() => handleLogin(IWalletTypes.METAMASK)}>Metamask</button>
                </div>
            )}
        </div>
    );
};

export default WalletConnection;
