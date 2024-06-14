import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GroupService } from "../../services/GroupService";
import {
  Avatar,
  Button,
  Image,
  Popconfirm,
  Skeleton,
  Switch,
  Table,
  Form,
  Modal,
  Input,
  Select,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserFailure,
  changeUserStart,
  changeUserSuccess,
} from "../../redux/userSlice";

import { UserService } from "../../services/UserService";
const TeacherGrStudents = () => {
  const { isLoading } = useSelector((state) => state.users);
  const [groups, setGroups] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [students, setStudents] = useState(null);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempId, setTempId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleGroups = async () => {
    try {
      const data = await GroupService.getAllGroups();
      setGroups(data.groups);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGroups();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleExamChange = async (id, accessExam) => {
    dispatch(changeUserStart());
    try {
      await UserService.updateUser(id, {
        accessExam: !accessExam,
      });
      message.success("Ruxsat o'zgardi");
      dispatch(changeUserSuccess());
    } catch (error) {
      dispatch(changeUserFailure());
      message.error(error.response.data.message);
    }
  };

  const handleGroupStudents = async () => {
    try {
      const data = await GroupService.getGroupStudents(id);
      setStudents(data.map((user, index) => ({ ...user, key: index + 1 })));
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGroupStudents();
  }, [id, isUpdate]);

  const handleFillModal = (id) => {
    showModal();
    setTempId(id);
    const user = students.find((item) => item._id === id);
    const group = groups.find((group) => group._id === user?.group);
    form.setFieldsValue({
      firstname: user.firstname,
      lastname: user.lastname,
      group: group?._id,
    });
  };

  const saveModalInfo = async () => {
    let values = form.getFieldsValue();
    let failure = false;
    for (let item in values) {
      if (values[item] === "") {
        failure = true;
        break;
      }
    }
    if (failure) return message.warning("Iltimos maydonni bo'sh qoldirmang.");
    let formData = new FormData();
    for (let item in values) {
      if (values[item]) {
        formData.append(`${item}`, values[item]);
      }
    }
    dispatch(changeUserStart());
    try {
      await UserService.updateUser(tempId, formData);
      dispatch(changeUserSuccess());
      setIsUpdate(!isUpdate);
      message.success("Student ma'lumotlari yangilandi.");
      closeModal();
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
  };

  const handleDeleteUser = async (id) => {
    dispatch(changeUserStart());
    try {
      const data = await UserService.deleteUser(id);
      dispatch(changeUserSuccess());
      message.success(data);
      setIsUpdate(!isUpdate);
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
  };

  const columns = [
    { key: "1", title: "#", dataIndex: "key", width: 50 },
    {
      key: "2",
      title: "Rasmi",
      width: 80,
      render: (user) => {
        if (user.profilePicture)
          return (
            <Image
              preview={{ mask: <EyeOutlined /> }}
              width="32px"
              height="32px"
              style={{ borderRadius: "5px" }}
              src={user.profilePicture.url}
            />
          );
        else return <Avatar shape="square" icon={<UserOutlined />} />;
      },
    },
    { key: "3", title: "Ism", dataIndex: "firstname" },
    { key: "4", title: "Familya", dataIndex: "lastname" },
    { key: "5", title: "E-mail", dataIndex: "email" },
    {
      key: "6",
      title: "Ruxsat",
      render: (user) => {
        return (
          <Switch
            checkedChildren="Ha"
            unCheckedChildren="Yo'q"
            defaultChecked={user.accessExam}
            onChange={() => toggleExamChange(user._id, user.accessExam)}
          />
        );
      },
    },
    {
      key: "7",
      title: "Actions",
      render: (user) => {
        return (
          <div className="d-flex">
            <Link to={`${user._id}`}>
              <Button type="primary" icon={<EyeOutlined />}></Button>
            </Link>
            <Button
              className="mx-2"
              onClick={() => handleFillModal(user._id)}
              icon={<EditOutlined />}
            ></Button>
            <Popconfirm
              okText="Ha"
              cancelText="Yo'q"
              title="Rostdan bu o'quvchini o'chirmoqchimisiz?"
              okType="danger"
              onConfirm={() => handleDeleteUser(user._id)}
            >
              <Button danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </div>
        );
      },
      width: 120,
      fixed: "right",
    },
  ];
  return (
    <div>
      {students ? (
        students.length > 0 ? (
          <>
            <Table
              scroll={{ x: 800 }}
              columns={columns}
              bordered
              dataSource={students}
              size="small"
            />
            <Modal
              width={350}
              footer={false}
              title="O'quvchi ma'lumotlari"
              open={isModalOpen}
              onCancel={closeModal}
            >
              <Form
                form={form}
                encType="multipart/form-data"
                labelCol={{ span: 5 }}
                layout="vertical"
              >
                <Form.Item
                  className="mb-2"
                  label="Ism"
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "Ismni kiriting",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="mb-2"
                  label="Familya"
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: "Familyani kiriting",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item className="mb-2" label="Guruh" name="group">
                  <Select>
                    {groups?.map((group, index) => {
                      return (
                        <Select.Option value={group._id} key={index}>
                          {group.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item className="mb-2" label="Parol" name="password">
                  <Input placeholder="Yangi parol berish" />
                </Form.Item>

                <Form.Item>
                  <Button
                    disabled={isLoading}
                    onClick={saveModalInfo}
                    type="primary"
                    className="mt-3"
                  >
                    O'zgarishlarni saqlash
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </>
        ) : (
          "O'quvchi qo'shilmagan."
        )
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default TeacherGrStudents;
