"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Search, Compass, Waves, Cloud, AlertTriangle, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Image from "next/image"

const activities = [
  {
    id: "relative-location",
    title: "Relative Location",
    description: "Learn about the relative location of our island within the Caribbean region.",
    icon: <Compass className="h-6 w-6 text-blue-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+map+for+children",
    color: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
    difficulty: "Easy",
    duration: "2-3 lessons",
    tags: ["geography", "maps", "location"],
    outcomes: [
      "State the relative location of our island within the Caribbean region",
      "Locate and label your island on a map of the Caribbean",
      "Recognize that our island is connected geographically to the Caribbean region",
    ],
  },
  {
    id: "water-bodies",
    title: "Water Bodies",
    description: "Explore the water bodies that surround the Caribbean region and their importance.",
    icon: <Waves className="h-6 w-6 text-cyan-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+sea+and+atlantic+ocean",
    color: "bg-cyan-50 hover:bg-cyan-100",
    borderColor: "border-cyan-200",
    difficulty: "Easy",
    duration: "2-3 lessons",
    tags: ["water", "geography", "environment"],
    outcomes: [
      "Name the water bodies that surround the Caribbean region",
      "Locate and label the water bodies on a map of the Caribbean",
      "Recognize that our surrounding seas and ocean have connected us as diverse Caribbean peoples",
    ],
  },
  {
    id: "importance-of-water-bodies",
    title: "Importance of Water Bodies",
    description: "Understand the importance of our water bodies to our people and how human activities affect them.",
    icon: <Waves className="h-6 w-6 text-teal-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+fishing+and+beaches",
    color: "bg-teal-50 hover:bg-teal-100",
    borderColor: "border-teal-200",
    difficulty: "Medium",
    duration: "3-4 lessons",
    tags: ["water", "environment", "conservation"],
    outcomes: [
      "Explain the importance of our water bodies to our people",
      "Investigate how our human activities affect these water bodies",
      "Appreciate the need for responsible actions to protect our water bodies",
    ],
  },
  {
    id: "our-seasons",
    title: "Our Seasons",
    description: "Learn about the seasons on our islands and how they affect our daily lives.",
    icon: <Cloud className="h-6 w-6 text-purple-500" />,
    image: "/placeholder.svg?height=200&width=300&query=caribbean+wet+and+dry+seasons",
    color: "bg-purple-50 hover:bg-purple-100",
    borderColor: "border-purple-200",
    difficulty: "Easy",
    duration: "2-3 lessons",
    tags: ["climate", "seasons", "weather"],
    outcomes: [
      "Describe the seasons on your islands and how they affect our daily lives",
      "Make appropriate decisions for various weather conditions",
      "Appreciate the benefits and drawbacks of each season for our environment",
    ],
  },
  {
    id: "natural-hazards",
    title: "Natural Hazards",
    description: "Examine examples of extreme natural hazards that affect our islands.",
    icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
    image: "/placeholder.svg?height=200&width=300&query=hurricane+preparation+caribbean",
    color: "bg-red-50 hover:bg-red-100",
    borderColor: "border-red-200",
    difficulty: "Medium",
    duration: "3-4 lessons",
    tags: ["hazards", "safety", "environment"],
    outcomes: [
      "Explain that the location of islands makes them prone to natural hazards",
      "Examine some examples of extreme natural hazards that affect our islands",
      "Appreciate that we need to be aware of ways to keep safe during natural hazards",
    ],
  },
  {
    id: "preparing-for-natural-hazards",
    title: "Preparing for Natural Hazards",
    description:
      "Learn about appropriate preparations for various natural hazards and create a family preparation plan.",
    icon: <Shield className="h-6 w-6 text-green-500" />,
    image: "/placeholder.svg?height=200&width=300&query=emergency+preparation+kit",
    color: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-200",
    difficulty: "Medium",
    duration: "2-3 lessons",
    tags: ["safety", "preparation", "hazards"],
    outcomes: [
      "Describe appropriate preparations that need to be made for various natural hazards",
      "Create a simple family preparation plan for a selected natural hazard",
      "Appreciate the need to minimize risk in times of natural hazards",
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
      <Link href="/curriculum/grade3-subjects/activities/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Social Studies Activities
        </Button>
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
          Spatial Thinking Activities
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore activities that help students understand how our people are shaped by geographic factors such as our
          tropical climate, island environment, and natural hazards.
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
            onClick={() => window.open("https://mapmaker.nationalgeographic.org/", "_blank")}
          >
            National Geographic MapMaker
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.google.com/maps/place/Caribbean/", "_blank")}
          >
            Google Maps - Caribbean Region
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.youtube.com/watch?v=U-rUl_OFBq0", "_blank")}
          >
            Types of Water Bodies Video
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.youtube.com/watch?v=J6DYWp27X1E", "_blank")}
          >
            Natural Hazards Preparation
          </Button>
        </div>
      </div>
    </div>
  )
}
