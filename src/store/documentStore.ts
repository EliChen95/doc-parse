import { create } from 'zustand';

interface Document {
  id: string; // 任务 ID
  name: string;
  file: File;
}

interface DocumentState {
  documents: Document[];
  setDocument: (id: string, name: string, file: File) => void;
  getDocument: (id: string) => Document | undefined;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  setDocument: (id, name, file) => set(state => ({
    documents: [...state.documents, { id, name, file }],
  })),
  getDocument: (id) => get().documents.find(doc => doc.id === id),
}));