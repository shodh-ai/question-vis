import { Visualisation } from '@/types/visualisation';
import RowHandler from '@/components/RowHandler';

export default function Visualiser({ visualization }: { visualization: Visualisation }) {

  function get_elements({ rows }: { rows: number[] | number }) {
    if (Array.isArray(rows)) {
      return rows.map((row) => visualization.elements[row - 1]);
    } else {
      return visualization.elements[rows - 1];
    }
  }

  return (
    <div className='flex flex-col h-[100%] w-[100%] p-4 border'>
      {visualization.layout.map((_, index) => (
        <RowHandler key={index} rows={visualization.layout[index]} elements={get_elements({ rows: visualization.layout[index] })} />
      ))}
    </div>
  );
}
