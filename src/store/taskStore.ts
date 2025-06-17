import { create } from 'zustand';

interface Task {
  id: string;
  progress: number;
}

interface TaskState {
  tasks: Task[];
  addTask: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
}

export const useTaskStore = create<TaskState>(set => ({
  tasks: [],
  addTask: id => set(state => ({ tasks: [...state.tasks, { id, progress: 0 }] })),
  updateProgress: (id, progress) =>
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, progress: Math.min(progress, 100) } : task,
      ),
    })),
}));