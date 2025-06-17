import { Table, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "../store/taskStore";

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();

  const columns: any = [
    {
      title: "任务 ID",
      dataIndex: "id",
      key: "id",
      width: "40%",
    },
    {
      title: "进度",
      dataIndex: "progress",
      key: "progress",
      width: "60%",
      render: (progress: number) => (
        <Progress
          percent={progress}
          size="small"
          status={progress === 100 ? "success" : "active"}
        />
      ),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Table
        columns={columns}
        dataSource={tasks}
        rowClassName={(record) =>
          record.progress === 100 ? "cursor-pointer" : ""
        }
        onRow={(record) => ({
          onClick: () => {
            if (record.progress === 100) {
              navigate("/result");
            }
          },
        })}
      />
    </div>
  );
};

export default TaskList;
