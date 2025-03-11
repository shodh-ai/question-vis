"use client";

import { useState, useEffect } from 'react';
import { getQuestion } from '@/api/question';
import { Question } from '@/types/question';

const HomePage = () => {
  const [question, setQuestion] = useState<Question>();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestion("example");
        setQuestion(response);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, []);

  return (
    <div className="flex flex-col justify-between items-center h-screen w-screen overflow-hidden">
      <div className='flex h-[15%] w-[90%] m-4 p-4 text-center justify-center items-center'>
        {question?.question}
      </div>
      <div className='h-[80%] w-[80%] m-4 overflow-y-auto overflow-x-hidden border rounded'>
      </div>
    </div >
  );
};

export default HomePage;
