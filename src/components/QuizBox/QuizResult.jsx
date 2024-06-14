import React from "react";
import { useSelector } from "react-redux";

const QuizResult = () => {
  const { totalScore, currentQuiz } = useSelector((state) => state.quiz);

  return totalScore && currentQuiz ? (
    <div className="quiz-result">
      <div className="row row-cols-1 row-cols-sm-1 row-cols-md-3 row-cols-lg-3">
        <div className="col">
          <h5 className="text-secondary mb-4">Statistika</h5>
          <ul className="list-unstyled">
            <li className="text-success">
              <span className="fw-bold me-3">To'g'ri javoblar soni:</span>
              <span>{totalScore.correctCount}</span>
            </li>
            <li className="text-danger">
              <span className="fw-bold me-3">Xato javoblar soni:</span>
              <span>{currentQuiz.countQuiz - totalScore.correctCount}</span>
            </li>
            <li className="">
              <span className="fw-bold me-3">Umumiy to'plagan ball: </span>
              <span>
                {Math.round(
                  (totalScore.correctCount / currentQuiz.countQuiz) * 100
                )}{" "}
                %
              </span>
            </li>
          </ul>
        </div>
        <div className="col">
          <div>
            {totalScore.wrongAttemps.length === 0 ? (
              <div className="wrong-attemps mb-3">Xato javob yo'q!</div>
            ) : (
              <div className="">
                <a
                  href="#collapseExample"
                  data-bs-toggle="collapse"
                  className="btn btn-sm btn-outline-primary d-block mb-3"
                >
                  <span className="d-block">Xatolarni ko'rib chiqish</span>
                  <span className="text-center fa-solid fa-angle-down d-block"></span>
                </a>
                <div className="collapse" id="collapseExample">
                  <div className="card card-body">
                    {totalScore.wrongAttemps.map((item, index) => {
                      return (
                        <div key={index} className="show-box">
                          <h6 className="mb-2">
                            {item.queNum + 1}. {item.quizQuestion}
                          </h6>
                          <ul className="mb-3 p-0">
                            <li className="bg-success text-dark">
                              <span className="text-white">
                                {item.correctAnswer}
                              </span>
                            </li>
                            <li
                              className={
                                item.choice1 === item.theAns
                                  ? `text-danger`
                                  : ""
                              }
                            >
                              {item.choice1}
                            </li>
                            <li
                              className={
                                item.choice2 === item.theAns
                                  ? `text-danger`
                                  : ""
                              }
                            >
                              {item.choice2}
                            </li>
                            <li
                              className={
                                item.choice3 === item.theAns
                                  ? `text-danger`
                                  : ""
                              }
                            >
                              {item.choice3}
                            </li>
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col">
          {Math.round(
            (totalScore.correctCount / currentQuiz.countQuiz) * 100
          ) >= 60 ? (
            <div className="status">
              <h4 className="text-success">Passed</h4>
            </div>
          ) : (
            <div className="status">
              <h4 className="text-danger">Failed</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="quiz-result">Hisoblanmoqda...</div>
  );
};

export default QuizResult;
