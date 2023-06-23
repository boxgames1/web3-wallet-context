import { ethers } from 'ethers';
import { IWalletProvider } from '../types';
import { parseEther } from 'ethers/lib/utils';

const DEFAULT_NFT_ABI = ['function mint(address account, uint256 tokenId) external payable'];

export default class EthereumProvider implements IWalletProvider {
    web3Provider: any;

    getProvider = () => {
        try {
            return new ethers.providers.Web3Provider(this.web3Provider);
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
            return this.getSigner().getAddress();
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
            const contract = new ethers.Contract(tokenAddress, contractAbi, provider);
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
            return parseFloat(ethers.utils.formatEther(await this.getSigner().getBalance()));
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
        const signer = this.getSigner();
        try {
            const abi = functionAbi || DEFAULT_NFT_ABI;
            const contract = new ethers.Contract(tokenAddress, abi, signer);
            const tx = await contract[functionName || 'mint'](await signer.getAddress(), tokenId, {
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
            const signer = this.getSigner();
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
