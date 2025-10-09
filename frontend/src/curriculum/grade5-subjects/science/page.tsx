'use client'

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beaker, Leaf, Mountain, ChevronLeft, ChevronRight, Zap, Atom, Globe, Rocket } from 'lucide-react'
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5SciencePage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Subjects
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Grade 5 Science Curriculum
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Science education encourages curiosity, critical thinking, and problem-solving skills. The Grade 5
            curriculum builds upon foundational concepts and introduces new scientific ideas through engaging, hands-on
            learning experiences and investigations of the natural world.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-green-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Atom className="h-5 w-5" />
              Structure and Properties of Matter
            </CardTitle>
            <CardDescription>Exploring the composition and properties of matter</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              In Grade 5, students delve into the particle theory of matter, states of matter, conservation of mass,
              physical and chemical properties, and changes. They also explore mixtures and solutions.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade5-subjects/science/structure-properties-matter">
              <Button className="w-full bg-green-600 hover:bg-green-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Leaf className="h-5 w-5" />
              Matter and Energy in Organisms and Ecosystems
            </CardTitle>
            <CardDescription>Understanding energy flow and material cycles in ecosystems</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students investigate energy transfer from the sun to organisms, food chains and webs, plant growth and
              material sources, movement of matter, and the processes of photosynthesis and energy cycles.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade5-subjects/science/matter-energy-organisms-ecosystems">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-amber-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-amber-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Globe className="h-5 w-5" />
              Earth Systems
            </CardTitle>
            <CardDescription>Investigating Earth's interconnected systems</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Grade 5 students explore interactions between Earth's spheres (geosphere, hydrosphere, atmosphere,
              biosphere), water distribution, environmental protection, conservation, and human impact on Earth's
              resources.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade5-subjects/science/earth-systems">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Rocket className="h-5 w-5" />
              Space Systems: Stars and the Solar System
            </CardTitle>
            <CardDescription>Exploring gravitational forces, stars, and patterns in the sky</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students investigate gravitational forces, the brightness of stars and distance relationships, daily and
              seasonal patterns (shadows, day/night, star positions), and Earth's rotation and orbit.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade5-subjects/science/space-systems">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Beaker className="h-5 w-5" />
              Engineering
            </CardTitle>
            <CardDescription>Applying scientific knowledge to design and improve technologies</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students engage in design and testing of prototypes, explore simple machines and mechanical advantage,
              investigate electrical circuits and conductors/insulators, and apply technological solutions to problems
              through fair testing and controlled variables.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade5-subjects/science/engineering">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">View Strand</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade 5 Science Overview</h2>
        <p className="mb-4 text-gray-700">
          The Grade 5 science curriculum is designed to build upon the foundation established in Grade 4. It encourages
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
          <Link href="/curriculum/grade5-subjects/activities/science" className="flex items-center">
            <span className="mr-2">View Science Activities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}