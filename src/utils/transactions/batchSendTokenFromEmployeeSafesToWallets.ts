import Safe from '@gnosis.pm/safe-core-sdk';
import { MetaTransactionData, OperationType } from '@gnosis.pm/safe-core-sdk-types';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import {
    OMNIBUS_ADDRESS,
    CHAIN_ID,
    EXAMPLE_TOKEN_ADDRESS,
    contractNetworks,
    TOKEN_DECIMALS
} from '../../constants';
import { BigNumber, Signer, ethers } from 'ethers';
import gldToken from '../../abi/GLDToken.json';
import Decimal from 'decimal.js';

function createApprovedHashSignature(signerAddress: string): string {
    const r = ethers.utils.hexZeroPad(signerAddress, 32);
    const s = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    const v = '0x01';
    return ethers.utils.hexConcat([r, s, v]);
}

// export async function batchSendTokenFromEmployeeSafesToWallets(
//     employeeSafeTransfers: {
//         fromSafe: string;
//         toWallet: string;
//         amount: BigNumber;
//     }[],
//     signer: Signer,
//     onSafeTransactionCreated?: (data: { total: number; created: number }) => void
// ) {
//     const realTransfers: {
//         fromSafe: string;
//         toWallet: string;
//         amount: string;
//     }[] = [];

//     const ethAdapter = new EthersAdapter({
//         ethers,
//         signerOrProvider: signer
//     });

//     const omnibusSafe = await Safe.create({
//         ethAdapter,
//         safeAddress: OMNIBUS_ADDRESS,
//         contractNetworks
//     });

//     const ercToken = new ethers.Contract(EXAMPLE_TOKEN_ADDRESS, gldToken.abi, signer);

//     const transactions: MetaTransactionData[] = [];

//     // Constants for the time check
//     const TIME_ASSERTION_CONTRACT = '0x958F70e4Fd676c9CeAaFe5c48cB78CDD08b4880d';

//     const START_TIMESTAMP = 1752796800; // Jun 18, 2025 00:00 UTC
//     const END_TIMESTAMP =
//         115792089237316195423570985008687907853269984665640564039457584007913129639935n; // some far future timestamp to avoid blocking

//     // Contract ABI fragment
//     const timestampAssertionAbi = [
//         {
//             inputs: [
//                 { internalType: 'uint256', name: '_start', type: 'uint256' },
//                 { internalType: 'uint256', name: '_end', type: 'uint256' }
//             ],
//             name: 'assertTimestampInRange',
//             outputs: [],
//             stateMutability: 'view',
//             type: 'function'
//         }
//     ];

//     // Encode call to `assertTimestampInRange(start, end)`
//     const iface = new ethers.utils.Interface(timestampAssertionAbi);
//     const timestampCheckCallData = iface.encodeFunctionData('assertTimestampInRange', [
//         START_TIMESTAMP,
//         END_TIMESTAMP
//     ]);

//     transactions.push({
//         to: TIME_ASSERTION_CONTRACT,
//         value: '0',
//         data: timestampCheckCallData,
//         operation: OperationType.Call
//     });

//     for (const transfer of employeeSafeTransfers) {
//         const employeeSafe = await Safe.create({
//             ethAdapter,
//             safeAddress: transfer.fromSafe,
//             contractNetworks
//         });

//         //const balance = await ercToken.balanceOf(employeeSafe.getAddress());

//         realTransfers.push({
//             fromSafe: transfer.fromSafe,
//             toWallet: transfer.toWallet,
//             amount: transfer.amount.toString()
//         });

//         const to = EXAMPLE_TOKEN_ADDRESS;
//         const value = 0;
//         const { data } = await ercToken.populateTransaction.transfer(
//             transfer.toWallet,
//             transfer.amount.toString()
//         );

//         console.log(
//             `Preparing transfer from ${transfer.fromSafe} to ${
//                 transfer.toWallet
//             } of amount ${transfer.amount.toString()} with data: ${data}`
//         );
//         if (!data) throw new Error('Data is undefined');

//         const operation = 0;
//         const safeTxGas = 0;
//         const baseGas = 0;
//         const gasPrice = 0;
//         const gasToken = ethers.constants.AddressZero;
//         const refundReceiver = ethers.constants.AddressZero;

//         const contractAddress = employeeSafe.getAddress();
//         const employeeSafeContract = await ethAdapter.getSafeContract({
//             chainId: CHAIN_ID,
//             safeVersion: await employeeSafe.getContractVersion(),
//             customContractAddress: contractAddress
//         });

//         // const txHashData = encodeTransactionData(
//         //     to,
//         //     value,
//         //     data,
//         //     operation,
//         //     safeTxGas,
//         //     baseGas,
//         //     gasPrice,
//         //     gasToken,
//         //     refundReceiver,
//         //     nonce,
//         //     contractAddress
//         // );

//         // const hashToApprove = ethers.utils.keccak256(txHashData);

//         // transactions.push({
//         //     to: transfer.fromSafe,
//         //     value: '0',
//         //     data: employeeSafeContract.encode('approveHash', [hashToApprove]),
//         //     operation: OperationType.Call
//         // });

//         const omnibusApprovedHashSignature = createApprovedHashSignature(OMNIBUS_ADDRESS);

//         const employeeSafeErc20TransferTransactionData = employeeSafeContract.encode(
//             'execTransaction',
//             [
//                 to,
//                 value,
//                 data,
//                 operation,
//                 safeTxGas,
//                 baseGas,
//                 gasPrice,
//                 gasToken,
//                 refundReceiver,
//                 omnibusApprovedHashSignature
//             ]
//         );

//         transactions.push({
//             to: transfer.fromSafe,
//             value: '0',
//             data: employeeSafeErc20TransferTransactionData,
//             operation: OperationType.Call
//         });

//         onSafeTransactionCreated &&
//             onSafeTransactionCreated({
//                 total: employeeSafeTransfers.length,
//                 created: transactions.length / 2
//             });
//     }

//     console.log(transactions);

//     const nonce = await omnibusSafe.getNonce();

//     const safeTransaction = await omnibusSafe.createTransaction({
//         safeTransactionData: transactions,
//         options: {
//             nonce: nonce + 4
//         }
//     });

//     const safeTxHash = await omnibusSafe.getTransactionHash(safeTransaction);

//     console.log(
//         realTransfers.map(x => `${x.fromSafe},${x.toWallet},${x.amount}`).join('\n')
//     );

//     return {
//         safeTransaction,
//         safeTxHash
//     };
// }

export async function batchSendTokenFromEmployeeSafesToWallets(
    employeeSafeTransfers: {
        fromSafe: string; // ← kept for API-compat but ignored below
        toWallet: string;
        amount: BigNumber;
    }[],
    signer: Signer,
    onSafeTransactionCreated?: (data: { total: number; created: number }) => void
) {
    /* ───────── setup ───────── */
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });

    const omnibusSafe = await Safe.create({
        ethAdapter,
        safeAddress: OMNIBUS_ADDRESS,
        contractNetworks
    });

    const erc20 = new ethers.Contract(EXAMPLE_TOKEN_ADDRESS, gldToken.abi, signer);

    const transactions: MetaTransactionData[] = [];

    /* ───────── “unlock” guard at the top ───────── */
    const TIME_ASSERTION_CONTRACT = '0x958F70e4Fd676c9CeAaFe5c48cB78CDD08b4880d';
    const START_TIMESTAMP = 1_752_796_800; // 18 Jun 2025 00:00 UTC
    const END_TIMESTAMP =
        115792089237316195423570985008687907853269984665640564039457584007913129639935n; // max

    const timestampAssertionAbi = [
        {
            inputs: [
                { internalType: 'uint256', name: '_start', type: 'uint256' },
                { internalType: 'uint256', name: '_end', type: 'uint256' }
            ],
            name: 'assertTimestampInRange',
            outputs: [],
            stateMutability: 'view',
            type: 'function'
        }
    ];
    const tsIface = new ethers.utils.Interface(timestampAssertionAbi);
    const timestampCheckCallData = tsIface.encodeFunctionData('assertTimestampInRange', [
        START_TIMESTAMP,
        END_TIMESTAMP
    ]);

    // transactions.push({
    //     to: TIME_ASSERTION_CONTRACT,
    //     value: '0',
    //     data: timestampCheckCallData,
    //     operation: OperationType.Call
    // });

    /* ───────── token transfers (directly from omnibus) ───────── */
    let created = 0;
    for (const { toWallet, amount } of employeeSafeTransfers) {
        const { data } = await erc20.populateTransaction.transfer(
            toWallet,
            amount.toString()
        );
        if (!data) throw new Error('populateTransaction.transfer returned no data');

        transactions.push({
            to: EXAMPLE_TOKEN_ADDRESS,
            value: '0',
            data,
            operation: OperationType.Call
        });

        created++;
        onSafeTransactionCreated?.({
            total: employeeSafeTransfers.length,
            created
        });
    }

    /* ───────── build omnibus Safe tx ───────── */
    const nonce = await omnibusSafe.getNonce();
    const safeTransaction = await omnibusSafe.createTransaction({
        safeTransactionData: transactions,
        options: { nonce: nonce + 5 } // keep your custom offset
    });
    const safeTxHash = await omnibusSafe.getTransactionHash(safeTransaction);

    return { safeTransaction, safeTxHash };
}
