import { create } from 'zustand';

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
    content: string | null;
    children: any[];
  };
  related_literature_queries: {
    authors: string[];
    topics: string[];
  };
  references: string[];
}

interface Analysis {
  id: string; // 任务 ID
  result: AnalysisResult;
}

interface AnalysisState {
  analyses: Analysis[];
  setAnalysisResult: (id: string, result: AnalysisResult) => void;
  getAnalysisResult: (id: string) => AnalysisResult | undefined;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  analyses: [],
  setAnalysisResult: (id, result) => set(state => ({
    analyses: [...state.analyses, { id, result }],
  })),
  getAnalysisResult: (id) => get().analyses.find(analysis => analysis.id === id)?.result,
}));