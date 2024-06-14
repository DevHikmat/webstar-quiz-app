import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Skeleton,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthService } from "../../services/AuthService";
import { UserService } from "../../services/UserService";
import {
  changeUserStart,
  changeUserSuccess,
  changeUserFailure,
  getAllUsersSuccess,
} from "../../redux/userSlice";
import TeacherItem from "./TeacherItem";
import "./TeacherBox.scss";
import { PlusOutlined } from "@ant-design/icons";

const TeacherBox = () => {
  const { isLoading, isChange } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleTeachers = async () => {
    dispatch(changeUserStart());
    try {
      let data = await UserService.getTeachers();
      setDataSource(data);
      dispatch(getAllUsersSuccess());
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
  };

  const handleAddTeacher = async (values) => {
    dispatch(changeUserStart());
    try {
      await AuthService.signup({ ...values, role: "teacher" });
      const teachers = await UserService.getTeachers();
      setDataSource(teachers)
      dispatch(changeUserSuccess());
      setOpen(false);
      message.success("Ustoz qo'shildi");
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
  };
  useEffect(() => {
    handleTeachers();
  }, [isChange]);

  return (
    <div className="teacher-box">
      <div className="d-flex justify-content-end">
        <Button
          className="teacher-add-btn"
          onClick={() => setOpen(true)}
          icon={<PlusOutlined />}
        />
      </div>
      <Drawer
        title="Ustoz ma'lumotlari"
        onClose={() => setOpen(false)}
        placement="right"
        open={open}
      >
        <Form
          onFinish={handleAddTeacher}
          form={form}
          labelAlign="left"
          labelCol={{
            span: 7,
          }}
        >
          <Form.Item
            name="subject"
            label="Fan nomi"
            rules={[
              {
                required: true,
                message: "maydonni to'ldiring",
              },
            ]}
          >
            <Input placeholder="Fan nomini kiriting" />
          </Form.Item>
          <Form.Item
            name="firstname"
            label="Ism"
            rules={[
              {
                required: true,
                message: "maydonni to'ldiring",
              },
            ]}
          >
            <Input placeholder="ism" />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Familya"
            rules={[
              {
                required: true,
                message: "maydonni to'ldiring",
              },
            ]}
          >
            <Input placeholder="familya" />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: "maydonni to'ldiring",
              },
            ]}
          >
            <Input placeholder="e-mail" type="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Parol"
            rules={[
              {
                required: true,
                message: "maydonni to'ldiring",
              },
            ]}
          >
            <Input.Password placeholder="parol" />
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} htmlType="submit">
              Yaratish
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Divider>Barcha ustozlar</Divider>
      <Row gutter={24}>
        {isLoading ? (
          <>
            <Col span={6}>
              <Skeleton block={false} active />
            </Col>
            <Col span={6}>
              <Skeleton block={false} active />
            </Col>
            <Col span={6}>
              <Skeleton block={false} active />
            </Col>
            <Col span={6}>
              <Skeleton block={false} active />
            </Col>
          </>
        ) : (
          dataSource?.map((teach, index) => {
            return <TeacherItem key={index} teach={teach} />;
          })
        )}
      </Row>
    </div>
  );
};

export default TeacherBox;
