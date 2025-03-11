import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

interface DynamicRendererProps {
  text: string;
}

export default function DynamicRenderer({ text }: DynamicRendererProps) {
  // Split the string by line breaks or LaTeX markers
  const parts = text.split(/(\\begin\{equation\}[\s\S]*?\\end\{equation\}|\\\(.*?\\\))/);

  return (
    <div className="p-4 space-y-4">
      {parts.map((part, index) => {
        // Handle block equations (\begin{equation} ... \end{equation})
        if (part.startsWith("\\begin{equation}")) {
          const equation = part.replace("\\begin{equation}", "").replace("\\end{equation}", "").trim();
          return <TeX key={index} block math={equation} />;
        }

        // Handle inline equations (\( ... \))
        if (part.startsWith("\\(")) {
          const equation = part.replace("\\(", "").replace("\\)", "").trim();
          return <TeX key={index} math={equation} />;
        }

        // Render normal text
        return <p key={index}>{part}</p>;
      })}
    </div>
  );
}
