"use client";

import { useState } from "react";

export function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  const limit = 180;
  const isLong = text.length > limit;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">About this event</h2>

      <p className="text-slate-400 leading-relaxed">
        {expanded || !isLong ? text : text.slice(0, limit) + "..."}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-cyan-400 text-sm hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}