"use client";

import { useState, useEffect, useMemo } from 'react';
import { getQuestion } from '@/api/question';
import { Question } from '@/types/question';
import visualization from '../../../data/visulaisation.json';
import { Visualisation } from '@/types/visualisation';
import Visualiser from '@/components/Visualiser';
import Latex from "react-latex-next";
import FloatingNav from '@/components/FloatingNav';
import "katex/dist/katex.min.css";

function getLastStartIndex({ visualization }: { visualization: Visualisation }) {
  const startOrders = visualization.elements.flatMap(element => element.frames.map(frame => frame.start_order));
  return Math.max(...startOrders);
}

const HomePage = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [question, setQuestion] = useState<Question>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestion("example");
        setQuestion(response);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };
    setStartIndex(getLastStartIndex({ visualization }));
    fetchQuestion();
  }, []);

  const renderedQuestion = useMemo(() => {
    if (!question?.question) return null;
    if (typeof window === 'undefined') return null;
    return <Latex>{question.question.replace(/\\begin{equation}/g, "\\[").replace(/\\end{equation}/g, "\\]")}</Latex>;
  }, [question]);

  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, startIndex));
  };

  return (
    <div className="flex flex-col justify-between items-center h-screen w-screen overflow-hidden">
      <div className='flex h-[15%] w-[90%] m-4 p-4 text-center justify-center items-center'>
        {renderedQuestion || question?.question}
      </div>
      <div className='h-[80%] w-[80%] m-4 overflow-y-auto overflow-x-hidden'>
        <Visualiser visualization={visualization} currIndex={currentIndex} />
      </div>
      <FloatingNav onBack={handleBack} onForward={handleForward} onRefresh={() => window.location.reload()} />
    </div >
  );
};

export default HomePage;
