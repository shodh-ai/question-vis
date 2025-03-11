import { Element } from '@/types/visualisation';
import ElementHandler from '@/components/ElementHandler';

export default function RowHandler({ rows, elements }: { rows: number[] | number, elements: Element[] | Element }) {
  return (
    <div className='flex flex-row h-[100%] w-[100%] border'>
      {Array.isArray(rows) ? (
        rows.map((_, index) => (
          <ElementHandler key={index} element={Array.isArray(elements) ? elements[index] : elements} />
        ))
      ) : (
        <ElementHandler element={Array.isArray(elements) ? elements[0] : elements} />
      )}
    </div>
  );
}
