import { useState, useCallback } from 'react';
import { ReactFlow, Controls, Background, Node, Edge, Position } from '@xyflow/react';
import { Button } from 'antd';
import dagre from 'dagre';
import html2canvas from 'html2canvas';
import '@xyflow/react/dist/style.css';
import '../styles/summary.css'

// Dagre graph for auto-layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const nodeWidth = 200;
  const nodeHeight = 60;
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: direction === 'LR' ? Position.Left : Position.Top,
      sourcePosition: direction === 'LR' ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const MindMap: React.FC = () => {
  const initialNodes: Node[] = [
    { id: 'root', position: { x: 0, y: 0 }, data: { label: '文档摘要' }, className: 'summary-title bg-blue-100 border-blue-300' },
    { id: 'background', position: { x: 0, y: 0 }, data: { label: '背景与现状' }, className: 'summary-subtitle bg-gray-100 border-gray-300' },
    { id: 'bg-market', position: { x: 0, y: 0 }, data: { label: '市场规模: 2024年5200亿美元，2030年1.8万亿' }, className: 'summary-paragraph bg-white border-gray-200' },
    { id: 'bg-impact', position: { x: 0, y: 0 }, data: { label: '重塑商业模式，提升效率' }, className: 'summary-paragraph bg-white border-gray-200' },
    { id: 'findings', position: { x: 0, y: 0 }, data: { label: '核心发现' }, className: 'summary-subtitle bg-gray-100 border-gray-300' },
    { id: 'f-efficiency', position: { x: 0, y: 0 }, data: { label: '效率提升: 降低25-30%成本' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'f-privacy', position: { x: 0, y: 0 }, data: { label: '隐私与伦理: GDPR, CCPA' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'f-genai', position: { x: 0, y: 0 }, data: { label: '生成式AI: 2026年增长40%' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'f-industries', position: { x: 0, y: 0 }, data: { label: '行业差异: 医疗、金融等' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'f-talent', position: { x: 0, y: 0 }, data: { label: '人才短缺: 120万缺口' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'f-energy', position: { x: 0, y: 0 }, data: { label: '能源消耗: 占全球2%' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'trends', position: { x: 0, y: 0 }, data: { label: '技术趋势' }, className: 'summary-subtitle bg-gray-100 border-gray-300' },
    { id: 't-deep', position: { x: 0, y: 0 }, data: { label: '深度学习: 图像、语音' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 't-nlp', position: { x: 0, y: 0 }, data: { label: 'NLP: 聊天机器人、翻译' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 't-edge', position: { x: 0, y: 0 }, data: { label: '边缘AI: 实时处理' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 't-automl', position: { x: 0, y: 0 }, data: { label: 'AutoML: 降低门槛' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'cases', position: { x: 0, y: 0 }, data: { label: '案例分析' }, className: 'summary-subtitle bg-gray-100 border-gray-300' },
    { id: 'c-medical', position: { x: 0, y: 0 }, data: { label: '医疗: 癌症诊断，误诊率<5%' }, className: 'summary-paragraph bg-white border-gray-200' },
    { id: 'c-financial', position: { x: 0, y: 0 }, data: { label: '金融: 欺诈检测，减少40%损失' }, className: 'summary-paragraph bg-white border-gray-200' },
    { id: 'challenges', position: { x: 0, y: 0 }, data: { label: '挑战与对策' }, className: 'summary-subtitle bg-gray-100 border-gray-300' },
    { id: 'ch-tech', position: { x: 0, y: 0 }, data: { label: '技术壁垒: 系统复杂' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'ch-data', position: { x: 0, y: 0 }, data: { label: '数据质量: 碎片化' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'ch-cost', position: { x: 0, y: 0 }, data: { label: '初始成本: 高投入' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'ch-reg', position: { x: 0, y: 0 }, data: { label: '监管压力: 隐私、公平' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'ch-sol1', position: { x: 0, y: 0 }, data: { label: '合作: 高校、供应商' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'ch-sol2', position: { x: 0, y: 0 }, data: { label: '数据治理: 质量、安全' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'ch-sol3', position: { x: 0, y: 0 }, data: { label: '云服务: 降低成本' }, className: 'summary-list-item bg-white border-gray-200' },
    { id: 'policy', position: { x: 0, y: 0 }, data: { label: '政策与伦理' }, className: 'summary-subtitle bg-gray-100 border-gray-300' },
    { id: 'p-reg', position: { x: 0, y: 0 }, data: { label: '政策: EU AI Act, 中国治理' }, className: 'summary-paragraph bg-white border-gray-200' },
    { id: 'p-ethics', position: { x: 0, y: 0 }, data: { label: '伦理: 公平、透明' }, className: 'summary-paragraph bg-white border-gray-200' },
    { id: 'future', position: { x: 0, y: 0 }, data: { label: '未来展望' }, className: 'summary-subtitle bg-gray-100 border-gray-300' },
    { id: 'f-smart', position: { x: 0, y: 0 }, data: { label: '智能城市、精准医疗' }, className: 'summary-paragraph bg-white border-gray-200' },
    { id: 'f-strategy', position: { x: 0, y: 0 }, data: { label: '企业战略: 研发、合作' }, className: 'summary-paragraph bg-white border-gray-200' },
    { id: 'f-vision', position: { x: 0, y: 0 }, data: { label: '愿景: 解决全球挑战' }, className: 'summary-paragraph bg-white border-gray-200' },
  ];

  const initialEdges: Edge[] = [
    { id: 'e-root-bg', source: 'root', target: 'background' },
    { id: 'e-bg-market', source: 'background', target: 'bg-market' },
    { id: 'e-bg-impact', source: 'background', target: 'bg-impact' },
    { id: 'e-root-find', source: 'root', target: 'findings' },
    { id: 'e-f-eff', source: 'findings', target: 'f-efficiency' },
    { id: 'e-f-priv', source: 'findings', target: 'f-privacy' },
    { id: 'e-f-genai', source: 'findings', target: 'f-genai' },
    { id: 'e-f-ind', source: 'findings', target: 'f-industries' },
    { id: 'e-f-tal', source: 'findings', target: 'f-talent' },
    { id: 'e-f-eng', source: 'findings', target: 'f-energy' },
    { id: 'e-root-trend', source: 'root', target: 'trends' },
    { id: 'e-t-deep', source: 'trends', target: 't-deep' },
    { id: 'e-t-nlp', source: 'trends', target: 't-nlp' },
    { id: 'e-t-edge', source: 'trends', target: 't-edge' },
    { id: 'e-t-auto', source: 'trends', target: 't-automl' },
    { id: 'e-root-case', source: 'root', target: 'cases' },
    { id: 'e-c-med', source: 'cases', target: 'c-medical' },
    { id: 'e-c-fin', source: 'cases', target: 'c-financial' },
    { id: 'e-root-chal', source: 'root', target: 'challenges' },
    { id: 'e-ch-tech', source: 'challenges', target: 'ch-tech' },
    { id: 'e-ch-data', source: 'challenges', target: 'ch-data' },
    { id: 'e-ch-cost', source: 'challenges', target: 'ch-cost' },
    { id: 'e-ch-reg', source: 'challenges', target: 'ch-reg' },
    { id: 'e-ch-sol1', source: 'challenges', target: 'ch-sol1' },
    { id: 'e-ch-sol2', source: 'challenges', target: 'ch-sol2' },
    { id: 'e-ch-sol3', source: 'challenges', target: 'ch-sol3' },
    { id: 'e-root-pol', source: 'root', target: 'policy' },
    { id: 'e-p-reg', source: 'policy', target: 'p-reg' },
    { id: 'e-p-eth', source: 'policy', target: 'p-ethics' },
    { id: 'e-root-fut', source: 'root', target: 'future' },
    { id: 'e-f-smart', source: 'future', target: 'f-smart' },
    { id: 'e-f-strat', source: 'future', target: 'f-strategy' },
    { id: 'e-f-vis', source: 'future', target: 'f-vision' },
  ];

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, 'LR');

  const exportMindMap = useCallback(() => {
    const flowElement = document.querySelector('.react-flow');
    if (flowElement) {
      html2canvas(flowElement as HTMLElement, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'mindmap.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        fitView
        className="bg-gray-50"
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls />
        <Background />
      </ReactFlow>
      <Button
        type="primary"
        onClick={exportMindMap}
        className="absolute top-4 right-4 z-10"
      >
        导出
      </Button>
    </div>
  );
};

export default MindMap;