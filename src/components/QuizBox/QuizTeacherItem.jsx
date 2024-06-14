import { Col } from "antd";
import React from "react";

const QuizTeacherItem = ({ quiz }) => {
  const { title, countQuiz, quizTime } = quiz;

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-4">
      <div className="quiz-user-item shadow-sm h-100 cursor-pointer p-3 rounded">
        <div className="quiz-user-item-brand"></div>
        <div className="quiz-item-info border-start ps-4">
          <h5>{title}</h5>
          <p>Savollar soni: {countQuiz} ta</p>
          <p>Berilgan vaqt: {quizTime} min</p>
        </div>
      </div>
    </Col>
  );
};

export default QuizTeacherItem;
