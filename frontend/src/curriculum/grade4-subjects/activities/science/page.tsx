"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Search, Beaker, Leaf, Dna, Cloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState, useEffect } from "react"

const scienceStrands = [
  {
    id: "energy",
    title: "Energy",
    description:
      "Explore different forms of energy, energy transfer, and how energy from natural resources affects the environment.",
    icon: <Beaker className="h-10 w-10 text-blue-500" />,
    image: "/energy-experiments-children.png",
    color: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
    activities: 5,
    difficulty: "Medium",
    tags: ["energy", "transfer", "resources"],
  },
  {
    id: "waves",
    title: "Waves",
    description: "Investigate wave patterns, amplitude, wavelength, and how waves transfer information.",
    icon: <Leaf className="h-10 w-10 text-green-500" />,
    image: "/light-sound-experiments.png",
    color: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-200",
    activities: 6,
    difficulty: "Easy",
    tags: ["waves", "amplitude", "wavelength"],
  },
  {
    id: "structure-function",
    title: "Structure and Function",
    description:
      "Learn about internal and external structures of plants and animals and how they support survival, growth, behavior, and reproduction.",
    icon: <Dna className="h-10 w-10 text-purple-500" />,
    image: "/plant-animal-structures.png",
    color: "bg-purple-50 hover:bg-purple-100",
    borderColor: "border-purple-200",
    activities: 7,
    difficulty: "Medium",
    tags: ["structure", "function", "survival"],
  },
  {
    id: "earth-systems",
    title: "Earth Systems",
    description: "Explore patterns of Earth's features and how natural processes change landscapes over time.",
    icon: <Cloud className="h-10 w-10 text-cyan-500" />,
    image: "/earth-systems-models.png",
    color: "bg-cyan-50 hover:bg-cyan-100",
    borderColor: "border-cyan-200",
    activities: 5,
    difficulty: "Easy",
    tags: ["earth", "systems", "processes"],
  },
]

export default function Grade4ScienceActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render until client-side
  if (!isClient) {
    return <div>Loading...</div>
  }

  const filteredStrands = scienceStrands.filter((strand) => {
    const matchesSearch =
      strand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strand.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "" || strand.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(scienceStrands.flatMap((strand) => strand.tags)))

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/curriculum/grade4-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science
        </Button>
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text">
          Grade 4 Science Activities
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore hands-on activities that bring science concepts to life through experimentation, observation, and
          discovery. Choose a strand below to get started!
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

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredStrands.map((strand) => (
          <Link key={strand.id} href={`/curriculum/grade4-subjects/activities/science/${strand.id}`}>
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
        ))}
      </div>

      {filteredStrands.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No activities found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold mb-4">Teacher Resources</h2>
        <p className="mb-4">
          Looking for additional resources to enhance your science lessons? Check out these helpful links:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.nextgenscience.org/", "_blank")}
          >
            Next Generation Science Standards
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.sciencebuddies.org/", "_blank")}
          >
            Science Buddies
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.nasa.gov/stem/", "_blank")}
          >
            NASA STEM Engagement
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.exploratorium.edu/education/activities", "_blank")}
          >
            Exploratorium Activities
          </Button>
        </div>
      </div>
    </div>
  )
}
