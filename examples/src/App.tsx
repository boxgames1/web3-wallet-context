import { WalletProvider } from 'web3-wallet-context';
import './App.css';
import { projectChainInfo } from './chains';
import WalletConnection from './components/WalletConnection';

const App = () => {
    return (
        <div className='App'>
            <WalletProvider chainConfig={projectChainInfo.goerli}>
                <WalletConnection />
            </WalletProvider>
        </div>
    );
};

export default App;
