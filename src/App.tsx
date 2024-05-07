import { useEffect, useState } from 'react';
import { ProposeTransactions } from './components/ProposeTransactions';
import { UploadCSV } from './components/UploadCSV';
import { parseFileAsCSV } from './utils/csv';
import { NavBar } from './components/NavBar';
function App() {
    const [file, setFile] = useState<File | null>(null);
    const [omnibusSafe] = useState<string>('0xfB56372DA4E583B3F520Ddc72c03bf79e43DAB89');
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
                    transfers={transfers}
                    backToUpload={() => setFile(null)}
                />
            </>
        );
    return (
        <>
            <NavBar />
            <UploadCSV
                setFile={newFile => {
                    setFile(newFile);
                }}
            />
        </>
    );
}

export default App;
