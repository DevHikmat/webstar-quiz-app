import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginFormData } from "../../types/api.type";
import "./login.scss";
import { redirectByRole } from "../../utils/redirectByRole";
import { login } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/userSlice";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onSuccess: ({ user, token }) => {
      localStorage.setItem('token', token);
      queryClient.setQueryData(['me'], user); 
    },
  });

  const handleLogin = (values: LoginFormData) => {
    loginUser(values, {
      onSuccess: ({ user }) => {
        redirectByRole(user.role, navigate);
        dispatch(setCurrentUser(user))
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div className="login">
      <div className="loginbox">
        <div className="loginbox__left">
          <img src="/public/quiz-text.webp" alt="login-img" />
        </div>
        <div className="loginbox__right">
          <div className="loginbox__right--logo">
            <img src="/public/webstar-logo.jpg" alt="webstar logo" />
          </div>
          {/* <h2>Login</h2> */}
          <Form form={form} onFinish={handleLogin} labelWrap={true} labelCol={{ span: 6 }} labelAlign="left">
            <Form.Item name="email">
              <Input autoComplete="email" placeholder="Emailingizni kiriting." />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password autoComplete="password" placeholder="Parol" />
            </Form.Item>
            <Button loading={isPending} htmlType="submit" type="primary">
              Kirish
            </Button>
          </Form>
          <p>
            Agar akkauntingiz bo'lmasa,
            <br /> <Link to="/signup">ro'yxatdan o'ting.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
