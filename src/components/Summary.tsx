import { useState, useEffect } from "react";
import { Spin, Typography } from "antd";
import "../styles/summary.css";

const { Text } = Typography;

interface AnalysisResult {
  filename: string;
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

interface SummaryProps {
  analysisResult: AnalysisResult;
}

const Summary: React.FC<SummaryProps> = ({ analysisResult }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  const generateContent = () => {
    if (!analysisResult?.paper_guide) {
      return '<p class="text-red-500">暂无分析结果，请上传文件</p>';
    }

    const { keywords, knowledge_points, summary } = analysisResult.paper_guide;
    const { references } = analysisResult;

    const safeKeywords = Array.isArray(keywords) ? keywords : [];
    const safeKnowledgePoints = Array.isArray(knowledge_points)
      ? knowledge_points
      : [];
    const safeSummary = summary || "无摘要内容";
    const safeReferences = Array.isArray(references) ? references : [];

    let html = `
      <h2 class="summary-title">论文导读</h2>
      <h3 class="summary-subtitle">摘要</h3>
      <p class="summary-paragraph">${safeSummary
        .split("\n")
        .map((t) => `<p>${t}</p>`)
        .join("")}</p>
      <h3 class="summary-subtitle">关键词</h3>
      <ul class="summary-list">
        ${
          safeKeywords.length > 0
            ? safeKeywords
                .map((kw) => `<li class="summary-list-item">${kw}</li>`)
                .join("")
            : '<li class="summary-list-item">无关键词</li>'
        }
      </ul>
      <h3 class="summary-subtitle">知识点</h3>
      <ul class="summary-list">
        ${
          safeKnowledgePoints.length > 0
            ? safeKnowledgePoints
                .map(
                  (kp) => `
              <li class="summary-list-item">
                <strong>${kp.concept || "未知概念"}</strong>: ${
                    kp.description || "无描述"
                  }
              </li>
            `
                )
                .join("")
            : '<li class="summary-list-item">无知识点</li>'
        }
      </ul>
      <h3 class="summary-subtitle">参考文献</h3>
      <ul class="summary-list">
        ${
          safeReferences.length > 0
            ? safeReferences
                .map((ref) => `<li class="summary-list-item">${ref}</li>`)
                .join("")
            : '<li class="summary-list-item">无参考文献</li>'
        }
      </ul>
    `;
    return html;
  };

  const fullContent = generateContent();
  const characters = fullContent.split("");

  useEffect(() => {
    if (!fullContent) {
      setIsLoading(false);
      return;
    }

    const thinkingTimer = setTimeout(() => {
      setIsLoading(false);
      setIsThinking(true);
    }, 1000);

    let index = 0;
    const generationTimer = setInterval(() => {
      if (index < characters.length) {
        setContent(
          (prev) => prev + (characters[index] ? characters[index] : "")
        );
        index++;
      } else {
        clearInterval(generationTimer);
        setIsThinking(false);
      }
    }, 5);

    return () => {
      clearTimeout(thinkingTimer);
      clearInterval(generationTimer);
    };
  }, [fullContent]);

  return (
    <div className="p-4 h-full overflow-y-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spin tip="模型加载中..." size="large" />
        </div>
      ) : isThinking ? (
        <div>
          {analysisResult?.paper_guide && (
            <Text type="secondary" className="mb-2 block animate-pulse">
              模型正在生成摘要...
            </Text>
          )}
          <div
            className="transition-opacity duration-300 opacity-100"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <div
          className="transition-opacity duration-300 opacity-100"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default Summary;
