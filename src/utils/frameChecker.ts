import { TextFrame, EquationFrame } from "@/types/visualisation"

export function isFrameVisible(frame: TextFrame | EquationFrame, index: number) {
  return index >= frame.start_order && (frame.end_order === null || (frame.end_order != null && index <= frame.end_order));
}
