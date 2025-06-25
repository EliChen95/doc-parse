import { useState } from 'react';

interface DocumentContentProps {
  filePath: string | null;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ filePath }) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-full">
      {filePath ? (
        error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="w-full h-full overflow-y-auto">
            <iframe
              src={filePath}
              title="PDF Preview"
              className="w-full h-full border-none"
              style={{ minHeight: 'calc(100vh - 200px)' }}
              onError={() => setError('无法加载 PDF 文件')}
            />
          </div>
        )
      ) : (
        <p>暂无上传的文档</p>
      )}
    </div>
  );
};

export default DocumentContent;