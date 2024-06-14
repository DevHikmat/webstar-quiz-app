import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { QuizService } from "../../services/QuizService";
import {
  changeQuizFailure,
  changeQuizStart,
  getOneQuizSuccess,
  quizExamStart,
  quizFinishFromButton,
} from "../../redux/quizSlice";
import "./Quiz.scss";
import QuizTimer from "./QuizTimer";
import QuizQuestion from "./QuizQuestion";

const QuizStudentView = () => {
  const { quiz } = useSelector((state) => state);
  const { isFinished } = quiz;
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuiz.questions[currentIndex + 1]);
    setCurrentIndex((pre) => pre + 1);
  };
  const handlePrevQuestion = () => {
    setCurrentQuestion(currentQuiz.questions[currentIndex - 1]);
    setCurrentIndex((pre) => pre - 1);
  };

  const handleGetOneQuiz = async () => {
    dispatch(changeQuizStart());
    try {
      const data = await QuizService.getOneQuiz(id);
      const quizList = data.quizzes[0];
      dispatch(getOneQuizSuccess(quizList));
      setCurrentQuiz(quizList);
      setCurrentQuestion(quizList.questions[0]);
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeQuizFailure());
    }
  };
  const handleFinishExam = () => {
    dispatch(quizFinishFromButton());
  };
  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  const handlePopstate = () => {
    window.history.pushState(null, null, window.location.href);
  };
  useEffect(() => {
    handleGetOneQuiz();
    dispatch(quizExamStart());
    handlePopstate();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [id]);


  const handleQuestionChange = (index) => {
    setCurrentIndex(index);
    setCurrentQuestion(currentQuiz.questions[index]);
  };

  const classForPaginationItem = (que, index) => {
    let ans = studentAnswers.find((item) => item.queId === que._id);
    if (index === currentIndex) return "active";
    else if (ans && ans.answer) return "selected";
    else return "";
  };

  return (
    currentQuiz && (
      <div className="quiz-user-view">
        <ul className="quiz-user-view-info d-flex align-items-center">
          <QuizTimer studentAnswers={studentAnswers} setStudentAnswers={setStudentAnswers} />
          <div className="quiz-user-view-info-count">
            <span>Jami savollar soni: </span>
            {currentQuiz.countQuiz} ta
          </div>
        </ul>
        <Divider></Divider>

        <div className="que-pagination">
          <ul className="que-pagination-list">
            {currentQuiz.questions.map((que, index) => {
              return (
                <li
                  onClick={() => handleQuestionChange(index)}
                  key={index}
                  className={`que-pagination-list-item ${classForPaginationItem(
                    que,
                    index
                  )}`}
                >
                  {index + 1}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="quiz-user-view-question">
          {currentQuestion?.questionImage?.url && !isFinished && (
            <img
              src={currentQuestion?.questionImage?.url}
              alt="img"
              className="img-fluid mb-3 w-50"
            />
          )}
          <QuizQuestion
            question={currentQuestion}
            index={currentIndex + 1}
            setStudentAnswers={setStudentAnswers}
            studentAnswers={studentAnswers}
          />
        </div>

        {!isFinished && (
          <div className="quiz-user-view-controls mt-5">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentIndex <= 0}
              icon={<LeftOutlined />}
            >
              Ortga
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={currentIndex >= currentQuiz.questions.length - 1}
              icon={<RightOutlined />}
            >
              Oldinga
            </Button>

            {(currentIndex + 1 === currentQuiz.questions.length ||
              studentAnswers.length === currentQuiz.questions.length) && (
                <Button
                  className="bg-success text-white"
                  onClick={handleFinishExam}
                >
                  Yakunlash
                </Button>
              )}
          </div>
        )}
      </div>
    )
  );
};

export default QuizStudentView;
