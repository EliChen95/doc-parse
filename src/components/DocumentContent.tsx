import { Card } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { useDocumentStore } from '../store/documentStore';

const DocumentContent: React.FC = () => {
  const { uploadedDoc } = useDocumentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedDoc && containerRef.current) {
      console.log('Uploaded file:', uploadedDoc);
      const file = uploadedDoc.file;
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isDocx) {
        setError('仅支持 .docx 格式的文档！.doc 文件暂不支持。');
        return;
      }

      file.arrayBuffer().then(arrayBuffer => {
        console.log('ArrayBuffer size:', arrayBuffer.byteLength);
        renderAsync(arrayBuffer, containerRef.current!)
          .then(() => {
            console.log('Document rendered successfully');
            setError(null);
          })
          .catch(err => {
            console.error('Render error:', err);
            setError('无法解析文档，请确保上传有效的 .docx 文件');
          });
      }).catch(err => {
        console.error('File read error:', err);
        setError('无法读取文件，请重试');
      });
    }
  }, [uploadedDoc]);

  return (
    <Card
      title="文档预览"
      className="h-full"
    >
      {uploadedDoc ? (
        error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div
            ref={containerRef}
            className="w-full h-full border border-gray-200 p-4"
          />
        )
      ) : (
        <p>暂无上传的文档</p>
      )}
    </Card>
  );
};

export default DocumentContent;