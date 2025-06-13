import type { CollapseProps } from 'antd';
import { Button, Card } from 'antd';
import { Collapse } from 'antd';
import { Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import Decimal from 'decimal.js';
import Blockies from 'react-blockies';
import { ArrowLeftOutlined as Arrow } from '@ant-design/icons';
import { TransferListItemLabel } from './TransferListItemLabel';
import { TransferListItemBody } from './TransferListItemBody';

export const TransferList = ({
    backToUpload,
    omnibusSafe,
    createTransaction,
    transfers
}: {
    backToUpload: () => void;
    omnibusSafe: string;
    createTransaction: () => void;
    transfers: {
        fromSafe: string;
        toWallet: string;
        amount: number;
    }[];
}) => {
    const [totalTokens, setTotalTokens] = useState(new Decimal(0));
    const [transferListItems, setTransferListItems] = useState<CollapseProps['items']>(
        []
    );
    useEffect(() => {
        setTotalTokens(
            new Decimal(
                transfers
                    .map(({ amount }) => new Decimal(amount))
                    .reduce((acc, curr) => acc.plus(curr), new Decimal(0))
            )
        );

        if (transfers.length > 0) {
            setTransferListItems(
                transfers.map((transfer, index) => ({
                    key: `transfer-${transfer.fromSafe}-${transfer.toWallet}`,
                    label: <TransferListItemLabel index={index} transfer={transfer} />,
                    children: <TransferListItemBody transfer={transfer} />
                }))
            );
        }
    }, [transfers]);
    console.log({
        transfers
    });
    return (
        <div
            style={{
                padding: 16
            }}
        >
            <Button
                type="link"
                onClick={backToUpload}
                style={{
                    padding: 0
                }}
                icon={<Arrow />}
            >
                {'Back To CSV Upload'}
            </Button>
            <Row
                gutter={[16, 16]}
                style={{
                    marginBottom: 16
                }}
            >
                <Col span={24}>
                    <Card
                        style={{
                            borderRadius: 0
                        }}
                    >
                        <Statistic
                            title="Omnibus Safe"
                            valueRender={() => (
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
                                            height: 40,
                                            width: 40,
                                            marginRight: 16
                                        }}
                                    >
                                        <Blockies
                                            seed={omnibusSafe}
                                            size={10}
                                            scale={4}
                                            className="identicon"
                                        />
                                    </div>
                                    <div>{omnibusSafe}</div>
                                </div>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        style={{
                            borderRadius: 0
                        }}
                    >
                        {' '}
                        <Statistic
                            title="Number Of transactions"
                            value={transfers.length}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        style={{
                            borderRadius: 0
                        }}
                    >
                        <Statistic
                            title="Total Tokens To Be Transferred"
                            value={totalTokens.toString()}
                            precision={2}
                        />
                    </Card>
                </Col>
                <Col span={24}>
                    <div
                        style={{
                            background: 'white',
                            border: '1px solid rgb(220, 222, 224)',
                            borderBottomWidth: 0,
                            padding: '8px 16px',
                            display: 'flex'
                        }}
                    >
                        <div
                            style={{
                                flexGrow: 1,
                                fontWeight: 800
                            }}
                        >
                            Employee Safe Transfers
                        </div>
                    </div>
                    <Collapse
                        items={transferListItems}
                        style={{
                            flexGrow: 1,
                            width: '100%',
                            borderRadius: 0,
                            background: 'white'
                        }}
                    />
                </Col>
                <Col span={24}>
                    <Card
                        style={{
                            borderRadius: 0
                        }}
                    >
                        <Button
                            size="large"
                            type="primary"
                            block
                            onClick={createTransaction}
                        >
                            Propose Batch Transactions
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
