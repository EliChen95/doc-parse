export interface PaperGuide {
  keywords: string[];
  knowledge_points: { concept: string; description: string }[];
  summary: string;
  is_translation_from_english: boolean;
}

export interface MindMapNode {
  topic: string;
  content: string | null;
  children: MindMapNode[];
}

export interface MindMapData {
  topic: string;
  content: string | null;
  children: MindMapNode[];
}

export interface FileResponse {
  filename: string;
  paper_guide: PaperGuide;
  mind_map_data: MindMapData;
}