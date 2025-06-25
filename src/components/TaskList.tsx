import { Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { getTaskList, deleteTask } from "../api";

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, setTasks } = useTaskStore();
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 10,
    total: 0,
  });
  const ref = useRef<any>(null);

  useEffect(() => {
    ref.current = setInterval(async () => {
      try {
        const response = await getTaskList(
          pagination.pageNo,
          pagination.pageSize
        );
        setTasks(response.result);
        setPagination((prev) => ({ ...prev, total: response.total }));
      } catch (error) {
        message.error("轮询任务列表失败");
      }
    }, 5000);

    return () => clearInterval(ref.current);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      message.success(`任务已删除`);
    } catch (error) {
      message.error("删除任务失败");
    }
  };

  const statusMap: { [key: string]: string } = {
    "0": "未解析",
    "1": "解析中",
    "2": "解析成功",
    "3": "解析失败",
    "4": "解析完成",
  };

  const columns = [
    {
      title: "文件名",
      dataIndex: "filename",
      key: "filename",
      width: "30%",
      render: (text: string) => (
        <span className="text-[12px] text-[#27264E] truncate">{text}</span>
      ),
    },
    {
      title: "状态",
      dataIndex: "analy_flag",
      key: "analy_flag",
      width: "30%",
      render: (status: string) => (
        <span
          className={`text-[12px] text-[#9091A8] ${
            status === "1" ? "animate-pulse" : ""
          }`}
        >
          {statusMap[status] || "未知"}
        </span>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: "30%",
      render: (text: string) => (
        <span className="text-[12px] text-[#9091A8]">{text}</span>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: "10%",
      render: (_: any, record: { id: number }) => (
        <img
          src="/images/transh.png"
          alt="删除"
          className="w-[16px] h-[16px] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(record.id);
          }}
        />
      ),
    },
  ];

  return (
    <div className="w-full mt-[32px]">
      <h3 className="text-[#333333] font-bold text-[16px] mb-[16px]">
        最近记录
      </h3>
      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        pagination={{
          current: pagination.pageNo,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) =>
            setPagination({ pageNo: page, pageSize, total: pagination.total }),
        }}
        onRow={(record) => ({
          onClick: () => {
            if (record.analy_flag === "2" || record.analy_flag === "4") {
              navigate(`/result/${record.id}`);
            }
          },
          className:
            record.analy_flag === "2" || record.analy_flag === "4"
              ? "cursor-pointer"
              : "",
        })}
        className="bg-[#fff] rounded-[16px] overflow-hidden"
        locale={{
          emptyText: (
            <div className="p-4 text-[12px] text-[#333333] text-center">
              暂无任务
            </div>
          ),
        }}
      />
    </div>
  );
};

export default TaskList;
