import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { Divider, Typography } from 'antd';
const { Title } = Typography;
const { Dragger } = Upload;

export const UploadCSV = ({ setFile }: { setFile: (file: File) => void }) => {
    return (
        <div
            style={{
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}
        >
            <Title>Safe Batcher</Title>
            <Divider />

            <Dragger
                multiple={false}
                onChange={e => {
                    if (e.file.originFileObj) setFile(e.file.originFileObj);
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or drag to upload a batch transfer CSV
                </p>
                <p className="ant-upload-hint">
                    The file needs be a CSV with the following columns:
                    <br />
                    <b>fromSafe</b> - The Safe address to send tokens from
                    <br />
                    <b>toWallet</b> - The wallet address to send tokens to
                    <br />
                    <b>amount</b> - The amount of tokens to send
                </p>
            </Dragger>
        </div>
    );
};
