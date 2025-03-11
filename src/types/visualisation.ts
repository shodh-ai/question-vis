type Optional<T> = T | null;

export interface TextFrame {
  text: string;
  start_order: number;
  end_order?: Optional<number>;
}

export interface EquationFrame {
  equation: string;
  start_order: number;
  end_order?: Optional<number>;
}

export interface Element {
  id: number;
  // type: 'text' | 'equation' | 'graph' | 'image' | 'table';
  type: string;
  frames: (TextFrame | EquationFrame)[];
}

export interface Visualisation {
  layout: (number | number[])[];
  elements: Element[];
}
