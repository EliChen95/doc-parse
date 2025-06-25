import { useCallback } from 'react';
import { ReactFlow, Controls, Background, Node, Edge, Position } from '@xyflow/react';
import { Button } from 'antd';
import dagre from 'dagre';
import html2canvas from 'html2canvas';
import '@xyflow/react/dist/style.css';
import '../styles/summary.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const nodeWidth = 200; 
  const nodeHeight = 200;
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 20, 
    ranksep: 100, 
  });

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

interface MindMapProps {
  analysisResult: AnalysisResult; // 新增：接收 props
}

const MindMap: React.FC<MindMapProps> = ({ analysisResult }) => {
  const generateNodesAndEdges = () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;

    if (!analysisResult?.mind_map_data?.topic) {
      console.warn('No mind map data available');
      return { nodes: [], edges: [] };
    }

    const { topic, content, children } = analysisResult.mind_map_data;

    nodes.push({
      id: `node-${nodeId}`,
      position: { x: 0, y: 0 },
      data: { label: topic },
      className: 'summary-title bg-blue-100 border-blue-300',
    });
    const rootId = `node-${nodeId}`;
    nodeId++;

    // if (content) {
    //   const contentId = `node-${nodeId}`;
    //   nodes.push({
    //     id: contentId,
    //     position: { x: 0, y: 0 },
    //     data: { label: content },
    //     className: 'summary-paragraph bg-white border-gray-200',
    //   });
    //   edges.push({ id: `e-${rootId}-${contentId}`, source: rootId, target: contentId });
    //   nodeId++;
    // }

    const processChildren = (parentId: string, childList: any[]) => {
      if (!Array.isArray(childList)) return;

      childList.forEach(child => {
        if (!child?.topic) return;
        const currentId = `node-${nodeId}`;
        nodes.push({
          id: currentId,
          position: { x: 0, y: 0 },
          data: { label: child.topic },
          className: child.children?.length
            ? 'summary-subtitle bg-gray-100 border-gray-300'
            : 'summary-paragraph bg-white border-gray-200',
        });
        edges.push({ id: `e-${parentId}-${currentId}`, source: parentId, target: currentId });
        nodeId++;

        // if (child.content) {
        //   const contentId = `node-${nodeId}`;
        //   nodes.push({
        //     id: contentId,
        //     position: { x: 0, y: 0 },
        //     data: { label: child.content },
        //     className: 'summary-paragraph bg-white border-gray-200',
        //   });
        //   edges.push({ id: `e-${currentId}-${contentId}`, source: currentId, target: contentId });
        //   nodeId++;
        // }

        if (child.children) {
          processChildren(currentId, child.children);
        }
      });
    };

    processChildren(rootId, children || []);
    console.log('Generated nodes:', nodes);
    console.log('Generated edges:', edges);
    return { nodes, edges };
  };

  const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges();
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
      {layoutedNodes.length > 0 ? (
        <ReactFlow
          nodes={layoutedNodes}
          edges={layoutedEdges}
          fitView
          className="bg-gray-50"
          defaultViewport={{ x: 50, y: 50, zoom: 0.4 }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      ) : (
        <p className="p-4 text-red-500">暂无思维导图数据，请检查数据</p>
      )}
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