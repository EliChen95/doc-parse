import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import '../styles/summary.css';

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

interface LiteratureGraphProps {
  analysisResult: AnalysisResult;
}

const LiteratureGraph: React.FC<LiteratureGraphProps> = ({ analysisResult }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !analysisResult?.graph_data) return;

    const chart = echarts.init(chartRef.current);
    const { nodes, edges } = analysisResult.graph_data;

    const categories = Array.from(new Set(nodes.map(node => node.type))).map(type => ({ name: type }));
    const data = nodes.map(node => ({
      id: node.id,
      name: node.label,
      category: categories.findIndex(cat => cat.name === node.type),
      symbolSize: node.type === 'original_paper' ? 50 : 30,
    }));
    const links = edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      label: { show: true, formatter: edge.label },
    }));

    const option = {
      backgroundColor: '#f7f8fc',
      tooltip: {},
      series: [
        {
          type: 'graph',
          layout: 'force',
          data,
          links,
          categories,
          roam: true,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
          },
          labelLayout: {
            hideOverlap: true,
          },
          force: {
            repulsion: 100,
            edgeLength: [50, 100],
          },
          edgeLabel: {
            show: true,
            formatter: '{c}',
            fontSize: 12,
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 10 },
          },
        },
      ],
    };

    chart.setOption(option);


    const resizeChart = () => {
      chart.resize();
    };
    window.addEventListener('resize', resizeChart);

    return () => {
      window.removeEventListener('resize', resizeChart);
      chart.dispose();
    };
  }, [analysisResult]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      {analysisResult?.graph_data ? (
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        <p className="p-4 text-red-500">暂无文献关系数据，请检查数据</p>
      )}
    </div>
  );
};

export default LiteratureGraph;