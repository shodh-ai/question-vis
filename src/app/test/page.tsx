"use client";

import { useState, useEffect, useMemo } from 'react';
import { getTestData } from '@/api/testQues';
import { Question } from '@/types/question';
import { Visualisation } from '@/types/visualisation';
// import { getVisulaisation } from '@/api/visulaisation';
import Visualiser from '@/components/Visualiser';
import AnswerComponent from '@/components/TemplateRenderer';
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

const HomePage = () => {
  const [question, setQuestion] = useState<Question>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visualization, setVisualization] = useState<Visualisation>();

  // const generateVisulaisation = (context: string, question: string, answer: string[]) => {
  //   getVisulaisation("example", context, question, answer).then((data) => {
  //     setVisualization(data);
  //     if (data)
  //       setStartIndex(getLastStartIndex({ visualization: data }));
  //   });
  // }

  useEffect(() => {
    setLoading(true);
    getTestData().then((data) => {
      setQuestion(data.question);
    })
      .finally(() => {
        setLoading(false)
      })
  }, []);

  const renderedQuestion = useMemo(() => {
    if (!question?.question) return null;
    if (typeof window === 'undefined') return null;
    return <Latex>{question.question.replace(/\\begin{equation}/g, "\\[").replace(/\\end{equation}/g, "\\]")}</Latex>;
  }, [question]);

  return (
    <div className="flex flex-row justify-between items-center h-screen w-screen overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4">Loading data...</p>
          </div>
        </div>
      )}

      <div className='flex flex-col h-full w-[40%] m-4 p-4 text-center justify-center items-center'>
        <div className='flex h-[40%] w-full text-center justify-center items-center'>
          {renderedQuestion || question?.question}
        </div>
        <div className='flex h-[50%] w-full text-center justify-center items-center'>
          <AnswerComponent template={question?.answer_template[currentIndex][0] || ''} correctOptions={question?.answer_template[currentIndex]?.slice(1) || []} count={currentIndex} setCount={setCurrentIndex} />
        </div>
      </div>

      <div className='flex flex-col h-full w-[55%] items-center justify-start'>
        <div className='flex h-[55%] w-full items-center justify-center m-4'>
          {visualization && <Visualiser visualization={visualization} currIndex={currentIndex} />}
        </div>
        <div className='flex flex-col h-[45%] w-full items-center justify-end m-4'>
          Any visual component to let user know AI is talking
        </div>
      </div>
    </div>
  );
};

export default HomePage;
