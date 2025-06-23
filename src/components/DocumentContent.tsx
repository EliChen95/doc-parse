import { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { useParams } from 'react-router-dom';
import { useDocumentStore } from '../store/documentStore';

const DocumentContent: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 获取任务 ID
  const { getDocument } = useDocumentStore();
  const document = id ? getDocument(id) : undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (document) {
      console.log('Selected document:', document);
      const file = document.file;
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isPdf = file.type === 'application/pdf';

      if (!isDocx && !isPdf) {
        setError('仅支持 .docx 或 .pdf 格式的文档！');
        return;
      }

      if (isDocx) {
        file.arrayBuffer().then(arrayBuffer => {
          renderAsync(arrayBuffer, containerRef.current!)
            .then(() => setError(null))
            .catch(err => {
              console.error('Docx render error:', err);
              setError('无法解析 .docx 文档，请确保上传有效的文件');
            });
        }).catch(err => {
          console.error('Docx file read error:', err);
          setError('无法读取文件，请重试');
        });
      } else if (isPdf) {
        const url = URL.createObjectURL(file);
        console.log('PDF URL:', url);
        setPdfUrl(url);
        setError(null);
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [document]);

  return (
    <div className="w-full h-full">
      {document ? (
        error ? (
          <p className="text-red-500">{error}</p>
        ) : document.file.type === 'application/pdf' ? (
          <div className="w-full h-full overflow-y-auto">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-full border-none"
                style={{ minHeight: 'calc(100vh - 200px)' }}
              />
            ) : (
              <p>正在加载 PDF...</p>
            )}
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full border border-gray-200 p-4" />
        )
      ) : (
        <p>暂无上传的文档</p>
      )}
    </div>
  );
};

export default DocumentContent;