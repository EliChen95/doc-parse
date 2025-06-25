import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam, UploadFile, UploadProps } from "antd/lib/upload";
import { useTaskStore } from "../store/taskStore";
import { uploadDocument } from "../api";

interface UploadDocumentProps {
  isLoggedIn: boolean;
  onUploadAttempt: () => void;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  isLoggedIn,
  onUploadAttempt,
}) => {
  const { addTask, updateStatus } = useTaskStore();

  const customRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    if (typeof file === "string") {
      onError?.(new Error("Invalid file"));
      return;
    }

    const taskId = Math.random().toString(36).substring(7);
    addTask(parseInt(taskId, 36), (file as File).name);

    try {
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await axios.post('/analyze-pdf/', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   onUploadProgress: (progressEvent) => {
      //     if (progressEvent.total) {
      //       const percent = Math.round((progressEvent.loaded / progressEvent.total) * 50);
      //       updateProgress(taskId, percent);
      //     }
      //   },
      // });

      // const analysisInterval = setInterval(() => {
      //   const currentProgress = useTaskStore.getState().tasks.find(t => t.id === taskId)?.progress || 50;
      //   if (currentProgress < 100) {
      //     updateProgress(taskId, currentProgress + 10);
      //   } else {
      //     clearInterval(analysisInterval);
      //   }
      // }, 500);

      await uploadDocument(file as File);
      message.success(`${(file as File).name} 上传和分析完成`);
      onSuccess?.({}, file);
    } catch (error) {
      console.error("Upload or analysis error:", error);
      updateStatus(parseInt(taskId, 36), "3", "3");
      message.error(`${(file as File).name} 上传或分析失败`);
      onError?.(error as Error);
    }
  };

  const props: UploadProps = {
    name: "file",
    accept: ".pdf",
    showUploadList: false,
    customRequest,
    beforeUpload: (file: UploadFile) => {
      onUploadAttempt();
      if (!isLoggedIn) {
        message.error("请先登录！");
        return Upload.LIST_IGNORE;
      }

      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        message.error("只能上传 .pdf 格式的文档！");
        return false;
      }

      const isLt10M = file.size! / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("文件大小不能超过 10MB！");
        return false;
      }
      return true;
    },
    onChange: (info: UploadChangeParam) => {
      if (info.file.status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <div className="flex justify-center items-center h-64 w-full border-2 border-dashed border-[#E8E9F2] rounded-lg bg-[#FAFAFF]">
      <Upload {...props}>
        <div className="text-center">
          <div className="flex gap-[20px] items-center justify-center mb-[22px]">
            {/* <img className="w-[64px]" src="/images/doc.png" /> */}
            <img className="w-[64px]" src="/images/pdf.png" />
          </div>
          <Button
            className="text-[16px] text-[#9091A8] bg-transparent border-none hover:!bg-transparent gap-0 shadow-none group"
            disabled={!isLoggedIn}
          >
            点击或将
            <span className="text-black group-hover:text-[#4096ff] font-bold">
              文件
            </span>
            拖拽到此处上传
          </Button>
          <p className="mt-[12px] text-[#C9CAD9] text-[12px]">
            文档格式：支持 PDF（含扫描件）
          </p>
          <p className="mt-[6px] text-[#C9CAD9] text-[12px]">
            文档大小：文件最大支持 10MB
          </p>
          <p className="mt-[6px] text-[#C9CAD9] text-[12px]">
            文档页数：PDF 最多支持 100 页
          </p>
        </div>
      </Upload>
    </div>
  );
};

export default UploadDocument;
