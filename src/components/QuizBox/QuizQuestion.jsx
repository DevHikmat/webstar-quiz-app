import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QuizChoice from "./QuizChoice";
import QuizResult from "./QuizResult";

const QuizQuestion = ({
  question,
  index,
  studentAnswers,
  setStudentAnswers
}) => {
  const [options, setOptions] = useState([]);
  const { quizQuestion, correctAnswer, choice1, choice2, choice3, _id } =
    question;
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const { isFinished } = useSelector((state) => state.quiz);

  useEffect(() => {
    let ansList = new Array(4);
    let count = 0;
    const wrongChoices = [choice1, choice2, choice3];
    let random = Math.round(Math.random() * 3);
    ansList[random] = correctAnswer;
    for (let i = 0; i < ansList.length; i++) {
      if (i !== random) {
        ansList[i] = wrongChoices[count];
        count++;
      }
    }
    setOptions(ansList);

    if (studentAnswers.length > 0) {
      let oldAnswer = studentAnswers.find((ans) => ans.queId === _id);
      oldAnswer && setCurrentAnswer(oldAnswer);
    } else {
      setCurrentAnswer({ queId: null, answer: null });
    }
  }, [question]);

  useEffect(() => {
    if (studentAnswers.length > 0) {
      let oldAnswer = studentAnswers.find((ans) => ans.queId === _id);
      if (oldAnswer)
        setStudentAnswers((prev) =>
          prev.map((item) => {
            if (item.queId === currentAnswer.queId) return currentAnswer;
            else return item;
          })
        );
      else setStudentAnswers((prev) => [...prev, { queId: _id, answer: null }]);
    } else setStudentAnswers([{ queId: _id, answer: null }]);
  }, [question, currentAnswer]);

  return isFinished ? (
    <QuizResult />
  ) : (
    <div id="quiz-question">
      <h6 className="mb-4">
        {index}. {quizQuestion}
      </h6>
      <div className="answers">
        {options?.map((op, index) => {
          return (
            <QuizChoice
              id={_id}
              key={index}
              option={op}
              num={index}
              currentAnswer={currentAnswer ? currentAnswer : null}
              setCurrentAnswer={setCurrentAnswer}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion;
