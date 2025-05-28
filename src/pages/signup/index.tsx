import { Button, Form, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./signup.scss";
import { UserRole } from "../../types/enum.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "@/services/authService";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "@/store/userSlice";
import { RootState } from "@/store/store";

interface SignUpFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  group: string;
}

const Signup = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {mutate: signupUser, isPending} = useMutation({
    mutationFn: signup,
    onSuccess: ({ user, token }) => {
      localStorage.setItem('token', token);
      queryClient.setQueryData(['me'], user); 
    },
  });
  const {groups} = useSelector((state: RootState) => state.group);
  const [form] = Form.useForm();
  const navigate = useNavigate();


  const handleSignup = async (values:SignUpFormData) => {
    const sendingData = {...values, role: UserRole.STUDENT };
    signupUser(sendingData, {
      onSuccess: (user) => {
        navigate("/student")
        dispatch(setCurrentUser(user));
      },
      onError: (err) => {
        console.log(err);
      },
    })
  };

  return (
    <div className="signup">
      <div className="signupbox">
        <div className="signupbox__left">
          <img src="/public/quiz-text.webp" alt="signup-img" />
        </div>
        <div className="signupbox__right">
          <div className="signupbox__right--logo">
            <img src="/public/webstar-logo.jpg" alt="webstar logo" />
          </div>
          <Form onFinish={handleSignup} form={form} labelWrap={true} labelCol={{ span: 6 }} labelAlign="left">
            <Form.Item name="firstname">
              <Input autoComplete="firstname" placeholder="Ismingizni kiriting." />
            </Form.Item>
            <Form.Item name="lastname">
              <Input autoComplete="lastname" placeholder="Familyangizni kiriting." />
            </Form.Item>
            <Form.Item name="email">
              <Input autoComplete="email" placeholder="Emailingizni kiriting." />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password autoComplete="password" placeholder="Parol" />
            </Form.Item>
            <Form.Item name="group" initialValue={""}>
              <Select>
                {groups?.map((item) => {
                  return (
                    <Select.Option value={item._id} key={Math.random()}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Button loading={isPending} htmlType="submit" type="primary">
              Ro'yxatdan o'tish
            </Button>
          </Form>
          <p>
            Agar akkauntingiz allaqachon bo'lsa,
            <br /> <Link to="/login">Kirish bo'limiga o'ting.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
