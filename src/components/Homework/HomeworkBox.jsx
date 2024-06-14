import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import QuizBox from '../QuizBox/QuizBox';

const HomeworkBox = () => {
    const { category, quiz } = useSelector(state => state);
    const { quizList } = quiz;
    const [existHomeworks, setExistHomeworks] = useState([]);

    useEffect(() => {
        quizList && quizList.length > 0 && setExistHomeworks(quizList.filter(item => {
            let currentQuiz = category?.category?.find(cat => cat._id === item.categoryId);
            if (currentQuiz && currentQuiz.type === "task") return item;
        }))
    }, [])
    return (
        <div>
            <QuizBox existHomeworks={existHomeworks} />
        </div>
    )
}

export default HomeworkBox