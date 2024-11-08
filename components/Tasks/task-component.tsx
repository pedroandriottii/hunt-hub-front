import React from "react";
import { Star, ChevronRight, Medal } from "lucide-react";
import { UUID } from "crypto";

export interface TaskSummary {
  title: string;
  description: string;
  reward: number;
  tags: string[];
  ratingRequired: number;
  id: UUID;
}

export default function Task({ title, description, reward, tags, ratingRequired }: TaskSummary) {
  const displayedTags = tags.slice(0, 3);
  const hasMoreTags = tags.length > 3;

  return (
    <div className="w-full h-56 bg-gray-950 rounded-xl p-5 flex flex-col justify-between text-white">
      
      <div>
        <div className="flex justify-between items-start">
        {ratingRequired === 4 && (
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 text-yellow-400" />
            ))}
          </div>
        )}
          <div className="flex gap-2">
            {displayedTags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-blue-600 text-[0.5rem] rounded-lg">
                {tag}
              </span>
            ))}
            {hasMoreTags && (
              <span className="py-1 text-[0.5rem] rounded-lg">+{tags.length - 3}</span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold truncate w-1/2">{title}</h2>
        </div>
      <div>
        <p className="text-gray-400 text-sm truncat mt-2">{description}</p>
      </div>
      </div>

      <div className="flex justify-between items-center flex-row-reverse">
        <div className="flex items-center gap-4">
          <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            View more
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-3 text-sm py-2 rounded-lg">
            Apply
          </button>
        </div>
        <div className="flex items-center gap-2">
          <img src="/img/gold.svg" className="h-5 w-5" alt="" />
          <span className="text-lg font-semibold">R$ {reward / 10}</span>
          <span className="text-sm text-gray-400">({reward} gold)</span>
        </div>
      </div>
    </div>
  );
}
