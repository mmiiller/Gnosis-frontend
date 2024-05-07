import { Col, Row } from 'antd';
import VibeTokenSvg from '../../assets/vibe-vibe-logo.svg';
import Blockies from 'react-blockies';

export const TransferListItemBody = ({
    transfer
}: {
    transfer: {
        fromSafe: string;
        toWallet: string;
        amount: number;
    };
}) => {
    return (
        <Row gutter={[16, 16]}>
            <Col span={6}>Send Token From Safe:</Col>
            <Col span={18}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            borderRadius: '50%',
                            overflow: 'hidden',
                            height: 30,
                            width: 30,
                            marginRight: 16
                        }}
                    >
                        <Blockies
                            seed={transfer.fromSafe}
                            size={10}
                            scale={3}
                            className="identicon"
                        />
                    </div>
                    <b>zksync:</b>
                    {transfer.fromSafe}
                </div>
            </Col>

            <Col span={6}>Send Token To:</Col>
            <Col span={18}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            borderRadius: '50%',
                            overflow: 'hidden',
                            height: 30,
                            width: 30,
                            marginRight: 16
                        }}
                    >
                        <Blockies
                            seed={transfer.toWallet}
                            size={10}
                            scale={3}
                            className="identicon"
                        />
                    </div>
                    <b>zksync:</b>
                    {transfer.toWallet}
                </div>
            </Col>
            <Col span={6}>Amount:</Col>
            <Col span={18}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {transfer.amount}{' '}
                    {
                        <img
                            src={VibeTokenSvg}
                            style={{
                                height: 20,
                                marginLeft: 8
                            }}
                            alt="Your SVG"
                        />
                    }
                </div>
            </Col>
        </Row>
    );
};
