import React from "react";

const QuizChoice = ({ option, id, currentAnswer, setCurrentAnswer }) => {
  const random = String(Math.random().toFixed(5));
  return (
    <div className="quiz-choice">
      <div className="mb-3 d-flex align-items-center">
        <input
          value={option}
          id={`opt${random}`}
          checked={option === currentAnswer?.answer}
          className="me-2"
          type="radio"
          name={`${id}`}
          onChange={() => setCurrentAnswer({ queId: id, answer: option })}
        />
        <label style={{ cursor: "pointer" }} htmlFor={`opt${random}`}>
          {option}
        </label>
      </div>
    </div>
  );
};

export default QuizChoice;
