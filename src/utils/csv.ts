export const parseFileAsCSV = async (file: File) => {
    console.log(file);
    const reader = new FileReader();
    reader.readAsText(file);
    const rows = await new Promise<string[][]>((resolve, reject) => {
        reader.onload = () => {
            const result = reader.result as string;
            const data = result
                // remove all \r characters
                .replace(/\r/g, '')
                .split('\n')
                .map(row => row.split(','));
            resolve(data);
        };
        reader.onerror = reject;
    });

    const headers = rows[0];
    if (rows.length < 2) {
        throw new Error('CSV file must have at least one row of data');
        return;
    }
    const listOfObjects = rows.slice(1).map(row => {
        const obj = {};
        row.forEach((cell, index) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            obj[headers[index]] = cell;
        });
        return obj;
    });
    return listOfObjects as {
        from_safe: string;
        to_wallet: string;
        amount: number;
    }[];
};
