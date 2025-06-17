import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload';
import { useDocumentStore } from '../store/documentStore';
import { useTaskStore } from '../store/taskStore';
import { useEffect } from 'react';

interface UploadDocumentProps {
  isLoggedIn: boolean;
  onUploadAttempt: () => void;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({ isLoggedIn, onUploadAttempt }) => {
  const { setUploadedDoc } = useDocumentStore();
  const { addTask, updateProgress } = useTaskStore();

  useEffect(() => {
    const interval = setInterval(() => {
      useTaskStore.getState().tasks.forEach(task => {
        if (task.progress < 100) {
          updateProgress(task.id, task.progress + 10);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [updateProgress]);

  const customRequest: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      if (typeof file !== 'string') {
        onSuccess?.({}, file as any);
      } else {
        onError?.(new Error('Invalid file'));
      }
    }, 1000); 
  };

  const props: UploadProps = {
    name: 'file',
    accept: '.docx', 
    showUploadList: false,
    customRequest,
    beforeUpload: (file: UploadFile) => {
      onUploadAttempt();
      if (!isLoggedIn) {
        message.error('请先登录！');
        return Upload.LIST_IGNORE;
      }

      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isDocx) {
        message.error('只能上传 .docx 格式的文档！');
        return false;
      }

      const isLt10M = file.size! / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB！');
        return false;
      }
      return true;
    },
    onChange(info: UploadChangeParam) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        const taskId = Math.random().toString(36).substring(7);
        addTask(taskId);
        setUploadedDoc({
          name: info.file.name,
          file: info.file.originFileObj as File,
        });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <div className="flex justify-center items-center h-64 w-full max-w-2xl mx-auto border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <Upload {...props}>
        <div className="text-center">
          <Button icon={<UploadOutlined />} disabled={!isLoggedIn}>
            点击或拖拽上传 Word 文档
          </Button>
          <p className="mt-2 text-gray-500">仅支持 .docx 文件</p>
        </div>
      </Upload>
    </div>
  );
};

export default UploadDocument;