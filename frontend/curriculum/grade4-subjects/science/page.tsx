import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beaker, Leaf, Mountain, ChevronLeft, ChevronRight, Zap } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade4SciencePage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Subjects
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Grade 4 Science Curriculum
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Science education encourages curiosity, critical thinking, and problem-solving skills. The Grade 4
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
              Energy
            </CardTitle>
            <CardDescription>Understanding energy and its effects on objects</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              In Grade 4, students explore different forms of energy and how it is transferred. They investigate
              potential and kinetic energy, and learn how energy is transformed. Students also design solutions to
              problems involving energy.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade4-subjects/science/energy">
              <Button className="w-full bg-green-600 hover:bg-green-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Leaf className="h-5 w-5" />
              Waves
            </CardTitle>
            <CardDescription>Exploring how waves transfer information</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students investigate how waves transfer information, analyze how amplitude and wavelength affect the
              energy of a wave, and explore how different types of waves are used in communication.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade4-subjects/science/waves">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-amber-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-amber-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Beaker className="h-5 w-5" />
              Structure and Function
            </CardTitle>
            <CardDescription>Understanding how structure relates to function in living things</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Grade 4 students develop models to describe how light reflecting from objects allows them to be seen. They
              analyze evidence of inherited traits, explore how traits can be influenced by the environment, and
              investigate how variations in traits can provide advantages for survival.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade4-subjects/science/structure-function">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Mountain className="h-5 w-5" />
              Earth Systems
            </CardTitle>
            <CardDescription>Investigating Earth's features and processes</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students learn to represent and analyze data from maps, describe patterns of Earth’s features, and design
              solutions to reduce the impacts of natural Earth processes on humans. They explore how Earth systems
              interact and affect human activities and the environment.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade4-subjects/science/earth-systems">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">View Strand</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade 4 Science Overview</h2>
        <p className="mb-4 text-gray-700">
          The Grade 4 science curriculum is designed to build upon the foundation established in Grade 3. It encourages
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
          <Link href="/curriculum/grade4-subjects/activities/science" className="flex items-center">
            <span className="mr-2">View Science Activities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
