import { Element } from '@/types/visualisation';
import TextFrameRenderer from '@/components/TextFrameRenderer';
import EquationFrameRenderer from '@/components/EquationFrameRenderer';

export default function ElementHandler({ element, multi }: { element: Element, multi: boolean }) {
  return (
    <div className={`flex h-[100%] w-[100%] border items-center ${multi ? element.id % 2 === 0 ? 'justify-start' : 'justify-end' : 'justify-center'}`}>
      {element.type === 'text' ? (
        <TextFrameRenderer textFrame={element.frames[0]} />
      ) : element.type === 'equation' ? (
        <EquationFrameRenderer equationFrame={element.frames[0]} />
      ) : null}
    </div>
  );
}
