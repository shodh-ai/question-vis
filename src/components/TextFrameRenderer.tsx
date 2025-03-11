import { TextFrame } from '@/types/visualisation';

export default function TextFrameRenderer({ textFrame }: { textFrame: TextFrame }) {
  return (
    <div>
      {textFrame.text}
    </div>
  );
}
