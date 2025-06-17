import { create } from 'zustand';

interface DocumentState {
  uploadedDoc: { name: string; file: File } | null;
  setUploadedDoc: (doc: { name: string; file: File }) => void;
}

export const useDocumentStore = create<DocumentState>(set => ({
  uploadedDoc: null,
  setUploadedDoc: doc => set({ uploadedDoc: doc }),
}));