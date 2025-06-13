import { useEffect, useState } from 'react';
import { ProposeTransactions } from './components/ProposeTransactions';
import { UploadCSV } from './components/UploadCSV';
import { parseFileAsCSV } from './utils/csv';
import { NavBar } from './components/NavBar';
function App() {
    const [file, setFile] = useState<File | null>(null);
    const [omnibusSafe] = useState<string>('0xCceac3d64F9799F7A3113af26AfAFa9f68d17a60');
    const [downloadTransactions, setDownloadTransactions] = useState(false);
    const [transfers, setTransfers] = useState<
        {
            fromSafe: string;
            toWallet: string;
            amount: number;
        }[]
    >([]);
    useEffect(() => {
        if (file) {
            parseFileAsCSV(file).then(data => {
                if (data) {
                    setTransfers(
                        data.map(({ from_safe, to_wallet, amount }) => ({
                            fromSafe: from_safe,
                            toWallet: to_wallet,
                            amount
                        }))
                    );
                }
            });
        } else {
            setTransfers([]);
        }
    }, [file]);

    if (file)
        return (
            <>
                <NavBar />
                <ProposeTransactions
                    omnibusSafe={omnibusSafe}
                    downloadTransactions={downloadTransactions}
                    transfers={transfers}
                    backToUpload={() => setFile(null)}
                />
            </>
        );
    return (
        <>
            <NavBar />
            <UploadCSV
                downloadTransactions={downloadTransactions}
                setDownloadTransactions={setDownloadTransactions}
                setFile={newFile => {
                    setFile(newFile);
                }}
            />
        </>
    );
}

export default App;
