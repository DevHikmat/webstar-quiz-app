import { Card, Col } from "antd";
import { useSelector } from "react-redux";

const QuizStudentItem = ({ quiz, modalHandler }) => {
  const { category } = useSelector((state) => state);
  const { _id, title, countQuiz, quizTime } = quiz;

  return (
    <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-4">
      <div className="quiz-item rounded" onClick={() => modalHandler(_id)}>
        <div className="quiz-item-info">
          <Card
            hoverable
            cover={
              <img
                src={
                  category?.category?.find((cat) => cat._id === quiz.categoryId)
                    ?.image.url
                }
                className="img-fluid"
                alt="category img"
              />
            }
          >
            <Card.Meta
              title={title}
              description={
                <>
                  <p>Savollar soni: {countQuiz} ta</p>
                  <p>Berilgan vaqt: {quizTime} min</p>
                </>
              }
            />
          </Card>
        </div>
      </div>
    </Col>
  );
};

export default QuizStudentItem;
