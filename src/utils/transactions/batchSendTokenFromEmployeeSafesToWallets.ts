import Safe from '@gnosis.pm/safe-core-sdk';
import { MetaTransactionData, OperationType } from '@gnosis.pm/safe-core-sdk-types';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import {
    OMNIBUS_ADDRESS,
    CHAIN_ID,
    EXAMPLE_TOKEN_ADDRESS,
    contractNetworks
} from '../../constants';
import { BigNumber, Signer, ethers } from 'ethers';
import { encodeTransactionData } from './encodeTransactionData';
import gldToken from '../../abi/GLDToken.json';
import Decimal from 'decimal.js';

function createApprovedHashSignature(signerAddress: string): string {
    const r = ethers.utils.hexZeroPad(signerAddress, 32);
    const s = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    const v = '0x01';
    return ethers.utils.hexConcat([r, s, v]);
}

export async function batchSendTokenFromEmployeeSafesToWallets(
    employeeSafeTransfers: {
        fromSafe: string;
        toWallet: string;
        amount: BigNumber;
    }[],
    signer: Signer,
    onSafeTransactionCreated?: (data: { total: number; created: number }) => void
) {
    const realTransfers: {
        fromSafe: string;
        toWallet: string;
        amount: string;
    }[] = [];

    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer
    });

    const omnibusSafe = await Safe.create({
        ethAdapter,
        safeAddress: OMNIBUS_ADDRESS,
        contractNetworks
    });

    const ercToken = new ethers.Contract(EXAMPLE_TOKEN_ADDRESS, gldToken.abi, signer);

    const transactions: MetaTransactionData[] = [];

    for (const transfer of employeeSafeTransfers) {
        const employeeSafe = await Safe.create({
            ethAdapter,
            safeAddress: transfer.fromSafe,
            contractNetworks,
            
        });

        //const balance = await ercToken.balanceOf(employeeSafe.getAddress());

        realTransfers.push({
            fromSafe: transfer.fromSafe,
            toWallet: transfer.toWallet,
            amount: transfer.amount.toString()
        });

        const to = EXAMPLE_TOKEN_ADDRESS;
        const value = 0;
        const { data } = await ercToken.populateTransaction.transfer(
            transfer.toWallet,
            new Decimal(transfer.amount.toString())
                .mul(new Decimal(10).pow(18)) // Assuming 18 decimals for GLDToken
            
        );
        if (!data) throw new Error('Data is undefined');

        const operation = 0;
        const safeTxGas = 0;
        const baseGas = 0;
        const gasPrice = 0;
        const gasToken = ethers.constants.AddressZero;
        const refundReceiver = ethers.constants.AddressZero;

        const existingTransactionsCount = transactions.filter(
            tx => tx.to === employeeSafe.getAddress()
        ).length;

        const nonce = (await employeeSafe.getNonce()) + existingTransactionsCount;

        const contractAddress = employeeSafe.getAddress();
        const employeeSafeContract = await ethAdapter.getSafeContract({
            chainId: CHAIN_ID,
            safeVersion: await employeeSafe.getContractVersion(),
            customContractAddress: contractAddress
        });

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

        const hashToApprove = ethers.utils.keccak256(txHashData);

        transactions.push({
            to: transfer.fromSafe,
            value: '0',
            data: employeeSafeContract.encode('approveHash', [hashToApprove]),
            operation: OperationType.Call
        });

        const omnibusApprovedHashSignature = createApprovedHashSignature(OMNIBUS_ADDRESS);

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
                omnibusApprovedHashSignature
            ]
        );

        transactions.push({
            to: transfer.fromSafe,
            value: '0',
            data: employeeSafeErc20TransferTransactionData,
            operation: OperationType.Call
        });

        onSafeTransactionCreated &&
            onSafeTransactionCreated({
                total: employeeSafeTransfers.length,
                created: transactions.length / 2
            });
    }

    console.log(transactions);
 

    const safeTransaction = await omnibusSafe.createTransaction({
        safeTransactionData: transactions,
       
    });

    const safeTxHash = await omnibusSafe.getTransactionHash(safeTransaction);

    console.log(
        realTransfers.map(x => `${x.fromSafe},${x.toWallet},${x.amount}`).join('\n')
    );

    return {
        safeTransaction,
        safeTxHash
    };
}
