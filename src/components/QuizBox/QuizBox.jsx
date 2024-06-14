import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import QuizStudentItem from "./QuizStudentItem";
import QuizTeacherItem from "./QuizTeacherItem";
import "./Quiz.scss";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { QuizService } from "../../services/QuizService";
import {
  changeQuizStart,
  changeQuizSuccess,
  changeQuizFailure,
  quizExamStart,
} from "../../redux/quizSlice";
import QuizAdminBox from "./QuizAdminBox";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const QuizBox = ({ boxtype = "exam", existHomeworks }) => {
  const [form] = Form.useForm();
  const { category, quiz, auth } = useSelector((state) => state);
  const { quizList, isLoading } = quiz;
  const { currentUser } = auth;
  const [open, setOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleModalOk = () => {
    dispatch(quizExamStart());
    setIsOpenModal(false);
    const currentQuiz = quizList.find(item => item._id === quizId);
    const currentQuizCategory = category.category?.find(cat => cat._id === currentQuiz.categoryId);
    if (currentQuizCategory?.type === "exam") navigate(`quiz/${quizId}`);
    else navigate(`${quizId}`);
    message.info("Imtihon boshlandi. Omad!");
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const modalHandler = (id) => {
    if (currentUser.accessExam) {
      setIsOpenModal(true);
      setQuizId(id);
    } else message.warning("Imtihonga ruxsat berilmagan.");
  };

  const quizItemHandler = (item, index) => {
    const { role } = currentUser;
    if (role === "student") {
      return (
        <QuizStudentItem modalHandler={modalHandler} key={index} quiz={item} />
      );
    } else if (role === "teacher") {
      return <QuizTeacherItem key={index} quiz={item} />;
    }
  };

  const handleExamAdd = async (values) => {
    dispatch(changeQuizStart());
    try {
      const data = await QuizService.addQuiz(values);
      message.success(data.message);
      dispatch(changeQuizSuccess());
      setOpen(false);
      form.setFieldsValue({
        title: "",
        categoryId: "",
        countQuiz: "",
        quizTime: "",
      });
    } catch (error) {
      message.warning(error.response.data.message);
      dispatch(changeQuizFailure());
    }
  };

  return (
    <div className="quiz-box" style={{ cursor: "pointer" }}>
      <div className="d-flex justify-content-end">
        {currentUser?.role === "admin" && (
          <>
            <Button
              icon={<PlusOutlined />}
              className="quiz-add-btn"
              onClick={showDrawer}
            />
          </>
        )}
      </div>
      <Drawer
        width={400}
        title={boxtype === "exam" ? "Imtihon qo'shish" : "Uyga vazifa qo'shish"}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          labelAlign="left"
          onFinish={handleExamAdd}
        >
          <Form.Item
            label="Nomi"
            name="title"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input
              placeholder={boxtype === "exam" ? "Imtihon nomi" : "Uy ishi nomi"}
            />
          </Form.Item>
          <Form.Item
            label="Kategoriya"
            name="categoryId"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Select placeholder="Tanlash">
              {category?.category
                ?.filter((item) => item.type === boxtype)
                .map((cat, index) => {
                  return (
                    <Option key={index} value={cat._id}>
                      {cat.name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Savol soni"
            name="countQuiz"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input type="number" placeholder="Nechta savol bo'lsin" />
          </Form.Item>
          <Form.Item
            label="Vaqti(min)"
            name="quizTime"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input type="number" placeholder="beriladigan vaqt" />
          </Form.Item>
          <Button loading={isLoading} htmlType="submit">
            Yaratish
          </Button>
        </Form>
      </Drawer>

      <Divider orientation="center">
        {boxtype === "exam" ? "Imtihonlar" : "Uy ishlari"} bo'limi
      </Divider>
      {currentUser?.role === "admin" && <QuizAdminBox boxtype={boxtype} />}
      <Row gutter={24}>
        {currentUser &&
          existHomeworks ? existHomeworks.map((item, index) => quizItemHandler(item, index)) : quizList?.filter(quiz => {
            let catId = category?.category?.find(cat => cat._id === quiz.categoryId);
            if (catId?.type === boxtype) return quiz;
          }).map((item, index) => quizItemHandler(item, index))
        }
      </Row>

      <Modal
        okText="Roziman"
        cancelText="Bekor qilish"
        onCancel={() => {
          setIsOpenModal(false);
          message.warning("Imtihon bekor qilindi.");
        }}
        onOk={() => handleModalOk()}
        open={isOpenModal}
        title={
          <div className="text-warning d-flex align-items-center gap-2">
            <WarningOutlined />
            <span>Eslatma! Imtihon paytida...</span>
          </div>
        }
      >
        <Divider></Divider>
        <ol className="list-group ps-3">
          <li>Boshqa bo'limlarga o'ta olmaysiz;</li>
          <li>
            Sahifani yangilash mumkin emas; Sababi, Imtihon boshidan boshlanadi
            va har gal turlicha savollar tushadi.
          </li>
          <li>Chiqib ketmang!</li>
          <Divider className="my-3"></Divider>
          <li>
            Agar vaqt tugab qolsa avtomatik tarzda belgilagan javoblaringiz
            tekshiriladi. Belgilamagan savollar hisobga olinmaydi!
          </li>
        </ol>
      </Modal>
    </div>
  );
};

export default QuizBox;
