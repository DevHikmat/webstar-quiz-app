import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { quizFinishSuccess } from "../../redux/quizSlice";
import { HistoryService } from "../../services/HistoryService";
import { message } from "antd";

const QuizTimer = ({ setStudentAnswers, studentAnswers }) => {
  const dispatch = useDispatch();
  const { quiz, auth, category } = useSelector((state) => state);
  const { isFinished, currentQuiz } = quiz;
  let { currentUser } = auth;
  const [interval, setMyInterval] = useState(null)

  const { quizTime, questions } = currentQuiz;
  const targetTime = {
    minutes: quizTime,
    seconds: 0,
  };

  const [remainingTime, setRemainingTime] = useState(targetTime);

  const clearAllMoments = () => {
    clearInterval(interval);
  }

  const countDown = () => {
    setRemainingTime((prevTime) => {
      let minutes =
        prevTime.seconds === 0 ? prevTime.minutes - 1 : prevTime.minutes;
      let seconds = prevTime.seconds === 0 ? 59 : prevTime.seconds - 1;
      return { minutes, seconds };
    });
  };

  useEffect(() => {
    if (
      (!remainingTime.minutes && !remainingTime.seconds) ||
      isFinished
    ) {
      clearAllMoments();
      handleScore();
      setStudentAnswers([])
    }
  }, [remainingTime])

  const handleScore = async () => {
    clearAllMoments();
    let correctCount = 0;
    let wrongAttemps = [];
    questions.forEach((question, index) => {
      const currentAnSt = studentAnswers.find((ans) => ans.queId === question._id);
      if (currentAnSt && currentAnSt.answer === question.correctAnswer) {
        correctCount++;
      } else {
        wrongAttemps.push({
          ...question,
          queNum: index,
          theAns: currentAnSt?.answer || "",
        });
      }
    })
    dispatch(quizFinishSuccess({ correctCount, wrongAttemps }));
    try {
      if (!correctCount) return message.warning("Afsus, bitta ham to'g'ri javob topolmadingiz !");
      let currentCategory = category.category?.find(cat => cat._id === currentQuiz.categoryId);
      let examResult = {
        type: currentCategory.type,
        title: currentQuiz.title,
        countQuiz: currentQuiz.countQuiz,
        correctCount,
        userId: currentUser._id
      };
      const newHistory = await HistoryService.addHistory(examResult);
      message.success(newHistory.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const myInterval = setInterval(() => countDown(remainingTime), 1000);
    setMyInterval(myInterval)
    return () => {
      clearInterval(interval);
    };
  }, []);


  return (
    <div
      className={
        remainingTime.minutes >= 5
          ? "quiz-user-view-timer shadow text-success"
          : "quiz-user-view-timer shadow text-warning"
      }
    >
      <i className="fa-regular fa-clock"></i>
      <div className="d-flex">
        <div className="quiz-user-view-timer-minute">
          {remainingTime.minutes < 10
            ? `0${remainingTime.minutes}`
            : remainingTime.minutes}
        </div>
        :
        <div className="quiz-user-view-timer-secound">
          {remainingTime.seconds < 10
            ? `0${remainingTime.seconds}`
            : remainingTime.seconds}
        </div>
      </div>
    </div>
  );
};

export default QuizTimer;
