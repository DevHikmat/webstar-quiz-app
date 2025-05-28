import React from "react";
import { Card, Col } from "antd";
import dayjs from "dayjs";
import { Category, QuizType } from "@/types/api.type";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface QuizItemPropsType {
  item: QuizType;
  showConfirm: (id: string, name: string) => void;
}

const QuizItem: React.FC<QuizItemPropsType> = ({ item, showConfirm }) => {
  const categories = useSelector((state: RootState) => state.category.category);
  const { title, countQuiz, quizTime, createdAt, updatedAt, _id } = item;
  
  const category = categories?.find(
    (cat: Category) => cat._id === item.categoryId
  );

  const imageUrl = category?.image.url ?? "https://www.ethics1st.cipe.org/wp-content/uploads/2024/06/thumbnail-default.jpg";

  return (
    <Col sm={24} md={12} xl={8} xxl={6}>
      <Card
        title={title.toUpperCase()}
        hoverable
        style={{ width: "100%" }}
        onClick={() => showConfirm(_id, title)}
        cover={
          <img
            alt={title}
            src={imageUrl}
            style={{ height: 160, objectFit: "cover" }}
          />
        }
      >
        <p>
          <strong>Savollar soni:</strong> {countQuiz}
        </p>
        <p>
          <strong>Vaqti:</strong> {quizTime} daqiqa
        </p>
        <p>
          <strong>Yaratilgan:</strong>{" "}
          {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
        </p>
        <p>
          <strong>Yangilangan:</strong>{" "}
          {dayjs(updatedAt).format("YYYY-MM-DD HH:mm")}
        </p>
      </Card>
    </Col>
  );
};

export default QuizItem;
