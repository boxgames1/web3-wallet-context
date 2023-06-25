import { useState } from 'react';
import { IWalletTypes, useWalletContext, WalletContextValues } from 'web3-wallet-context';

const WalletConnection = () => {
    const [error, setError] = useState<string>('');
    const {
        isLoading,
        connected,
        setWallet,
        logout,
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
            {isLoading ? (
                <div>Loading...</div>
            ) : connected ? (
                <div className='connected'>
                    <strong>Connected</strong>
                    <div className='info'>
                        <div>Wallet address: {accountAddress}</div>
                        <div>
                            Account Balance: {accountBalance} {chainConfig?.ticker}
                        </div>
                        <div>Chain name: {chainConfig?.displayName}</div>
                        <div>blockExplorerUrl: {blockExplorerUrl}</div>
                        <div>WalletType: {walletType}</div>
                    </div>
                    <div>
                        <button onClick={() => logout()}>Disconnect</button>
                    </div>
                </div>
            ) : (
                <div className='entry'>
                    <strong>Connect to</strong>

                    <div className='button-list'>
                        <button onClick={() => handleLogin(IWalletTypes.METAMASK)}>Metamask</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletConnection;
