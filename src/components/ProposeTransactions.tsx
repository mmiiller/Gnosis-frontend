import { useCallback, useState } from 'react';
import {
    batchSendTokenFromEmployeeSafesToWallets,
    proposeSafeTransaction
} from '../utils/transactions/batchSendTokenFromEmployeeSafesToWallets';
import { useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { TransferList } from './transferList/TransferList';
import { CreatingTransactionScreen } from './CreatingTransactionScreen';

export const ProposeTransactions = ({
    omnibusSafe,
    backToUpload,
    transfers
}: {
    omnibusSafe: string;
    backToUpload: () => void;
    transfers: {
        fromSafe: string;
        toWallet: string;
        amount: number;
    }[];
}) => {
    const { data: signer } = useSigner();

    // keep state about the transaction being created
    const [creatingTransaction, setCreatingTransaction] = useState(false);
    const [createTransactionStep, setCreateTransactionStep] = useState(0);

    const [progress, setProgress] = useState({
        total: 0,
        created: 0
    });
    const [transactionHash, setTransactionHash] = useState<string>('');

    const createTransaction = useCallback(async () => {
        if (!signer) {
            return;
        }
        setProgress({
            total: transfers.length,
            created: 0
        });
        setCreatingTransaction(true);
        const { safeTransaction, safeTxHash } =
            await batchSendTokenFromEmployeeSafesToWallets(
                transfers.map(x => ({
                    ...x,
                    amount: ethers.utils.parseUnits(x.amount.toString(), 'ether')
                })),
                signer,
                data => {
                    setProgress(data);
                }
            );
        setTransactionHash(safeTxHash);
        setCreateTransactionStep(2);
        await proposeSafeTransaction(safeTransaction, signer);

        setCreateTransactionStep(3);
    }, [signer, transfers, setTransactionHash]);

    if (creatingTransaction) {
        return (
            <CreatingTransactionScreen
                createTransactionStep={createTransactionStep}
                omnibusSafe={omnibusSafe}
                progress={progress}
                transactionHash={transactionHash}
                setCreatingTransaction={setCreatingTransaction}
                setCreateTransactionStep={setCreateTransactionStep}
                backToUpload={backToUpload}
            />
        );
    }

    return (
        <TransferList
            backToUpload={backToUpload}
            omnibusSafe={omnibusSafe}
            createTransaction={createTransaction}
            transfers={transfers}
        />
    );
};
