import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beaker, Leaf, Mountain, Wind, Waves, ChevronLeft, ChevronRight, Zap } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade3SciencePage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Subjects
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Grade 3 Science Curriculum
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Science education encourages curiosity, critical thinking, and problem-solving skills. The Grade 3
            curriculum builds upon foundational concepts and introduces new scientific ideas through engaging, hands-on
            learning experiences and investigations of the natural world.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-green-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Zap className="h-5 w-5" />
              Forces and Interactions
            </CardTitle>
            <CardDescription>Understanding forces and their effects on objects</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              In Grade 3, students explore how balanced and unbalanced forces affect the motion of objects. They
              investigate magnetic and electrical interactions, and learn how to predict patterns of motion. Students
              also design solutions to problems involving forces.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade3-subjects/science/forces-interactions">
              <Button className="w-full bg-green-600 hover:bg-green-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Leaf className="h-5 w-5" />
              Interdependent Relationships in Ecosystems
            </CardTitle>
            <CardDescription>Exploring how living things interact with their environment</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students investigate how organisms form groups that help members survive, analyze how habitats support
              different organisms, and explore how environmental changes affect plants and animals. They also examine
              how variations in traits can provide advantages for survival.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade3-subjects/science/interdependent-relationships">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-amber-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-amber-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Beaker className="h-5 w-5" />
              Inheritance and Variation of Traits
            </CardTitle>
            <CardDescription>Understanding life cycles and inherited traits</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Grade 3 students develop models to describe the unique and diverse life cycles of organisms. They analyze
              evidence of inherited traits, explore how traits can be influenced by the environment, and investigate how
              variations in traits can provide advantages for survival.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade3-subjects/science/inheritance-variation">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Wind className="h-5 w-5" />
              Weather and Climate
            </CardTitle>
            <CardDescription>Investigating weather patterns and climate zones</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students learn to represent and analyze weather data, describe climates in different regions of the world,
              and design solutions to reduce the impacts of weather-related hazards. They explore how weather patterns
              affect human activities and the environment.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade3-subjects/science/weather-climate">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-pink-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Mountain className="h-5 w-5" />
              Earth's Systems
            </CardTitle>
            <CardDescription>Exploring Earth's features and processes</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              In Grade 3, students investigate the different types of landforms and bodies of water on Earth. They
              explore how Earth's systems interact, examine the distribution of water on Earth, and learn about natural
              hazards and how humans can reduce their impacts.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade3-subjects/science/earth-systems">
              <Button className="w-full bg-pink-600 hover:bg-pink-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-indigo-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Waves className="h-5 w-5" />
              Engineering Design
            </CardTitle>
            <CardDescription>Solving problems through design and innovation</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students learn to define simple design problems, develop possible solutions, and evaluate their
              effectiveness. They apply scientific ideas to design, test, and refine devices that solve specific
              problems, developing skills in planning, testing, and improving their designs.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade3-subjects/science/engineering-design">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">View Strand</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade 3 Science Overview</h2>
        <p className="mb-4 text-gray-700">
          The Grade 3 science curriculum is designed to build upon the foundation established in Grade 2. It encourages
          students to develop deeper understanding, critical thinking skills, and greater independence in their
          scientific investigations. The curriculum is organized around key strands, each with specific learning
          outcomes and expectations.
        </p>
        <p className="text-gray-700">
          Teachers are encouraged to integrate learning across strands where appropriate, creating meaningful
          connections for students. Assessment is ongoing and designed to support student growth and development in
          scientific understanding, inquiry skills, and the application of knowledge to real-world situations.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/curriculum/grade3-subjects/activities/science" className="flex items-center">
            <span className="mr-2">View Science Activities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
