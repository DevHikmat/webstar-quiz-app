import React, { useEffect, useState } from 'react';
import { getQuizQuestion } from '@/services/quizService';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  Alert,
  Radio,
  Button,
  Pagination,
  Modal,
  message,
} from 'antd';

const { Title, Text } = Typography;

interface Question {
  _id: string;
  quizQuestion: string;
  choice1: string;
  choice2: string;
  choice3: string;
  correctAnswer: string;
  questionImage?: string | null;
}

const shuffleChoices = (question: Question): string[] => {
  const choices = [
    question.choice1,
    question.choice2,
    question.choice3,
    question.correctAnswer,
  ];
  return choices.sort(() => Math.random() - 0.5);
};

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deadline, setDeadline] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(1); // pagination 1-based
  const [shuffledQuestions, setShuffledQuestions] = useState<
    (Question & { shuffledChoices: string[] })[]
  >([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const { data: quizData, isLoading, isError } = useQuery({
    queryKey: ['quizData', id],
    queryFn: () => getQuizQuestion(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (quizData?.quizTime) {
      const endTime = Date.now() + quizData.quizTime * 60 * 1000;
      setDeadline(endTime);
    }

    if (quizData?.questions?.length) {
      const questionsWithShuffle = quizData.questions.map((q: Question) => ({
        ...q,
        shuffledChoices: shuffleChoices(q),
      }));
      setShuffledQuestions(questionsWithShuffle);
    }
  }, [quizData]);

  const handleChoiceSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitModalOpen(false);
    console.log('Javoblar:', selectedAnswers);
    message.success('Imtihon yakunlandi!');
    // navigate('/quiz-result') yoki boshqa harakat
  };

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '4rem auto' }} />;
  if (isError || !quizData) return <Alert message="Xatolik" type="error" />;

  const currentQuestion = shuffledQuestions[currentIndex - 1]; // pagination 1-based

  return (
    <Card
      title={<Title level={3}>{quizData.title}</Title>}
      style={{ maxWidth: 800, margin: '2rem auto' }}
    >
      {/* Top bar: Timer + End test */}
      <Row justify="space-between" align="middle">
        <Col>
          <Statistic.Countdown
            title="⏰ Qolgan vaqt"
            value={deadline}
            format="mm:ss"
            onFinish={() => setIsSubmitModalOpen(true)}
          />
        </Col>
        <Col>
          <Button type="primary" danger onClick={() => setIsSubmitModalOpen(true)}>
            Imtihonni yakunlash
          </Button>
        </Col>
      </Row>

      <hr style={{ margin: '1.5rem 0' }} />

      {currentQuestion && (
        <>
          <Title level={5}>
            {currentIndex}. {currentQuestion.quizQuestion}
          </Title>

          <Radio.Group
            onChange={(e) => handleChoiceSelect(currentQuestion._id, e.target.value)}
            value={selectedAnswers[currentQuestion._id]}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {currentQuestion.shuffledChoices.map((choice, index) => (
              <Radio key={index} value={choice}>
                {choice}
              </Radio>
            ))}
          </Radio.Group>
        </>
      )}

      {/* Pagination controls */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <Pagination
          current={currentIndex}
          total={shuffledQuestions.length}
          pageSize={1}
          onChange={(page) => setCurrentIndex(page)}
          showSizeChanger={false}
        />
      </div>

      {/* Submit confirmation modal */}
      <Modal
        title="Imtihonni yakunlaysizmi?"
        open={isSubmitModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsSubmitModalOpen(false)}
        okText="Ha, yakunlash"
        cancelText="Bekor qilish"
      >
        <p>Jami {shuffledQuestions.length} ta savoldan {Object.keys(selectedAnswers).length} tasiga javob berdingiz.</p>
      </Modal>
    </Card>
  );
};

export default QuizDetail;
