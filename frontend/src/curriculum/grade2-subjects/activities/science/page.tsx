import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Clock, BarChart2 } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function ScienceActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 2", href: "/curriculum/grade2-subjects" },
          { label: "Science", href: "/curriculum/grade2-subjects/science" },
          { label: "Activities", href: "/curriculum/grade2-subjects/activities/science" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Grade 2 Science Activities</h1>
        <p className="text-gray-600">
          Explore hands-on science activities designed to engage Grade 2 students in scientific inquiry, observation,
          and discovery across different science strands.
        </p>
      </div>

      <Tabs defaultValue="matter" className="mb-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="matter">Structure & Properties of Matter</TabsTrigger>
          <TabsTrigger value="ecosystems">Interdependent Relationships</TabsTrigger>
          <TabsTrigger value="earth">Earth Systems</TabsTrigger>
          <TabsTrigger value="engineering">Engineering Design</TabsTrigger>
        </TabsList>

        <TabsContent value="matter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityCard
              title="Material Explorers"
              description="Students investigate and classify different materials based on their observable properties."
              image="/material-explorers.png"
              fallbackImage="/material-explorers.png"
              time="45 minutes"
              difficulty="Easy"
              href="/curriculum/grade2-subjects/activities/science/material-explorers"
            />
            <ActivityCard
              title="State Changers"
              description="Students observe how materials can change from solid to liquid and back again through heating and cooling."
              image="/state-changers.png"
              fallbackImage="/state-changers.png"
              time="60 minutes"
              difficulty="Medium"
              href="/curriculum/grade2-subjects/activities/science/state-changers"
            />
            <ActivityCard
              title="Building Blocks"
              description="Students explore how small pieces can be assembled to make larger objects with different properties."
              image="/building-blocks.png"
              fallbackImage="/colorful-building-blocks.png"
              time="50 minutes"
              difficulty="Easy"
              href="/curriculum/grade2-subjects/activities/science/building-blocks"
            />
          </div>
        </TabsContent>

        <TabsContent value="ecosystems">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityCard
              title="Plant Investigators"
              description="Students investigate what plants need to grow and thrive through simple experiments."
              image="/plant-investigators.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Plant%20Investigators"
              time="Multiple sessions"
              difficulty="Medium"
              href="/curriculum/grade2-subjects/activities/science/plant-investigators"
            />
            <ActivityCard
              title="Pollination Partners"
              description="Students learn about the relationship between plants and animals in pollination through models and role play."
              image="/pollination-partners.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Pollination%20Partners"
              time="45 minutes"
              difficulty="Medium"
              href="/curriculum/grade2-subjects/activities/science/pollination-partners"
            />
            <ActivityCard
              title="Habitat Heroes"
              description="Students explore how plants and animals depend on their habitats and each other for survival."
              image="/habitat-heroes.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Habitat%20Heroes"
              time="60 minutes"
              difficulty="Medium"
              href="/curriculum/grade2-subjects/activities/science/habitat-heroes"
            />
          </div>
        </TabsContent>

        <TabsContent value="earth">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityCard
              title="Earth Shapers"
              description="Students compare the effects of fast and slow changes to Earth's surface through demonstrations and models."
              image="/earth-shapers.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Earth%20Shapers"
              time="55 minutes"
              difficulty="Medium"
              href="/curriculum/grade2-subjects/activities/science/earth-shapers"
            />
            <ActivityCard
              title="Erosion Protectors"
              description="Students design and test solutions to prevent or slow down erosion using various materials."
              image="/erosion-protectors.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Erosion%20Protectors"
              time="60 minutes"
              difficulty="Medium-Hard"
              href="/curriculum/grade2-subjects/activities/science/erosion-protectors"
            />
            <ActivityCard
              title="Water Mappers"
              description="Students create models to show where water is found on Earth and discuss its importance."
              image="/water-mappers.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Water%20Mappers"
              time="50 minutes"
              difficulty="Easy"
              href="/curriculum/grade2-subjects/activities/science/water-mappers"
            />
          </div>
        </TabsContent>

        <TabsContent value="engineering">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityCard
              title="Problem Solvers"
              description="Students learn to define simple problems and brainstorm solutions through collaborative challenges."
              image="/problem-solvers.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Problem%20Solvers"
              time="45 minutes"
              difficulty="Easy"
              href="/curriculum/grade2-subjects/activities/science/problem-solvers"
            />
            <ActivityCard
              title="Shape Engineers"
              description="Students explore how the shape of an object helps it function as needed to solve a given problem."
              image="/shape-engineers.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Shape%20Engineers"
              time="50 minutes"
              difficulty="Medium"
              href="/curriculum/grade2-subjects/activities/science/shape-engineers"
            />
            <ActivityCard
              title="Design Testers"
              description="Students learn to test their designs, compare them with peers, and make improvements."
              image="/design-testers.png"
              fallbackImage="/placeholder.svg?height=200&width=400&query=Design%20Testers"
              time="60 minutes"
              difficulty="Medium"
              href="/curriculum/grade2-subjects/activities/science/design-testers"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">Teaching Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Encourage students to ask questions and make predictions before starting activities</li>
          <li>Use science notebooks for students to record observations and reflections</li>
          <li>Connect science concepts to students' everyday experiences</li>
          <li>Incorporate opportunities for both individual exploration and collaborative learning</li>
          <li>Allow time for students to share their discoveries and learning with peers</li>
        </ul>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold mb-4">Cross-Curricular Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-green-700">Mathematics</h3>
            <p>Measurement, data collection, patterns, and spatial reasoning</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-green-700">Language Arts</h3>
            <p>Scientific vocabulary, procedural writing, and oral communication</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-green-700">Art</h3>
            <p>Creating models, observational drawing, and design thinking</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityCard({
  title,
  description,
  image,
  fallbackImage,
  time,
  difficulty,
  href,
}: {
  title: string
  description: string
  image: string
  fallbackImage: string
  time: string
  difficulty: string
  href: string
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative">
        <FallbackImage src={image} fallbackSrc={fallbackImage} alt={title} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {time}
          </div>
          <div className="flex items-center">
            <BarChart2 className="mr-1 h-4 w-4" />
            {difficulty}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={href} className="w-full">
          <Button className="w-full">View Activity</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
