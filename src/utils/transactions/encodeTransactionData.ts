import { CHAIN_ID } from '../../constants';
import { ethers } from 'ethers';
// TODO change this to some config thing or safe utils
const SAFE_TX_TYPEHASH =
    '0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8';

export function encodeTransactionData(
    to: string,
    value: number,
    data: string,
    operation: number,
    safeTxGas: number,
    baseGas: number,
    gasPrice: number,
    gasToken: string,
    refundReceiver: string,
    nonce: number,
    contractAddress: string // Added to allow domainSeparator to calculate based on the contract address
) {
    const safeTxHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            [
                'bytes32',
                'address',
                'uint256',
                'bytes32', // Since data is dynamic and hashed
                'uint8', // Assuming operation is an enum represented as uint8
                'uint256',
                'uint256',
                'uint256',
                'address',
                'address',
                'uint256'
            ],
            [
                SAFE_TX_TYPEHASH,
                to,
                value,
                ethers.utils.keccak256(data),
                operation,
                safeTxGas,
                baseGas,
                gasPrice,
                gasToken,
                refundReceiver,
                nonce
            ]
        )
    );

    return ethers.utils.solidityPack(
        ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
        ['0x19', '0x01', domainSeparator(contractAddress), safeTxHash]
    );
}

// Correct constants based on the latest information provided
const DOMAIN_SEPARATOR_TYPEHASH =
    '0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218';

// Function to calculate the domain separator
function domainSeparator(contractAddress: string) {
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ['bytes32', 'uint256', 'address'],
            [DOMAIN_SEPARATOR_TYPEHASH, CHAIN_ID, contractAddress]
        )
    );
}
