import { useParams } from "react-router-dom";
import DocumentContent from "../components/DocumentContent";
import Summary from "../components/Summary";
import MindMap from "../components/MindMap";
import LiteratureGraph from "../components/LiteratureGraph"; 
import { useEffect, useState } from "react";
import classNames from "classnames";
import { getAnalysisResult } from "../api";

interface AnalysisResult {
  filename: string;
  file_path?: string;
  paper_guide: {
    keywords: string[];
    knowledge_points: { concept: string; description: string }[];
    summary: string;
    is_translation_from_english: boolean;
  };
  mind_map_data: {
    topic: string;
    content?: string | null;
    children: any[];
  };
  related_literature_queries: {
    authors: string[];
    topics: string[];
  };
  references?: string[];
  graph_data?: {
    nodes: { id: string; label: string; type: string; details: any }[];
    edges: { source: string; target: string; label: string }[];
  };
}

const ResultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const { id } = useParams<{ id: string }>();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchAnalysisResult = async () => {
        try {
          setLoading(true);
          const response = await getAnalysisResult(parseInt(id, 10));
          setAnalysisResult(response.result);
        } catch (error) {
          console.error('Fetch analysis result error:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalysisResult();
    }
  }, [id]);

  return (
    <div className="flex h-full">
      <div className="w-1/2 h-full overflow-y-auto">
        {analysisResult ? (
          <DocumentContent filePath={analysisResult.file_path || null} />
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
          <div
            className={classNames(
              "text-white h-[60px] text-[24px] leading-[36px] py-[12px] cursor-pointer relative hover:border-b border-white",
              activeTab === "literature" && "border-b"
            )}
            onClick={() => setActiveTab("literature")}
          >
            文献关系
          </div>
        </div>
        <div>
          {activeTab === "summary" && (
            loading ? (
              <p className="p-4">加载中...</p>
            ) : analysisResult ? (
              <Summary analysisResult={analysisResult} />
            ) : (
              <p className="text-red-500">未找到分析结果</p>
            )
          )}
          {activeTab === "mindMap" && (
            loading ? (
              <p className="p-4">加载中...</p>
            ) : analysisResult ? (
              <MindMap analysisResult={analysisResult} />
            ) : (
              <p className="text-red-500">未找到分析结果</p>
            )
          )}
          {activeTab === "literature" && (
            loading ? (
              <p className="p-4">加载中...</p>
            ) : analysisResult ? (
              <LiteratureGraph analysisResult={analysisResult} />
            ) : (
              <p className="text-red-500">未找到分析结果</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;