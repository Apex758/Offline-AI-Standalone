"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FlaskRoundIcon as Flask, Globe, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EarthSystemsProcessesPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Science
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
            Earth Systems: Processes That Shape The Earth Activities
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore Earth's dynamic processes with these engaging activities focused on Earth events, weathering, and
            erosion.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Flask className="h-5 w-5" />
              Fast and Slow Earth Events
            </CardTitle>
            <CardDescription>Investigate evidence that Earth events can occur quickly or slowly.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              In this activity, students will use information from several sources to provide evidence that Earth events
              can occur quickly or slowly, such as volcanic explosions, earthquakes, and erosion of rocks.
            </p>
            <Link href="/curriculum/grade2-subjects/activities/science/earth-systems-processes/fast-slow-events">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Earth Events</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Globe className="h-5 w-5" />
              Preventing Wind and Water Erosion
            </CardTitle>
            <CardDescription>Compare solutions designed to slow or prevent wind or water erosion.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Students will compare multiple solutions designed to slow or prevent wind or water from changing the shape
              of the land, such as different designs of dikes, windbreaks, and vegetation.
            </p>
            <Link href="/curriculum/grade2-subjects/activities/science/earth-systems-processes/preventing-erosion">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Preventing Erosion</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BookOpen className="h-5 w-5" />
              Land and Water Models
            </CardTitle>
            <CardDescription>
              Develop a model to represent the shapes and kinds of land and bodies of water.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Students will develop a model to represent the shapes and kinds of land and bodies of water in an area,
              focusing on understanding the different features and their characteristics.
            </p>
            <Link href="/curriculum/grade2-subjects/activities/science/earth-systems-processes/land-water-models">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Land and Water Models</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BookOpen className="h-5 w-5" />
              Water on Earth
            </CardTitle>
            <CardDescription>
              Obtain information to identify where water is found on Earth and its forms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Students will obtain information to identify where water is found on Earth and that it can be solid or
              liquid, exploring the different forms and locations of water on our planet.
            </p>
            <Link href="/curriculum/grade2-subjects/activities/science/earth-systems-processes/water-on-earth">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Water on Earth</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Earth Systems: Processes Overview</h2>
        <p className="mb-4 text-gray-700">
          This section of the Grade 2 Science curriculum focuses on Earth systems and the processes that shape the
          Earth. It encourages students to explore the natural world through inquiry-based learning, investigating Earth
          events, weathering, and erosion while developing scientific thinking skills.
        </p>
        <p className="text-gray-700">
          Teachers are encouraged to integrate learning across subject areas where appropriate, creating meaningful
          connections for students. Assessment is ongoing and designed to support student growth and development.
        </p>
      </div>
    </div>
  )
}
