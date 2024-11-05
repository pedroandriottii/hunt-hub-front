import React from "react"
import { Star, ChevronRight, Medal } from "lucide-react"

export interface TaskSummary {
  title: string
  description: string
  reward: number
  tags: string[]
  ratingRequired: number
}

export default function Task({ title, description, reward, tags, ratingRequired }: TaskSummary) {
  const displayedTags = tags.slice(0, 3)
  const hasMoreTags = tags.length > 3

  return (
    <div className="w-[45rem] h-64 bg-gray-950 rounded-xl p-6 flex flex-col justify-between text-white">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold truncate w-7/12">{title}</h2>
          <div className="flex gap-2">
            {displayedTags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-blue-600 text-xs rounded-lg">
                {tag}
              </span>
            ))}
            {hasMoreTags && (
              <span className="px-2 py-1 bg-blue-600 text-xs rounded-lg">+{tags.length - 3}</span>
            )}
          </div>
        </div>
        <p className="text-gray-400 mb-6 truncate">{description}</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="font-bold text-2xl">{ratingRequired}</span>
          </div>
          <Medal className="h-6 w-6 text-yellow-400" />
          <button className="text-blue-400 hover:text-blue-300 transition-colors">View more</button>
          <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg">
            Apply
          </button>
        </div>
        <div className="flex items-center gap-2">
          <img src="/img/gold.svg" className="h-5 w-5" alt="" />
          <span className="text-xl font-semibold">{reward / 10} $RS</span>
          <span className="text-sm text-gray-400">({reward} gold)</span>
        </div>
      </div>
    </div>
  )
}