import { useCallback, useState } from 'react';
import { batchSendTokenFromEmployeeSafesToWallets } from '../utils/transactions/batchSendTokenFromEmployeeSafesToWallets';
import { useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { TransferList } from './transferList/TransferList';
import { CreatingTransactionScreen } from './CreatingTransactionScreen';
import { proposeSafeTransaction } from '../utils/transactions/proposeSafeTransaction';
import Decimal from 'decimal.js';
import { TOKEN_DECIMALS } from '../constants';

export const ProposeTransactions = ({
    omnibusSafe,
    backToUpload,
    transfers,
    downloadTransactions
}: {
    omnibusSafe: string;
    downloadTransactions: boolean;
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

    const [rawTransactions, setRawTransactions] = useState<string>('');

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
                transfers.map(x => {
                    console.log(
                        x.amount,
                        '=>',
                        BigInt(
                            new Decimal(x.amount)
                                .mul(new Decimal(10).pow(TOKEN_DECIMALS))
                                .toPrecision(1000)
                                .split('.')[0]
                        )
                    );
                    return {
                        ...x,
                        amount: ethers.BigNumber.from(
                            BigInt(
                                new Decimal(x.amount)
                                    .mul(new Decimal(10).pow(TOKEN_DECIMALS))
                                    .toPrecision(1000)
                                    .split('.')[0]
                            )
                        )
                    };
                }),
                signer,
                data => {
                    setProgress(data);
                }
            );
        setTransactionHash(safeTxHash);
        setCreateTransactionStep(2);
        if (downloadTransactions) {
            // get the raw transaction data that we need to submit to the safe so we can
            // sign the transaction offline
            setRawTransactions(safeTransaction.data.data);
        } else {
            await proposeSafeTransaction(safeTransaction, signer);
        }

        setCreateTransactionStep(3);
    }, [signer, transfers, setTransactionHash]);

    if (creatingTransaction) {
        return (
            <CreatingTransactionScreen
                createTransactionStep={createTransactionStep}
                omnibusSafe={omnibusSafe}
                progress={progress}
                transactionHash={transactionHash}
                rawTransactionData={rawTransactions}
                downloadTransactions={downloadTransactions}
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
