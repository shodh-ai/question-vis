"use client";

import { useState, useEffect, useMemo } from 'react';
import { getExampleData } from '@/api/exampleQues';
// import { getVisulaisation } from '@/api/visulaisation';
import { Question } from '@/types/question';
import { Visualisation } from '@/types/visualisation';
// import visualization from '../../../data/visulaisation.json';
// import transcript from '../../../data/transcript.json';
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
  const [visualization, setVisualization] = useState<Visualisation>();
  // const [transcript, setTranscript] = useState<string[]>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, startIndex));
  };

  // const generateVisulaisation = (context: string, question: string, answer: string[]) => {
  //   getVisulaisation("example", context, question, answer).then((data) => {
  //     setVisualization(data);
  //     if (data)
  //       setStartIndex(getLastStartIndex({ visualization: data }));
  //   });
  // }

  useEffect(() => {
    setLoading(true);
    getExampleData().then((data) => {
      setQuestion(data.question);
      setVisualization(data.visulaisation);
      // setTranscript(data.transcript);
      if (data.visulaisation)
        setStartIndex(getLastStartIndex({ visualization: data.visulaisation }));
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
    <div className="flex flex-col justify-between items-center h-screen w-screen overflow-hidden">

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4">Loading data...</p>
          </div>
        </div>
      )}

      <div className='flex h-[15%] w-[90%] m-4 p-4 text-center justify-center items-center'>
        {renderedQuestion || question?.question}
      </div>
      <div className='h-[80%] w-[80%] m-4 overflow-y-auto overflow-x-hidden'>
        {visualization && <Visualiser visualization={visualization} currIndex={currentIndex} />}
      </div>
      <FloatingNav onBack={handleBack} onForward={handleForward} onRefresh={() => window.location.reload()} />
    </div >
  );
};

export default HomePage;
