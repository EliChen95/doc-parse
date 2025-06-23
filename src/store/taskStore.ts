import { create } from 'zustand';

interface Task {
  id: string;
  fileName: string;
  progress: number;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (id: string, fileName: string) => void;
  updateProgress: (id: string, progress: number) => void;
  removeTask: (id: string) => void; 
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (id, fileName) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id,
          fileName,
          progress: 0,
          createdAt: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    })),
  updateProgress: (id, progress) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, progress: Math.min(progress, 100) } : task
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));