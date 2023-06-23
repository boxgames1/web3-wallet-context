import { ethers, parseEther } from 'ethers';
import { IWalletProvider } from '../types';

const DEFAULT_NFT_ABI = ['function mint(address account, uint256 tokenId) external payable'];

export default class EthereumProvider implements IWalletProvider {
    web3Provider: any;

    getProvider = () => {
        try {
            return new ethers.BrowserProvider(this.web3Provider);
        } catch (e) {
            console.error('Error in ethProvider:getProvider()', e);
            throw e;
        }
    };

    getSigner = () => {
        if (!this.web3Provider) {
            throw new Error('ethProvider:getSigner() - web3Provider is null');
        }
        try {
            return this.getProvider().getSigner();
        } catch (e) {
            console.error('Error in ethProvider:getSigner()', e);
            throw e;
        }
    };

    getAddress = async () => {
        if (!this.web3Provider) {
            throw new Error('ethProvider:getAddress() - web3Provider is null');
        }
        try {
            const signer = await this.getSigner();
            return signer.getAddress();
        } catch (e) {
            console.error('Error in ethProvider:getAddress()', e);
            throw e;
        }
    };

    executeContractFunction = async (
        tokenAddress: string,
        tokenId: number,
        contractFunction: string,
        contractAbi: ethers.ContractInterface
    ): Promise<any> => {
        const provider = this.getProvider();
        try {
            const formattedContratAbi = new ethers.Interface(JSON.stringify(contractAbi.abi));
            const contract = new ethers.Contract(tokenAddress, formattedContratAbi, provider);
            if (typeof contract[contractFunction] !== 'function') {
                throw new Error(
                    `ethProvider:executeContractFunction() - ${contractFunction} is not a function of the contract`
                );
            }
            const result = await contract[contractFunction](tokenId);
            return result;
        } catch (e) {
            throw e;
        }
    };

    getBalance = async () => {
        if (!this.web3Provider) {
            throw new Error('ethProvider:getBalance() - web3Provider is null');
        }
        try {
            const provider = this.getProvider();
            const blockTag = await provider.getBlockNumber();
            const signer = await this.getSigner();
            const bigIntBalance = await provider.getBalance(signer.getAddress(), blockTag);
            const numberBalance = parseFloat(ethers.formatEther(bigIntBalance));
            return numberBalance;
        } catch (e) {
            console.error('Error in ethProvider:getBalance()', e);
            throw e;
        }
    };

    mint = async (
        tokenAddress: string,
        tokenId: number,
        price: string,
        functionAbi?: ethers.ContractInterface,
        functionName?: string
    ) => {
        const signer = await this.getSigner();
        try {
            const abi = functionAbi || DEFAULT_NFT_ABI;
            const address = await signer.getAddress();
            const formattedContratAbi = new ethers.Interface(JSON.stringify(abi));
            const contract = new ethers.Contract(tokenAddress, formattedContratAbi, signer);
            const tx = await contract[functionName || 'mint'](address, tokenId, {
                value: parseEther(price.toString()),
            });
            return tx;
        } catch (e) {
            console.error('Error in ethProvider:mint: ', e);
            throw e;
        }
    };

    checkTxn = async (txn: string) => {
        try {
            const provider = this.getProvider();
            return await provider.getTransactionReceipt(txn);
        } catch (e) {
            console.error('Error in ethProvider:checkTxn: ', e);
            throw e;
        }
    };

    signMessage = async (message: string) => {
        try {
            const signer = await this.getSigner();
            return await signer.signMessage(message);
        } catch (e) {
            console.error('Error in ethProvider:signMessage: ', e);
            throw e;
        }
    };

    constructor(web3Provider: any) {
        try {
            this.web3Provider = web3Provider;
        } catch (e) {
            console.error('Error in ethProvider:constructor()', e);
            throw e;
        }
    }
}
