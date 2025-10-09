"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FlaskRoundIcon as Flask, Globe, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EngineeringDesignPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Science
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600">
            Engineering Design Activities
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the world of engineering with these engaging activities focused on problem-solving, design, and
            innovation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Flask className="h-5 w-5" />
              Defining a Simple Problem
            </CardTitle>
            <CardDescription>Ask questions and gather information to define a problem.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              In this activity, students will ask questions, make observations, and gather information about a situation
              people want to change to define a simple problem that can be solved through engineering.
            </p>
            <Link href="/curriculum/grade2-subjects/activities/science/engineering-design/defining-problem">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Explore Defining Problems</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Globe className="h-5 w-5" />
              Shape and Function
            </CardTitle>
            <CardDescription>Develop a model to illustrate how shape helps an object function.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Students will develop a simple sketch, drawing, or physical model to illustrate how the shape of an object
              helps it function as needed to solve a given problem.
            </p>
            <Link href="/curriculum/grade2-subjects/activities/science/engineering-design/shape-function">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Explore Shape and Function</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <BookOpen className="h-5 w-5" />
              Testing Object Designs
            </CardTitle>
            <CardDescription>
              Analyze data from tests to compare the strengths and weaknesses of designs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Students will analyze data from tests of at least two objects designed to solve the same problem to
              compare the strengths and weaknesses of how each performs.
            </p>
            <Link href="/curriculum/grade2-subjects/activities/science/engineering-design/testing-designs">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Explore Testing Object Designs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Engineering Design Overview</h2>
        <p className="mb-4 text-gray-700">
          This section of the Grade 2 Science curriculum focuses on engineering design. It encourages students to
          explore the natural world through inquiry-based learning, investigating life cycles, materials, forces, and
          environmental changes while developing scientific thinking skills.
        </p>
        <p className="text-gray-700">
          Teachers are encouraged to integrate learning across subject areas where appropriate, creating meaningful
          connections for students. Assessment is ongoing and designed to support student growth and development.
        </p>
      </div>
    </div>
  )
}
