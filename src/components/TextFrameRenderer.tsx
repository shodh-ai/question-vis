import { TextFrame } from '@/types/visualisation';
import { isFrameVisible } from '@/utils/frameChecker';

export default function TextFrameRenderer({ textFrame, index }: { textFrame: TextFrame, index: number }) {
  return (
    isFrameVisible(textFrame, index) ? (
      <div>
        {textFrame.text}
      </div>
    ) : null
  );
}
