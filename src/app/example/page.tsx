"use client";

import { useState, useEffect } from 'react';
import { getQuestion } from '@/api/question';

const HomePage = () => {
  const [question, setQuestion] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestion("example");
        setQuestion(response.question);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1>{question}</h1>
    </div>
  );
};

export default HomePage;
