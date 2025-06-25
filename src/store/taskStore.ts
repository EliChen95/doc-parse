import { create } from 'zustand';

interface Task {
  id: number; 
  filename: string; 
  createTime: string; 
  analy_flag: string;
  graph_flag: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (id: number, filename: string) => void; 
  updateStatus: (id: number, analy_flag: string, graph_flag: string) => void; 
  removeTask: (id: number) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (id, filename) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id,
          filename,
          createTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          analy_flag: '1',
          graph_flag: '1',
        },
      ],
    })),
  updateStatus: (id, analy_flag, graph_flag) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, analy_flag, graph_flag } : task
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  setTasks: (tasks) => set(() => ({ tasks })),
}));