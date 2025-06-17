import { useState, useEffect } from 'react';
import { Button } from 'antd';
import UploadDocument from '../components/UploadDocument';
import TaskList from '../components/TaskList';
import LoginModal from '../components/LoginModal';

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
      setShowLogin(false);
      localStorage.setItem('loggedIn', 'true');
    } else {
      alert('登录失败');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('loggedIn');
  };

  const handleUploadAttempt = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center gap-8">
      {isLoggedIn && (
        <Button onClick={handleLogout} className="self-end">
          登出
        </Button>
      )}
      <UploadDocument isLoggedIn={isLoggedIn} onUploadAttempt={handleUploadAttempt} />
      {isLoggedIn && <TaskList />}
      <LoginModal visible={showLogin} onLogin={handleLogin} />
    </div>
  );
};

export default HomePage;