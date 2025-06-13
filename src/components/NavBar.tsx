import { Button, Dropdown, MenuProps } from 'antd';
import YourSvg from '../assets/Toku-logo-blue.svg';
import { CaretDownFilled, PoweroffOutlined } from '@ant-design/icons';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { truncateAddress } from '../utils/address';
import Blockies from 'react-blockies';

export const NavBar = () => {
    const { isConnected } = useAccount();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    console.log({ connect, connectors, error, isLoading, pendingConnector });

    const metamaskConnector = connectors.find(connector => connector.id === 'metaMask');
    return (
        <div
            style={{
                background: 'white',
                display: 'flex',
                borderBottom: '1px solid rgb(220, 222, 224)'
            }}
        >
            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 16
                }}
            >
                <img
                    src={YourSvg}
                    style={{
                        height: 20,
                        marginRight: 8
                    }}
                    alt="Your SVG"
                />
            </div>

            {isConnected ? (
                <WalletConnectionDropDown />
            ) : metamaskConnector ? (
                <div
                    style={{
                        padding: '0px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Button onClick={() => connect({ connector: metamaskConnector })}>
                        Connect to MetaMask
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

const WalletConnectionDropDown = () => {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();

    const addressDisplay = (
        <>
            {' '}
            <div
                style={{
                    borderRadius: '50%',
                    overflow: 'hidden',
                    height: 30,
                    width: 30,
                    marginRight: 8
                }}
            >
                <Blockies
                    seed={address || ''}
                    size={10}
                    scale={3}
                    className="identicon"
                />
            </div>
            <div
                style={{
                    flexGrow: 1,
                    fontSize: 14
                }}
            >
                <div>
                    <b>eth:</b>
                    {truncateAddress(address || '')}
                </div>
                <div
                    style={{
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}
                >
                    {'0.10234 ETH'}
                </div>
            </div>
        </>
    );

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div
                    style={{
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {addressDisplay}
                </div>
            )
        },
        {
            key: '2',
            label: (
                <Button
                    onClick={() => {
                        disconnect();
                    }}
                    danger
                    block
                    icon={<PoweroffOutlined />}
                >
                    Disconnect
                </Button>
            )
        }
    ];

    return (
        <Dropdown menu={{ items }} placement="bottom">
            <div
                style={{
                    padding: '0px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                {addressDisplay}
                <div
                    style={{
                        marginLeft: 16
                    }}
                >
                    <CaretDownFilled />
                </div>
            </div>
        </Dropdown>
    );
};
