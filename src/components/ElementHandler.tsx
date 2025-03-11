import { Element } from '@/types/visualisation';
import TextFrameRenderer from '@/components/TextFrameRenderer';
import EquationFrameRenderer from '@/components/EquationFrameRenderer';

export default function ElementHandler({ element }: { element: Element }) {
  return (
    <div className='flex h-[100%] w-[100%] border items-center justify-center'>
      {element.type === 'text' ? (
        <TextFrameRenderer textFrame={element.frames[0]} />
      ) : element.type === 'equation' ? (
        <EquationFrameRenderer equationFrame={element.frames[0]} />
      ) : null}
    </div>
  );
}
