import { USER_SIGNATURE_KEY_LOCALSTORAGE_KEY } from '../constants/localStorage';
import { useLocalStorage } from './useLocalStorage';

export type StoredUserSignatures = {
    walletAddress: string;
    signatures: {
        [message: string]: string;
    };
};

export const useUserSignatures = () => {
    const [userSignatures, setUserSignatures] = useLocalStorage<string>(
        USER_SIGNATURE_KEY_LOCALSTORAGE_KEY,
        '{}'
    );

    const stringJSONIsValid = (jsonStr: string) => {
        try {
            JSON.parse(jsonStr);
            return true;
        } catch (e) {
            return false;
        }
    };

    const setUserSignature = (message: string, walletAddress: string, signature: string) => {
        if (!walletAddress || !signature || !stringJSONIsValid(userSignatures)) return;
        const storedSignatures: StoredUserSignatures = JSON.parse(userSignatures || '{}');
        if (storedSignatures?.walletAddress === walletAddress) {
            storedSignatures.signatures[message] = signature;
            setUserSignatures(JSON.stringify(storedSignatures));
        } else {
            setUserSignatures(
                JSON.stringify({
                    walletAddress: walletAddress,
                    signatures: {
                        [message]: signature,
                    },
                })
            );
        }
    };

    const getUserSignature = (walletAddress: string, message: string) => {
        if (!stringJSONIsValid(userSignatures)) return;
        const storedSignatures: StoredUserSignatures = JSON.parse(userSignatures || '{}');
        if (
            walletAddress === storedSignatures?.walletAddress &&
            storedSignatures?.signatures[message]
        ) {
            return storedSignatures.signatures[message];
        }
        return '';
    };

    return [getUserSignature, setUserSignature] as const;
};
