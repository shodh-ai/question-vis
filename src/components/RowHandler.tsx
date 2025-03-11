import { Element } from '@/types/visualisation';
import ElementHandler from '@/components/ElementHandler';

export default function RowHandler({ rows, elements }: { rows: number[] | number, elements: Element[] | Element }) {
  return (
    Array.isArray(rows) ? (
      <div className='flex flex-row h-[100%] w-[100%] border items-center'>
        {rows.map((_, index) => (
          <ElementHandler key={index} element={Array.isArray(elements) ? elements[index] : elements} multi={true} />
        ))}
      </div>
    ) : (
      <div className='flex flex-row h-[100%] w-[100%] border'>
        <ElementHandler element={Array.isArray(elements) ? elements[0] : elements} multi={false} />
      </div>
    )
  );
}
