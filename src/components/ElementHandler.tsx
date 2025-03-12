import { Element, TextFrame, EquationFrame } from '@/types/visualisation';
import TextFrameRenderer from '@/components/TextFrameRenderer';
import EquationFrameRenderer from '@/components/EquationFrameRenderer';

export default function ElementHandler({ element, multi, index }: { element: Element, multi: boolean, index: number }) {

  return (
    <div className={`flex flex-row h-full w-full border items-center ${multi ? element.id % 2 === 0 ? 'justify-start' : 'justify-end' : 'justify-center'}`}>
      {element.type === 'text'
        ? element.frames.map((frame, idx) => <TextFrameRenderer key={idx} textFrame={frame as TextFrame} index={index} />)
        : element.type === 'equation'
          ? element.frames.map((frame, idx) => <EquationFrameRenderer key={idx} equationFrame={frame as EquationFrame} index={index} />)
          : null}
    </div>
  );
}
