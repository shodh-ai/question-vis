import { EquationFrame } from '@/types/visualisation';
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

export default function EquationFrameRenderer({ equationFrame }: { equationFrame: EquationFrame }) {
  return (
    <div>
      <TeX>{equationFrame.equation}</TeX>
    </div>
  );
}
