import { ArrowRightOutlined } from '@ant-design/icons';
import VibeTokenSvg from '../../assets/vibe-vibe-logo.svg';
import { truncateAddress } from '../../utils/address';

export const TransferListItemLabel = ({
    index,
    transfer
}: {
    index: number;
    transfer: {
        fromSafe: string;
        toWallet: string;
        amount: number;
    };
}) => {
    return (
        <div
            style={{
                display: 'flex',

                alignItems: 'center',
                width: '100%'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div
                    style={{
                        marginRight: 16,
                        fontSize: 13,
                        fontWeight: 300
                    }}
                >
                    {index + 1}
                </div>
                <div
                    style={{
                        marginRight: 16
                    }}
                >
                    MatToken: <b>transfer</b>
                </div>
            </div>
            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div
                    style={{
                        minWidth: 120
                    }}
                >
                    {truncateAddress(transfer.fromSafe)}
                </div>

                <ArrowRightOutlined
                    style={{
                        margin: '0 8px'
                    }}
                />
                <div
                    style={{
                        minWidth: 120,
                        textAlign: 'right'
                    }}
                >
                    {truncateAddress(transfer.toWallet)}
                </div>
            </div>
            <div></div>
            <div> {transfer.amount}</div>
            <img
                src={VibeTokenSvg}
                style={{
                    height: 20,
                    marginLeft: 8
                }}
                alt="Your SVG"
            />
        </div>
    );
};
