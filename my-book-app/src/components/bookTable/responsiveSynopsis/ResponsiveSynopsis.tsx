import { useState } from "react";
import type { Synopsis } from "../../../types/books/Synopsis";

export default function ResponsiveSynopsis({
  text,
  maxLength = 100,
}: Synopsis) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span className="block md:hidden text-sm">{text}</span>;
  }

  return (
    <div className="block md:hidden text-sm">
      {expanded ? text : `${text.slice(0, maxLength)}... `}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="text-blue-600 hover:underline ml-1 text-xs font-medium"
      >
        {expanded ? "Show less" : "More..."}
      </button>
    </div>
  );
}
