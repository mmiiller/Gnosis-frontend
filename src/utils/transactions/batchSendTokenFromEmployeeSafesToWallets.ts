import Safe from '@gnosis.pm/safe-core-sdk';
import {
    MetaTransactionData,
    OperationType,
    SafeTransaction
} from '@gnosis.pm/safe-core-sdk-types';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import {
    OMNIBUS_ADDRESS,
    CHAIN_ID,
    EXAMPLE_TOKEN_ADDRESS,
    txServiceUrl,
    contractNetworks
} from '../../constants';
import { BigNumber, Signer, ethers } from 'ethers';
import { createERC1271signature } from './createERC1271signature';
import { encodeTransactionData } from './encodeTransactionData';
import gldToken from '../../abi/GLDToken.json';

export async function batchSendTokenFromEmployeeSafesToWallets(
    employeeSafeTransfers: {
        fromSafe: string;
        toWallet: string;
        amount: BigNumber;
    }[],
    signer: Signer,
    // call back to get the status of the safe transaction creation
    // this will be used to update the UI
    onSafeTransactionCreated?: (data: { total: number; created: number }) => void
) {
    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer
    });
    const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress: OMNIBUS_ADDRESS,
        contractNetworks
    });

    const signMessageLibContract = await ethAdapter.getSignMessageLibContract({
        chainId: CHAIN_ID,
        safeVersion: await safeSdk.getContractVersion(),
        customContractAddress: contractNetworks[CHAIN_ID].signMessageLibAddress
    });

    const ercToken = new ethers.Contract(EXAMPLE_TOKEN_ADDRESS, gldToken.abi, signer);

    const transactions: MetaTransactionData[] = [];

    for (const transfer of employeeSafeTransfers) {
        // create a safe sdk for this employee safe
        const employeeSafeSdk = await Safe.create({
            ethAdapter,
            safeAddress: transfer.fromSafe,
            contractNetworks
        });

        /**
         * Create the signature for the contract call
         */
        // create a contract signature that will pass the child safe
        const signature = createERC1271signature(OMNIBUS_ADDRESS);
        // there is a 0 after it but it needs to be one byte
        const to = EXAMPLE_TOKEN_ADDRESS;
        const value = 0;
        const { data } = await ercToken.populateTransaction.transfer(
            transfer.toWallet,
            transfer.amount
        );
        if (!data) {
            throw new Error('Data is undefined');
        }
        const operation = 0;
        const safeTxGas = 0;
        const baseGas = 0;
        const gasPrice = 0;
        const gasToken = '0x0000000000000000000000000000000000000000';
        const refundReceiver = '0x0000000000000000000000000000000000000000';

        // count the number of transfers this address has
        // THIS IS A HACK SO WE CAN SEND FROM THE SAME SAFE TO A DIFFERENT ADDRESS
        const esistingTransactiosn = transactions.filter(
            tx => tx.to === employeeSafeSdk.getAddress()
        ).length;

        const nonce = (await employeeSafeSdk.getNonce()) + esistingTransactiosn;
        const contractAddress = employeeSafeSdk.getAddress();

        // get the safe contract for the employee safe
        const employeeSafeContract = await ethAdapter.getSafeContract({
            chainId: CHAIN_ID,
            safeVersion: await employeeSafeSdk.getContractVersion(),
            customContractAddress: contractAddress
        });

        // 1. make a transaction that will call signMessage on the transaction that we want the employee safe to
        const employeeSafeErc20TransferTransactionData = employeeSafeContract.encode(
            'execTransaction',
            [
                to,
                value,
                data,
                operation,
                safeTxGas,
                baseGas,
                gasPrice,
                gasToken,
                refundReceiver,
                signature
            ]
        );

        // 1.1 encode the data so we can sign it with the master safe
        const txHashData = encodeTransactionData(
            to,
            value,
            data,
            operation,
            safeTxGas,
            baseGas,
            gasPrice,
            gasToken,
            refundReceiver,
            nonce,
            contractAddress
        );

        // 2. create a transaction where we sign the other transaction that we
        // want to execute on the employee safe
        transactions.push({
            to: signMessageLibContract.getAddress(),
            value: '0',
            data: signMessageLibContract.encode('signMessage', [txHashData]),
            operation: OperationType.DelegateCall
        });

        // 3.  make sure too add the transaction of erc20 tokens out of the safe
        transactions.push({
            to: transfer.fromSafe,
            value: '0',
            data: employeeSafeErc20TransferTransactionData
        });
        onSafeTransactionCreated &&
            onSafeTransactionCreated({
                total: employeeSafeTransfers.length,
                created: transactions.length / 2
            });
    }
    const safeTransaction = await safeSdk.createTransaction({
        safeTransactionData: transactions
    });
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

    return {
        safeTransaction,
        safeTxHash
    };
}

export async function proposeSafeTransaction(
    safeTransaction: SafeTransaction,
    signer: Signer
) {
    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer
    });
    const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress: OMNIBUS_ADDRESS,
        contractNetworks
    });
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
    await safeService.proposeTransaction({
        senderAddress: await signer.getAddress(),
        safeAddress: OMNIBUS_ADDRESS,
        safeTransactionData: safeTransaction.data,
        senderSignature: senderSignature.data,
        safeTxHash
    });
    return safeTxHash;
}
