import { useEffect, useState } from 'react';
import { ProposeTransactions } from './components/ProposeTransactions';
import { UploadCSV } from './components/UploadCSV';
import { parseFileAsCSV } from './utils/csv';
import { NavBar } from './components/NavBar';
import { OMNIBUS_ADDRESS } from './constants';
function App() {
    const [file, setFile] = useState<File | null>(null);
    const [omnibusSafe] = useState<string>(OMNIBUS_ADDRESS);
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
                        data
                            .filter(x => {
                                //filter out empt rows
                                return x.from_safe && x.to_wallet && x.amount;
                            })
                            .map(({ from_safe, to_wallet, amount }) => ({
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
