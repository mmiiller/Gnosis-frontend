import { ethers } from 'ethers';

/**
 * Create a "v=1 approved hash" signature
 *
 * @param signerAddress - The address that pre-approved the data hash
 * @returns A 65-byte signature that passes `v == 1` check
 */
function createApprovedHashSignature(signerAddress: string): string {
    if (!ethers.utils.isAddress(signerAddress)) {
        throw new Error('Invalid address');
    }

    // R: the address padded to 32 bytes (left-padded with zeros)
    const r = ethers.utils.hexZeroPad(signerAddress, 32);

    // S: random or fixed 32-byte value; doesn't matter for approved hash
    const s = ethers.utils.hexlify(ethers.utils.randomBytes(32));

    // V: 1 -> needs to be one byte, hex encoded
    const v = '0x01';

    // Concatenate r + s + v
    const signature = ethers.utils.hexConcat([r, s, v]);

    return signature;
}

// Example usage:
const signer = '0xAbC1234567890abcdefABC1234567890abcdefABC1';
const approvedHashSignature = createApprovedHashSignature(signer);
console.log(approvedHashSignature); // 65-byte signature
