import React, { useEffect, useState } from "react";
import { Button, Divider, Form, InputNumber, Popconfirm, Progress, Skeleton, Space, Table, message, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserFailure,
  changeUserStart,
  changeUserSuccess,
} from "../../redux/userSlice";
import { UserService } from "../../services/UserService";
import { useParams } from "react-router-dom";
import { HistoryService } from "../../services/HistoryService";
import moment from "moment";
import { DeleteOutlined } from "@ant-design/icons";

const HistoryBox = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [history, setHistory] = useState(null);
  const { id } = useParams();
  const [editingHisId, setEditingHisId] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [isHistoryChange, setIsHistoryChange] = useState(false);

  const getOneUser = async () => {
    let tempData;
    if (currentUser.role !== "student") {
      dispatch(changeUserStart());
      try {
        const data = await UserService.getOneUser(id);
        tempData = data.history.map(item => ({ ...item, examMoment: moment(item.createdAt).format('lll') }));
        dispatch(changeUserSuccess());
      } catch (error) {
        message.error(error.response.data.message);
        dispatch(changeUserFailure());
      }
    } else {
      tempData = currentUser.history;
    }
    setHistory(tempData?.map((item, index) => ({ ...item, key: index + 1 })));
  };

  const handleDeleteHistory = async (id) => {
    try {
      await HistoryService.deleteHistory(id);
      setIsHistoryChange(!isHistoryChange);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getOneUser();
  }, [id, isHistoryChange]);

  const handleAddPractice = (his) => {
    setEditingHisId(his._id);
    form.setFieldsValue({
      practice: his.practice || 0
    })
  }
  const handleSavePractice = async (id) => {
    let { practice } = form.getFieldsValue();
    if (!practice) return message.warning("Iltimos bahoni kiriting!");
    let formData = new FormData()
    formData.append('practice', practice)
    try {
      setEditingHisId(null);
      let res = await HistoryService.updateHistory(id, formData);
      api.success({ message: res.message })
      setIsHistoryChange(!isHistoryChange);
    } catch (error) {
      console.log(error);
    }
  }
  const columns = [
    { key: "key", title: "#", dataIndex: "key", width: 50, fixed: "left" },
    {
      key: "exam",
      title: "Imtihon nomi",
      dataIndex: "title",
    },
    { key: "quizCount", title: "Savollar soni", dataIndex: "countQuiz" },
    { key: "date", title: "Sana", width: 200, dataIndex: "examMoment" },
    { key: "result", title: "Yechildi", dataIndex: "correctCount" },
    {
      key: "percent",
      title: "Test",
      render: (his) => {
        return `${Math.round((his.correctCount / his.countQuiz) * 100)}%`;
      },
    },
    {
      key: "practice",
      width: "180px",
      title: "Amaliyot",
      render: (his) => {
        if (his.type === "exam") {
          if (currentUser.role !== "student") return <div>
            {editingHisId === his._id ?
              <Form form={form} className="d-flex align-items-center gap-2" onFinish={() => handleSavePractice(his._id)}>
                <Form.Item className="mb-0" name="practice">
                  <InputNumber min="0" max="100" style={{ width: "80px" }} />
                </Form.Item>
                <Button htmlType="submit">save</Button>
              </Form>
              : <Button onClick={() => handleAddPractice(his)}>{his.practice || 0}%</Button>}
          </div>
          else return <p>{his.practice || 0}%</p>
        }
        else return <p>mavjud emas!</p>
      }
    },
    {
      key: "result",
      title: "Umumiy(%)",
      render: (his) => {
        let result = (his.correctCount / his.countQuiz) * 100;
        if (his.type === "exam") {
          result = (result + Number(his.practice) | 0) / 2;
        }
        result = Math.round(result);
        return <Space className="d-flex justify-content-center align-items-center">
          <Progress status="active" size={60} type="circle" strokeColor={result >= 60 ? "green" : "red"} percent={result}>%</Progress>
        </Space>
      }
    },
    {
      key: "result",
      title: "Status",
      render: (his) => {
        let result = (his.correctCount / his.countQuiz) * 100;
        if (his.type === "exam") {
          if (his.practice) result = (result + 1 * his.practice) / 2;
          else result = result / 2;
        }
        console.log(result)
        return Math.round(result) >= 60 ? (
          <span className="text-success">passed</span>
        ) : (
          <span className="text-danger">failed</span>
        );
      },
      width: 100,
      fixed: "right",
    },
  ];

  if (currentUser.role === 'admin') columns.push({
    key: 'action', title: "O'chirish", render: (his) => <Popconfirm title="Ishonchingiz komilmi?" okText="ha" cancelText="yo'q" onConfirm={() => handleDeleteHistory(his._id)}>
      <Button icon={<DeleteOutlined />}></Button>
    </Popconfirm>
  })

  return (
    <div className="history-box pt-3">
      {contextHolder}
      {history ? (
        history.length > 0 ? (
          <div>
            <Divider>UYGA VAZIFALAR TARIXI</Divider>
            <Table
              bordered
              scroll={{ x: 900 }}
              columns={columns}
              dataSource={history.filter(his => his.type === "task")}
              pagination={false}
            />
            <Divider className="mt-5">IMTIHONLAR TARIXI</Divider>
            <Table
              bordered
              scroll={{ x: 900 }}
              columns={columns}
              dataSource={history.filter(his => his.type === "exam")}
              pagination={false}
            />
          </div>
        ) : (
          <div>
            <h6 className="mt-3">Tarix mavjud emas!</h6>
          </div>
        )
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default HistoryBox;
