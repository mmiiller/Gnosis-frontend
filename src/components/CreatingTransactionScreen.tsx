import { Button, Card, Divider, Spin, Timeline } from 'antd';
import { Col, Row } from 'antd';
import Blockies from 'react-blockies';
import { CheckCircleTwoTone, CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const CreatingTransactionScreen = ({
    createTransactionStep,
    omnibusSafe,
    progress,
    transactionHash,
    rawTransactionData,
    downloadTransactions,
    setCreatingTransaction,
    setCreateTransactionStep,
    backToUpload
}: {
    createTransactionStep: number;
    omnibusSafe: string;
    rawTransactionData: string;
    progress: { total: number; created: number };
    transactionHash: string;
    downloadTransactions: boolean;
    setCreatingTransaction: (arg0: boolean) => void;
    setCreateTransactionStep: (arg0: number) => void;
    backToUpload: () => void;
}) => {
    return (
        <div
            style={{
                padding: 16,
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Card
                style={{
                    borderRadius: 0
                }}
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '64px 0 32px 0px'
                }}
            >
                {createTransactionStep < 3 ? (
                    <Spin size="large" />
                ) : (
                    <CheckCircleTwoTone
                        style={{
                            fontSize: 64,
                            color: '#52c41a'
                        }}
                    />
                )}
                <div
                    style={{
                        marginTop: 32,
                        fontWeight: 800,
                        fontSize: 20
                    }}
                >
                    {downloadTransactions ? (
                        <>
                            {createTransactionStep === 0
                                ? 'Generating Transaction, this can take several minutes'
                                : 'Transaction Generated'}
                        </>
                    ) : (
                        <>
                            {' '}
                            {createTransactionStep === 0 &&
                                'Generating Transaction, this can take several minutes'}
                            {createTransactionStep === 2 && 'Signing Transaction'}
                            {createTransactionStep === 3 && 'Proposed Transaction'}
                        </>
                    )}
                </div>
                <Divider />
                <Timeline
                    style={{
                        marginTop: 16,
                        width: 700,
                        paddingLeft: 32
                    }}
                >
                    <Timeline.Item color={'blue'}>
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
                                    seed={omnibusSafe}
                                    size={10}
                                    scale={3}
                                    className="identicon"
                                />
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontWeight: 800
                                    }}
                                >
                                    Transaction Created
                                </div>
                                <div>
                                    Encoding Transaction: {progress.created} /{' '}
                                    {progress.total}
                                </div>
                            </div>
                        </div>
                    </Timeline.Item>
                    <Timeline.Item color={createTransactionStep > 1 ? 'blue' : 'gray'}>
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
                                    seed={omnibusSafe}
                                    size={10}
                                    scale={3}
                                    className="identicon"
                                />
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontWeight: 800
                                    }}
                                >
                                    Safe Transaction Hash
                                </div>
                                <div>
                                    {transactionHash}
                                    {transactionHash && (
                                        <CopyToClipboard text={transactionHash}>
                                            <span>
                                                <CopyOutlined
                                                    style={{
                                                        cursor: 'pointer',
                                                        marginLeft: 4
                                                    }}
                                                />
                                            </span>
                                        </CopyToClipboard>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Timeline.Item>
                    {downloadTransactions ? (
                        <></>
                    ) : (
                        <>
                            <Timeline.Item
                                color={createTransactionStep > 1 ? 'blue' : 'gray'}
                            >
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
                                            seed={omnibusSafe}
                                            size={10}
                                            scale={3}
                                            className="identicon"
                                        />
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: 800
                                            }}
                                        >
                                            Sign Transaction
                                        </div>
                                    </div>
                                </div>
                            </Timeline.Item>
                            <Timeline.Item
                                color={createTransactionStep > 2 ? 'blue' : 'gray'}
                            >
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
                                            seed={omnibusSafe}
                                            size={10}
                                            scale={3}
                                            className="identicon"
                                        />
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: 800
                                            }}
                                        >
                                            Transaction Proposed
                                        </div>
                                    </div>
                                </div>
                            </Timeline.Item>
                        </>
                    )}
                </Timeline>

                {createTransactionStep === 3 && (
                    <>
                        <Divider />
                        <Row gutter={16}>
                            <Col span={12}>
                                <Button
                                    type={'primary'}
                                    icon={<LinkOutlined />}
                                    onClick={() => {
                                        // download the transaction as a txt file
                                        const element = document.createElement('a');
                                        const file = new Blob([rawTransactionData], {
                                            type: 'text/plain'
                                        });
                                        element.href = URL.createObjectURL(file);
                                        element.download = 'rawTransaction.txt';
                                        document.body.appendChild(element); // Required for this to work in FireFox
                                        element.click();
                                        element.remove();
                                    }}
                                    target="_blank"
                                >
                                    {'Download Raw Transaction'}
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    onClick={() => {
                                        setCreatingTransaction(false);
                                        setCreateTransactionStep(0);
                                        backToUpload();
                                    }}
                                >
                                    {'Create Another Transaction'}
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Card>
        </div>
    );
};
