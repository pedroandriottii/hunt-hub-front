import { Search, ChevronLeft, ChevronDown } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Component() {
    const jobTypes = [
        { name: "Web Development", count: 2000 },
        { name: "App Development", count: 1000 },
        { name: "Machine Learning", count: 1000 },
        { name: "Data Science", count: 1000 },
        { name: "Physical Computation", count: 300 },
        { name: "DevOps", count: 700 },
        { name: "Cyber Security", count: 500 },
        { name: "DataBase Engineering", count: 500 },
        { name: "Systems Architect", count: 100 },
        { name: "Other", count: 300 },
    ]

    const sortOptions = [
        "Most Well Compensated",
        "Best POs",
        "Most Time available",
        "Least Time available",
    ]

    const jobs = [
        {
            title: "Model And Create my Startups DataBase, train a neural Network model and create and deploy an app that acts as an AI therapist for IOS and Android",
            price: 7200,
            coins: 72000,
            tags: ["Machine Learning", "App Development", "Data Science"],
        },
        {
            title: "Create an AI-integrated web-app that allows me to analyze json files and generate predictions for my business.",
            price: 699,
            coins: 6990,
            tags: ["Machine Learning", "Web Development", "Data Science"],
        },
        // Add more jobs as needed
    ]

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-2xl font-medium text-gray-700">Browse tasks</h1>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search tasks..."
                        className="w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h2 className="font-medium mb-4">Payment</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>5 USD</span>
                                    <span>10,000 USD</span>
                                </div>
                                <Slider
                                    defaultValue={[5000]}
                                    max={10000}
                                    min={5}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h2 className="font-medium mb-4">Rating Required</h2>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="4">4.0+ Stars</SelectItem>
                                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                                    <SelectItem value="5">5.0 Stars</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h2 className="font-medium mb-4">Type</h2>
                            <ul className="space-y-2">
                                {jobTypes.map((type) => (
                                    <li key={type.name} className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                        <span className="text-sm text-gray-600">{type.name}</span>
                                        <span className="text-xs text-gray-400">({type.count})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h2 className="font-medium mb-4">Sort By</h2>
                            <ul className="space-y-2">
                                {sortOptions.map((option) => (
                                    <li key={option} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            className="border-gray-300"
                                        />
                                        <span className="text-sm text-gray-600">{option}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {jobs.map((job, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-4 shadow-sm space-y-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex gap-2 flex-wrap">
                                            {job.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="rounded-full"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-gray-700">{job.title}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-medium">{job.price} USD</div>
                                        <div className="text-sm text-gray-500">{job.coins} 🪙</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="w-full">
                                        View More
                                    </Button>
                                    <Button className="w-full">Apply</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}