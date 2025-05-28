import { getAllQuiz } from "@/services/quizService";
import { useQuery } from "@tanstack/react-query";
import { message, Modal, Row } from "antd";
import QuizItem from "./QuizListItem";
import { useNavigate } from "react-router-dom";

const ConfirmContent = () => {
  return (
    <div>
      <ol className="list-group list-group-flush">
        <li>Imtihon paytida boshqa bo'limlarga o'tilmaydi</li>
        <li>
          Sahifani yangilasangiz barcha oldin belgilagan javoblaringiz o'chib
          ketadi.
        </li>
      </ol>
    </div>
  );
};

const ExamList = () => {
  const { data: quizzes } = useQuery({
    queryKey: ["quizData"],
    queryFn: getAllQuiz,
  });

  const { confirm } = Modal;
  const navigate = useNavigate();

  const showConfirm = (id: string, name: string) => {
    confirm({
      title: "Diqqat bilan o'qing !",
      content: ConfirmContent(),
      okText: `${name} imtihonini boshlash`,
      okType: "danger",
      cancelText: "Bekor qilish",
      onOk() {
        navigate(`${id}`);
      },
      onCancel() {
        message.warning("Bekor qilindi");
      },
    });
  };

  return (
    <div>
      <h5>ExamList</h5>
      <Row gutter={[24, 24]}>
        {quizzes?.map((item) => {
          return (
            <QuizItem showConfirm={showConfirm} key={item._id} item={item} />
          );
        })}
      </Row>
    </div>
  );
};

export default ExamList;
