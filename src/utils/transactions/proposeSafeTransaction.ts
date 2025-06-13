import Safe from '@gnosis.pm/safe-core-sdk';
import { SafeTransaction } from '@gnosis.pm/safe-core-sdk-types';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import SafeApiKit from '@safe-global/api-kit';
import { Signer, ethers } from 'ethers';
import {
    OMNIBUS_ADDRESS,
    contractNetworks,
    MY_METAMASK_ADDRESS,
    CHAIN_ID
} from '../../constants';

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
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    console.log(safeTransaction.data.data);
    const apiKit = new SafeApiKit({
        chainId: BigInt(CHAIN_ID),
        txServiceUrl: 'https://transaction.safe.shape.network/',
    });

    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
    console.log({
        safeAddress: OMNIBUS_ADDRESS,
        safeTransactionData: {
            safeTxGas: safeTransaction.data.safeTxGas.toString(),
            baseGas: safeTransaction.data.baseGas.toString(),
            gasPrice: safeTransaction.data.gasPrice.toString(),
            gasToken: safeTransaction.data.gasToken,
            nonce: safeTransaction.data.nonce,
            operation: safeTransaction.data.operation,
            refundReceiver: safeTransaction.data.refundReceiver,
            to: safeTransaction.data.to,
            value: safeTransaction.data.value,
            data: safeTransaction.data.data
        },
        safeTxHash,
        senderAddress: MY_METAMASK_ADDRESS,
        senderSignature: senderSignature.data
    });

    await apiKit.proposeTransaction({
        safeAddress: OMNIBUS_ADDRESS,
        safeTransactionData: {
            safeTxGas: safeTransaction.data.safeTxGas.toString(),
            baseGas: safeTransaction.data.baseGas.toString(),
            gasPrice: safeTransaction.data.gasPrice.toString(),
            gasToken: safeTransaction.data.gasToken,
            nonce: safeTransaction.data.nonce,
            operation: safeTransaction.data.operation,
            refundReceiver: safeTransaction.data.refundReceiver,
            to: safeTransaction.data.to,
            value: safeTransaction.data.value,
            data: safeTransaction.data.data
        },
        safeTxHash,
        senderAddress: MY_METAMASK_ADDRESS,
        senderSignature: senderSignature.data
    });

    return safeTxHash;
}
