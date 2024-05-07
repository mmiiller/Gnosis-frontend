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
                    Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from
                    uploading company data or other banned files.
                </p>
            </Dragger>
        </div>
    );
};
