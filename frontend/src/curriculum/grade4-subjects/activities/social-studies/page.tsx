"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Search, BookOpen, Map, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Image from "next/image"

const socialStudiesStrands = [
  {
    id: "historical-cultural-thinking",
    title: "Historical and Cultural Thinking",
    description:
      "Explore Indigenous peoples of the Caribbean, European colonization, and the evolution of Indigenous culture in modern times.",
    icon: <BookOpen className="h-10 w-10 text-blue-500" />,
    image: "/placeholder-nm2ja.png",
    color: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
    activities: 8,
    difficulty: "Medium",
    tags: ["indigenous", "colonization", "culture", "history"],
  },
  {
    id: "spatial-thinking",
    title: "Spatial Thinking",
    description:
      "Discover geographic features, climate patterns, land use, and environmental vulnerabilities that shape our island.",
    icon: <Map className="h-10 w-10 text-green-500" />,
    image: "/placeholder-p641o.png",
    color: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-200",
    activities: 7,
    difficulty: "Medium",
    tags: ["geography", "climate", "environment", "parklands"],
  },
  {
    id: "civic-participation",
    title: "Civic Participation",
    description:
      "Learn about communication technology, transportation, political evolution, government systems, and democracy.",
    icon: <Users className="h-10 w-10 text-purple-500" />,
    image: "/placeholder-4y8sj.png",
    color: "bg-purple-50 hover:bg-purple-100",
    borderColor: "border-purple-200",
    activities: 6,
    difficulty: "Medium",
    tags: ["government", "democracy", "communication", "citizenship"],
  },
  {
    id: "economic-decision-making",
    title: "Economic Decision Making",
    description: "Understand how natural resources, economic activities, and environmental issues shape our economy.",
    icon: <DollarSign className="h-10 w-10 text-amber-500" />,
    image: "/children-economy-resources.png",
    color: "bg-amber-50 hover:bg-amber-100",
    borderColor: "border-amber-200",
    activities: 6,
    difficulty: "Medium",
    tags: ["economy", "resources", "environment", "energy"],
  },
]

export default function Grade4SocialStudiesActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  const filteredStrands = socialStudiesStrands.filter((strand) => {
    const matchesSearch =
      strand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strand.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "" || strand.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(socialStudiesStrands.flatMap((strand) => strand.tags)))

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
      <Link href="/curriculum/grade4-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Social Studies
        </Button>
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-purple-600 text-transparent bg-clip-text">
          Grade 4 Social Studies Activities
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore engaging activities that help students understand Indigenous peoples, geographic features, civic
          responsibilities, and economic foundations. Choose a strand below to get started!
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredStrands.map((strand) => (
          <motion.div key={strand.id} variants={item}>
            <Link href={`/curriculum/grade4-subjects/activities/social-studies/${strand.id}`}>
              <Card
                className={`h-full transition-all duration-300 hover:shadow-lg ${strand.color} border-2 ${strand.borderColor} overflow-hidden`}
              >
                <div className="relative h-48 w-full">
                  <Image src={strand.image || "/placeholder.svg"} alt={strand.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{strand.title}</CardTitle>
                    {strand.icon}
                  </div>
                  <CardDescription className="text-gray-700">{strand.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {strand.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-gray-600">{strand.activities} activities</div>
                  <Badge
                    variant={
                      strand.difficulty === "Easy"
                        ? "default"
                        : strand.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {strand.difficulty}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filteredStrands.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No activities found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      <div className="mt-12 p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h2 className="text-2xl font-bold mb-4">Teacher Resources</h2>
        <p className="mb-4">
          Looking for additional resources to enhance your social studies lessons? Check out these helpful links:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.oecs.org/en/our-work/knowledge/library/education", "_blank")}
          >
            OECS Education Resources
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.nationalgeographic.org/education/classroom-resources/", "_blank")}
          >
            National Geographic Education
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.unicef.org/easterncaribbean/", "_blank")}
          >
            UNICEF Eastern Caribbean
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() =>
              window.open("https://www.globalcitizen.org/en/content/caribbean-history-resources-for-kids/", "_blank")
            }
          >
            Caribbean History Resources
          </Button>
        </div>
      </div>
    </div>
  )
}
