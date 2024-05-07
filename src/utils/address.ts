export const truncateAddress = (address: string, top: number = 4, bottom: number = 4) => {
    return `${address.slice(0, top + 2)}...${address.slice(-bottom)}`;
};
