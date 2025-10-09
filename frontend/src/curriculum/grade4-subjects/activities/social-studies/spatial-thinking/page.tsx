"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Search, Map, Compass, Cloud, Waves, Mountain, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Image from "next/image"

const activities = [
  {
    id: "island-location",
    title: "Island Location",
    description: "Learn how to locate your island using lines of latitude and longitude on maps and globes.",
    icon: <Compass className="h-6 w-6 text-blue-500" />,
    image: "/placeholder.svg?height=200&width=300&query=map+with+latitude+and+longitude+lines",
    color: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
    difficulty: "Medium",
    duration: "2-3 lessons",
    tags: ["geography", "maps", "location"],
    outcomes: [
      "Locate your island on maps/globes using lines of latitude and longitude",
      "Describe your island's location in relation to the wider Caribbean",
      "Appreciate the advantages of maps and technology in locating and describing your island's geography",
    ],
  },
  {
    id: "geographic-divisions",
    title: "Geographic Divisions",
    description: "Identify and map the geographic divisions of your country and understand their importance.",
    icon: <Map className="h-6 w-6 text-green-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+island+map+with+districts",
    color: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-200",
    difficulty: "Easy",
    duration: "2-3 lessons",
    tags: ["geography", "divisions", "mapping"],
    outcomes: [
      "Identify the geographic divisions of your country",
      "Label a map of your country to identify the geographic divisions",
      "Appreciate the importance of geographic divisions for administration",
    ],
  },
  {
    id: "physical-features",
    title: "Physical Features",
    description: "Explore the major physical features of your island and understand their environmental vulnerability.",
    icon: <Mountain className="h-6 w-6 text-amber-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+island+mountains+and+valleys",
    color: "bg-amber-50 hover:bg-amber-100",
    borderColor: "border-amber-200",
    difficulty: "Medium",
    duration: "3-4 lessons",
    tags: ["geography", "features", "environment"],
    outcomes: [
      "Define and classify the major physical features of your island",
      "Observe the differences between various land and water features",
      "Appreciate that your island has natural geographic features that are environmentally vulnerable",
    ],
  },
  {
    id: "climate-patterns",
    title: "Climate Patterns",
    description: "Investigate the climate of your island, how it has changed over time, and the risks it poses.",
    icon: <Cloud className="h-6 w-6 text-purple-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+climate+patterns",
    color: "bg-purple-50 hover:bg-purple-100",
    borderColor: "border-purple-200",
    difficulty: "Medium",
    duration: "2-3 lessons",
    tags: ["climate", "weather", "change"],
    outcomes: [
      "Describe the climate of your island",
      "Investigate the changes in climate over time",
      "Appreciate that your climate has risks for your population",
    ],
  },
  {
    id: "weather-events",
    title: "Weather Events",
    description: "Learn about significant weather events and how to prepare for climate emergencies.",
    icon: <Shield className="h-6 w-6 text-red-500" />,
    image: "/placeholder.svg?height=200&width=300&query=hurricane+preparation+caribbean",
    color: "bg-red-50 hover:bg-red-100",
    borderColor: "border-red-200",
    difficulty: "Medium",
    duration: "2-3 lessons",
    tags: ["weather", "safety", "preparation"],
    outcomes: [
      "Identify significant weather events that have impacted the natural environment",
      "Investigate the consequences of recent weather events on the built environment",
      "Appreciate the need to prepare for climate emergencies",
    ],
  },
  {
    id: "parklands-reserves",
    title: "Parklands & Reserves",
    description: "Discover the natural reserves and parklands in your country and their importance for preservation.",
    icon: <Map className="h-6 w-6 text-teal-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+national+park",
    color: "bg-teal-50 hover:bg-teal-100",
    borderColor: "border-teal-200",
    difficulty: "Easy",
    duration: "2-3 lessons",
    tags: ["conservation", "parks", "nature"],
    outcomes: [
      "Determine the scope and nature of parklands or natural reserves in your country",
      "Locate and describe the features and characteristics of these parklands or reserves",
      "Appreciate the purpose of these areas for preserving flora, fauna, and human existence",
    ],
  },
  {
    id: "fresh-water",
    title: "Fresh Water Sources",
    description: "Identify the sources of fresh water on your island and learn about water conservation.",
    icon: <Waves className="h-6 w-6 text-cyan-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+fresh+water+source",
    color: "bg-cyan-50 hover:bg-cyan-100",
    borderColor: "border-cyan-200",
    difficulty: "Easy",
    duration: "2-3 lessons",
    tags: ["water", "conservation", "resources"],
    outcomes: [
      "Identify the sources and status of your island's fresh water",
      "Determine ways that you can help conserve and protect local water sources",
      "Appreciate the importance of protecting fresh water sources",
    ],
  },
]

export default function SpatialThinkingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "" || activity.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(activities.flatMap((activity) => activity.tags)))

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/curriculum/grade4-subjects/activities/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Social Studies Activities
        </Button>
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
          Spatial Thinking Activities
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore activities that help students understand geographic features, climate patterns, land use, and
          environmental vulnerabilities that shape our island.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search activities..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag("")}
          >
            All
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredActivities.map((activity) => (
          <motion.div key={activity.id} variants={item}>
            <Card
              className={`h-full transition-all duration-300 hover:shadow-lg ${activity.color} border-2 ${activity.borderColor} overflow-hidden`}
            >
              <div className="relative h-48 w-full">
                <Image src={activity.image || "/placeholder.svg"} alt={activity.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{activity.title}</CardTitle>
                  {activity.icon}
                </div>
                <CardDescription className="text-gray-700">{activity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Learning Outcomes:</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {activity.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-600">{activity.duration}</div>
                <Badge
                  variant={
                    activity.difficulty === "Easy"
                      ? "default"
                      : activity.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {activity.difficulty}
                </Badge>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No activities found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold mb-4">Teacher Resources</h2>
        <p className="mb-4">Enhance your spatial thinking lessons with these helpful resources:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.youtube.com/watch?v=7Bt1UgwEUIQ", "_blank")}
          >
            Elements of a Map
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.youtube.com/watch?v=psnYAM3YOKk", "_blank")}
          >
            Latitude and Longitude
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.youtube.com/watch?v=iA23Sm-HI4I", "_blank")}
          >
            Climate and Climate Zones
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.youtube.com/watch?v=pkryz2wR2uk", "_blank")}
          >
            Climate Change Risks
          </Button>
        </div>
      </div>
    </div>
  )
}
