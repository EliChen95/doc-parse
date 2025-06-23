import { Progress, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, removeTask } = useTaskStore();

  return (
    <div className="w-full mt-[32px]">
      <h3 className="text-[#333333] font-bold text-[16px] mb-[16px]">
        最近记录
      </h3>
      <div className="bg-[#fff] rounded-[16px] overflow-hidden p-[12px]">
        <div className="flex py-[12px] border-b">
          <div className="w-[30%] text-[12px] text-[#9495AB] px-2 font-semibold">文件名</div>
          <div className="w-[30%] text-[12px] text-[#9495AB] px-2 font-semibold">进度</div>
          <div className="w-[30%] text-[12px] text-[#9495AB] px-2 font-semibold">创建时间</div>
          <div className="w-[10%] text-[12px] text-[#9495AB] px-2 font-semibold">操作</div>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex py-4 ${
                  task.progress === 100 ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
                onClick={() => {
                  if (task.progress === 100) {
                    navigate(`/result/${task.id}`);
                  }
                }}
              >
                <div className="w-[30%] px-2 text-[12px] text-[##27264E] py-3 truncate">
                  {task.fileName}
                </div>
                <div className="w-[30%] px-2">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-[#9091A8]">
                      解析中{task.progress}%
                    </span>
                    <Progress
                      percent={task.progress}
                      size="small"
                      status={task.progress === 100 ? 'success' : 'active'}
                    />
                  </div>
                </div>
                <div className="w-[30%] px-2 text-[12px] text-[#9091A8] flex items-center">
                  {task.createdAt}
                </div>
                <div className="w-[10%] px-2 flex items-center">
                  <img
                    src="/images/transh.png"
                    alt="删除"
                    className="w-[16px] h-[16px] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTask(task.id);
                      message.success(`任务 ${task.fileName} 已删除`);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-[12px] text-[#333333] text-center">
              暂无任务
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;