"use client";

import { useState, useEffect, useMemo } from 'react';
import { getQuestion } from '@/api/question';
import { Question } from '@/types/question';
import visualization from '../../../data/visulaisation.json';
import Visualiser from '@/components/Visualiser';
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

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

  const renderedQuestion = useMemo(() => {
    if (!question?.question) return null;
    if (typeof window === 'undefined') return null;
    return <Latex>{question.question.replace(/\\begin{equation}/g, "\\[").replace(/\\end{equation}/g, "\\]")}</Latex>;
  }, [question]);

  return (
    <div className="flex flex-col justify-between items-center h-screen w-screen overflow-hidden">
      <div className='flex h-[15%] w-[90%] m-4 p-4 text-center justify-center items-center'>
        {renderedQuestion || question?.question}
      </div>
      <div className='h-[80%] w-[80%] m-4 overflow-y-auto overflow-x-hidden border rounded'>
        <Visualiser visualization={visualization} />
      </div>
    </div >
  );
};

export default HomePage;
