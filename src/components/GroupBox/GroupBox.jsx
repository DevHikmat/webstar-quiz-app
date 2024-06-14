import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Row,
  Table,
  Popconfirm,
  Select,
  Switch,
  message,
  Drawer,
} from "antd";
import { GroupService } from "../../services/GroupService";
import {
  changeGroupFailure,
  changeGroupStart,
  changeGroupSuccess,
  getGroupsSuccess,
} from "../../redux/groupSlice";
import "./GroupBox.scss";
import { Link } from "react-router-dom";
const { Option } = Select;

const GroupsBox = ({ teacherList }) => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state);
  const { isChange } = groups;
  const [dataSource, setDataSource] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const handleOk = async () => {
    let group = form.getFieldsValue();
    if (!group.name || !group.company) return;
    setOpen(false);
    dispatch(changeGroupStart());
    try {
      const data = await GroupService.addGroup(group);
      dispatch(changeGroupSuccess());
      message.success(data.message);
      form.setFieldsValue({
        name: "",
        company: "",
      });
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeGroupFailure());
    }
  };

  const handleDeleteGroup = async (id) => {
    dispatch(changeGroupStart());
    try {
      const data = await GroupService.deleteGroupById(id);
      dispatch(changeGroupSuccess());
      message.success(data);
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeGroupFailure());
    }
  };

  useEffect(() => {
    setDataSource(
      groups.groups?.map((item, index) => ({
        ...item,
        key: index + 1,
      }))
    );
  }, [groups.groups]);

  const openInputs = (group) => {
    setEditingRow(group._id);
    form.setFieldsValue({
      editName: group.name,
      editCompany: group.company,
    });
  };

  const saveChanges = async () => {
    dispatch(changeGroupStart());
    let { editName, editCompany, editTeacher } = form.getFieldsValue();
    let group = { name: editName, company: editCompany, teacherId: editTeacher };
    try {
      const data = await GroupService.updateGroup(editingRow, group);
      dispatch(changeGroupSuccess());
      message.success(data.message);
      setEditingRow(null);
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeGroupFailure());
    }
  };

  const handleAccessGroup = async (group) => {
    const { _id, accessExam } = group;
    dispatch(changeGroupStart());
    try {
      const data = await GroupService.groupExamToggler(_id, {
        access: !accessExam,
      });
      dispatch(changeGroupSuccess());
      message.success(data.message);
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeGroupFailure());
    }
  };

  const handleGroups = async () => {
    dispatch(changeGroupStart());
    try {
      const data = await GroupService.getAllGroups();
      dispatch(getGroupsSuccess(data.groups));
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeGroupFailure());
    }
  };

  useEffect(() => {
    handleGroups();
  }, [isChange]);

  const groupColumns = [
    { key: "1", title: "#", render: (group) => <>{group.key}</> },
    {
      key: "2",
      title: "Guruh nomi",
      render: (group) => {
        if (group._id === editingRow) {
          return (
            <Form.Item name="editName" className="mb-0">
              <Input />
            </Form.Item>
          );
        } else return <p className="m-0">{group.name}</p>;
      },
    },
    {
      key: "10",
      title: "Ustoz",
      render: (group) => {
        if (group._id === editingRow) {
          return <Form.Item name="editTeacher" className="mb-0">
            <Select>
              {
                teacherList?.map(teach => {
                  return <Option value={teach._id}>{teach.firstname}</Option>
                })
              }
            </Select>
          </Form.Item>
        } else {
          return teacherList?.find((teach) => teach._id === group.teacherId)
            ?.firstname;
        }
      },
    },
    {
      key: "3",
      title: "Kompaniya",
      render: (group) => {
        if (group._id === editingRow) {
          return (
            <Form.Item name="editCompany" className="mb-0">
              <Select>
                <Option value="Webstar">Webstar</Option>
                <Option value="Mars">Mars</Option>
                <Option value="Merit">Merit</Option>
              </Select>
            </Form.Item>
          );
        } else return <p className="m-0">{group.company}</p>;
      },
    },
    {
      key: "4",
      title: "Ruxsat",
      render: (group) => {
        return (
          <Switch
            checkedChildren="Ha"
            unCheckedChildren="yo'q"
            defaultChecked={group.accessExam}
            onChange={() => handleAccessGroup(group)}
          />
        );
      },
    },
    {
      key: "5",
      title: "Actions",
      render: (group) => {
        return (
          <div className="d-flex gap-2">
            <Link to={`${group._id}`}>
              <Button icon={<EyeOutlined />}></Button>
            </Link>
            {group._id === editingRow ? (
              <Button
                loading={groups.isLoading}
                icon={<CheckOutlined />}
                onClick={saveChanges}
              ></Button>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => openInputs(group)}
              ></Button>
            )}
            <Popconfirm
              title="Guruh o'chirilsinmi?"
              okText="Ha"
              cancelText="Yo'q"
              okType="danger"
              onConfirm={() => handleDeleteGroup(group._id)}
            >
              <Button danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="group-box">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => setOpen(true)}
              className="group-add-btn"
              icon={<PlusOutlined />}
            />
          </div>
          <Drawer
            title="Guruh malumotlarini kiriting"
            open={open}
            onClose={() => setOpen(false)}
            placement="right"
          >
            <Form
              form={form}
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
            >
              <Form.Item
                label="Qaysi ustoz:"
                name="teacherId"
                rules={[
                  {
                    required: true,
                    message: "Iltimos ustozni tanlang",
                  },
                ]}
              >
                <Select placeholder="Tanlash">
                  {teacherList.map((teach, index) => {
                    return (
                      <Option key={index} value={teach._id}>
                        {teach.firstname} {teach.lastname}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Guruh nomi:"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Iltimos guruh nomini kiriting",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="company"
                label="Kompaniya:"
                rules={[
                  {
                    required: true,
                    message: "Iltimos kompaniyani tanlang",
                  },
                ]}
              >
                <Select placeholder="Tanlash">
                  <Option value="Webstar">Webstar</Option>
                  <Option value="Mars">Mars</Option>
                  <Option value="Merit">Merit</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Row>
                  <Button onClick={handleOk} htmlType="submit" className="mt-1">
                    Yaratish
                  </Button>
                </Row>
              </Form.Item>
            </Form>
          </Drawer>
        </div>
        <div className="col-12">
          <Form form={form}>
            <Table
              size="small"
              bordered
              pagination={{ defaultPageSize: 10 }}
              columns={groupColumns}
              dataSource={dataSource}
            ></Table>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default GroupsBox;
