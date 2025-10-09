"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlaskRoundIcon as Flask, Globe, ChevronLeft, Wrench, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade2SciencePage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Subjects
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
            Grade 2 Science Curriculum
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            The Grade 2 Science curriculum encourages students to explore the natural world through inquiry-based
            learning. Students investigate life cycles, materials, forces, and environmental changes while developing
            scientific thinking skills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Flask className="h-5 w-5" />
              Structure and Properties of Matter
            </CardTitle>
            <CardDescription>Exploring the building blocks of our world</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Grade 2 Science curriculum explores the structure and properties of matter, encouraging students to
              describe and classify different kinds of materials by their observable properties.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Matter</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Properties</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                States of Matter
              </span>
            </div>
            <Link href="/curriculum/grade2-subjects/science/structure-properties-matter">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Explore Structure and Properties of Matter
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-amber-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Leaf className="h-5 w-5" />
              Interdependent Relationships in Ecosystems
            </CardTitle>
            <CardDescription>Understanding connections in nature</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Grade 2 Science curriculum explores the interdependent relationships in ecosystems, encouraging
              students to understand how plants and animals rely on each other and their environment.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">Ecosystems</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Relationships
              </span>
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">Habitats</span>
            </div>
            <Link href="/curriculum/grade2-subjects/science/interdependent-relationships">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">Explore Interdependent Relationships</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Globe className="h-5 w-5" />
              Earth Systems: Processes That Shape The Earth
            </CardTitle>
            <CardDescription>Exploring Earth's dynamic processes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Grade 2 Science curriculum explores Earth systems and the processes that shape the Earth, encouraging
              students to understand how Earth events can occur quickly or slowly.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Earth Events</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Weathering</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Erosion</span>
            </div>
            <Link href="/curriculum/grade2-subjects/science/earth-systems-processes">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Earth Systems</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Wrench className="h-5 w-5" />
              Engineering Design
            </CardTitle>
            <CardDescription>Designing solutions to real-world problems</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Grade 2 Science curriculum introduces engineering design, encouraging students to ask questions, make
              observations, and gather information to define simple problems that can be solved through the development
              of new or improved objects or tools.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Problem Solving
              </span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Design Loop
              </span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Invention</span>
            </div>
            <Link href="/curriculum/grade2-subjects/science/engineering-design">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Explore Engineering Design</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade 2 Science Curriculum Overview</h2>
        <p className="mb-4 text-gray-700">
          The Grade 2 Science curriculum is designed to build upon the foundation established in Grade 1. It encourages
          students to develop deeper understanding, critical thinking skills, and greater independence in their learning
          journey. The curriculum is organized around key subject areas, each with specific learning outcomes and
          expectations.
        </p>
        <p className="text-gray-700">
          Teachers are encouraged to integrate learning across subject areas where appropriate, creating meaningful
          connections for students. Assessment is ongoing and designed to support student growth and development.
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link href="/curriculum/grade2-subjects/activities/science">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Explore Grade 2 Science Activities
          </Button>
        </Link>
      </div>
    </div>
  )
}
