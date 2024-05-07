export const generateSafeUrl = (safeAddress: string, safeTxHash: string) => {
    return `https://app.safe.global/transactions/tx?id=multisig_${safeAddress}_${safeTxHash}&safe=zksync:${safeAddress}`;
};
