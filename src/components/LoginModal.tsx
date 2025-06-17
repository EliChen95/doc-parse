import { Modal, Form, Input } from 'antd';

interface LoginModalProps {
  visible: boolean;
  onLogin: (username: string, password: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onLogin }) => {
  const [form] = Form.useForm();

  const handleLogin = () => {
    form.validateFields().then(values => {
      onLogin(values.username, values.password);
    });
  };

  return (
    <Modal title="登录" visible={visible} onOk={handleLogin} onCancel={() => form.resetFields()}>
      <Form form={form}>
        <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
          <Input placeholder="账号" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder="密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;