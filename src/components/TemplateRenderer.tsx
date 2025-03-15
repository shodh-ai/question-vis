import { useState, useMemo, Dispatch, SetStateAction } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AnswerComponent({ template, correctOptions, count, setCount }: { template: string, correctOptions: string[], count: number, setCount: Dispatch<SetStateAction<number>> }) {

  function processLatex(str: string | undefined) {
    if (!str) return null;
    if (typeof window === 'undefined') return null;
    return <Latex>{str.replace(/\\begin{equation}/g, "\\[").replace(/\\end{equation}/g, "\\]")}</Latex>;
  }

  const templateLatex = useMemo(() => processLatex(template), [template]);

  return <div>
    {templateLatex}
  </div>
}
