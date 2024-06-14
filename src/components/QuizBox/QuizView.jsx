import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Divider, Table, message } from "antd";
import {
  changeQuizFailure,
  changeQuizStart,
  changeQuizSuccess,
} from "../../redux/quizSlice";
import { QuizService } from "../../services/QuizService";

const QuizView = () => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleGetOneQuiz = async () => {
    dispatch(changeQuizStart());
    try {
      const data = await QuizService.getOneQuiz(id);
      dispatch(changeQuizSuccess());
      setQuestionList(
        data.quizzes[0].questions?.map((que, index) => ({
          ...que,
          key: index + 1,
        }))
      );
      setCurrentQuiz(data.quizzes[0]);
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeQuizFailure());
    }
  };

  useEffect(() => {
    handleGetOneQuiz();
  }, [id]);

  const columns = [
    { key: "id", width: "50px", title: "#", dataIndex: "key" },
    {
      key: "question",
      title: "Savollar",
      render: (que) => {
        return (
          <p style={{ whiteSpace: "pre-wrap", maxWidth: "400px" }}>
            {que.quizQuestion}
          </p>
        );
      },
    },
    {
      key: "answer",
      title: "To'g'ri javob",
      render: (que) => {
        return <p>{que.correctAnswer}</p>;
      },
    },
  ];

  return (
    currentQuiz && (
      <div className="quiz-view">
        <div className="d-flex justify-content-between align-items-center">
          <h3>{currentQuiz.title}</h3>
        </div>
        <ul className="list-unstyled list-group list-group-horizontal gap-5">
          <li>
            <span className="fw-bold">Savollar soni:</span>{" "}
            {currentQuiz.countQuiz}
          </li>
          <li>
            <span className="fw-bold">Berilgan vaqt:</span>{" "}
            {currentQuiz.quizTime} min
          </li>
        </ul>
        <Divider>Imtihon savollari</Divider>
        <Table columns={columns} dataSource={questionList} />
      </div>
    )
  );
};

export default QuizView;
