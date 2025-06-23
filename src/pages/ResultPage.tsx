import { useParams } from "react-router-dom";
import DocumentContent from "../components/DocumentContent";
import Summary from "../components/Summary";
import MindMap from "../components/MindMap";
import { useDocumentStore } from "../store/documentStore";
import { useAnalysisStore } from "../store/analysisStore";
import { useEffect, useState } from "react";
import classNames from "classnames";

const ResultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const { id } = useParams<{ id: string }>();
  const { getDocument } = useDocumentStore();
  const { getAnalysisResult } = useAnalysisStore();
  const document = id ? getDocument(id) : undefined;
  const analysisResult = id ? getAnalysisResult(id) : undefined;

  useEffect(() => {
    if (document) {
      useDocumentStore
        .getState()
        .setDocument(document.id, document.name, document.file);
    }
  }, [document]);

  return (
    <div className="flex h-full">
      <div className="w-1/2 h-full overflow-y-auto">
        {document ? (
          <DocumentContent />
        ) : (
          <p className="text-red-500">未找到文档</p>
        )}
      </div>
      <div className="w-1/2 h-full overflow-y-auto">
        <div className="w-full bg-[#373737] flex justify-center gap-[126px]">
          <div
            className={classNames(
              "text-white h-[60px] text-[24px] leading-[36px] py-[12px] cursor-pointer relative hover:border-b border-white",
              activeTab === "summary" && "border-b"
            )}
            onClick={() => setActiveTab("summary")}
          >
            摘要
          </div>
          <div
            className={classNames(
              "text-white h-[60px] text-[24px] leading-[36px] py-[12px] cursor-pointer relative hover:border-b border-white",
              activeTab === "mindMap" && "border-b"
            )}
            onClick={() => setActiveTab("mindMap")}
          >
            脑图
          </div>
        </div>
        <div>
          {activeTab === "summary" &&
            (analysisResult ? (
              <Summary />
            ) : (
              <p className="text-red-500">未找到分析结果</p>
            ))}
          {activeTab === "mindMap" &&
            (analysisResult ? (
              <MindMap />
            ) : (
              <p className="text-red-500">未找到分析结果</p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
