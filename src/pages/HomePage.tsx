import { useState, useEffect } from "react";
import { Button } from "antd";
import UploadDocument from "../components/UploadDocument";
import TaskList from "../components/TaskList";
import LoginModal from "../components/LoginModal";

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
      setShowLogin(false);
      localStorage.setItem("loggedIn", "true");
    } else {
      alert("登录失败");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("loggedIn");
  };

  const handleUploadAttempt = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
    }
  };

  return (
    <div className="flex h-[100vh] flex-col items-center bg-[#F7F8FC]">
      {isLoggedIn && (
        <Button onClick={handleLogout} className="self-end m-4">
          登出
        </Button>
      )}
      <div className="w-[820px] flex flex-col mt-[20px]">
        <div className="flex pl-[47px] items-center justify-between">
          <div className="flex flex-col gap-[5px]">
            <h3 className="text-[32px] font-bold text-[#2C2C36]">
              海洋文献智能分析
            </h3>
            <h3 className="text-[16px] text-[#2C2C36]">
              AI分析 · 智能摘要 · 脑图生成
            </h3>
          </div>
          <img className="w-[231px]" src="/images/banner.png" />
        </div>
        <div className="p-[16px] bg-[#fff] rounded-[16px]">
          <UploadDocument
            isLoggedIn={isLoggedIn}
            onUploadAttempt={handleUploadAttempt}
          />
        </div>

        {isLoggedIn && <TaskList />}
      </div>
      <LoginModal visible={showLogin} onLogin={handleLogin} />
    </div>
  );
};

export default HomePage;
