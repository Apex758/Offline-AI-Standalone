import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Grade 4 Mathematics Activities",
  description: "Engaging mathematics activities for Grade 4 students across all strands",
}

export default function Grade4MathematicsActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          { label: "Activities", href: "/curriculum/grade4-subjects/activities/mathematics" },
        ]}
      />

      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">Grade 4 Mathematics Activities</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Explore engaging and interactive mathematics activities designed for Grade 4 students. These activities
          support the development of mathematical concepts across all strands of the curriculum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Number Sense</CardTitle>
            <CardDescription>
              Activities focused on place value, multi-digit numbers, fractions, and decimals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative mb-4">
              <Image
                src="/placeholder-1sfkd.png"
                alt="Children learning number sense concepts"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-sm">
              Develop understanding of numbers to 10,000, place value, fractions, and decimals through hands-on
              activities and games.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/curriculum/grade4-subjects/activities/mathematics/number-sense"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View activities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Operations with Numbers</CardTitle>
            <CardDescription>Activities focused on multi-digit operations and problem-solving</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative mb-4">
              <Image
                src="/placeholder-pc7dd.png"
                alt="Children learning multiplication and division"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-sm">
              Build fluency with multi-digit operations, develop efficient calculation strategies, and apply operations
              to solve real-world problems.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/curriculum/grade4-subjects/activities/mathematics/operations-with-numbers"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View activities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Patterns & Relationships</CardTitle>
            <CardDescription>Activities focused on number patterns and algebraic thinking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative mb-4">
              <Image
                src="/placeholder-hiczo.png"
                alt="Children exploring patterns and relationships"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-sm">
              Identify, describe, and extend patterns, explore number relationships, and develop early algebraic
              thinking through engaging activities.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/curriculum/grade4-subjects/activities/mathematics/patterns-relationships"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View activities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Geometrical Thinking</CardTitle>
            <CardDescription>Activities focused on polygons, angles, symmetry, and transformations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative mb-4">
              <Image
                src="/placeholder.svg?height=400&width=600&query=children measuring angles with protractors"
                alt="Children learning about geometric shapes and angles"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-sm">
              Explore properties of polygons, classify quadrilaterals, measure angles, and investigate symmetry and
              transformations through hands-on activities.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/curriculum/grade4-subjects/activities/mathematics/geometrical-thinking"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View activities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Measurement</CardTitle>
            <CardDescription>Activities focused on perimeter, area, volume, and unit conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative mb-4">
              <Image
                src="/placeholder.svg?height=400&width=600&query=children calculating area and perimeter of shapes"
                alt="Children measuring and calculating area"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-sm">
              Develop measurement skills through practical activities involving perimeter, area, volume, and converting
              between standard units of measurement.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/curriculum/grade4-subjects/activities/mathematics/measurement"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View activities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Data & Probability</CardTitle>
            <CardDescription>
              Activities focused on data representation, analysis, and probability experiments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative mb-4">
              <Image
                src="/placeholder.svg?height=400&width=600&query=children analyzing data and creating line plots"
                alt="Children creating and analyzing graphs"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-sm">
              Collect, organize, and analyze data using various representations, interpret data to draw conclusions, and
              explore probability through experiments and simulations.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/curriculum/grade4-subjects/activities/mathematics/data-probability"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View activities <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Teacher Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Activity Planning</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                <span>
                  Use the{" "}
                  <Link href="/planner" className="text-blue-600 hover:underline">
                    Lesson Planner
                  </Link>{" "}
                  to incorporate these activities into your lessons
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                <span>Download printable activity guides for offline use in your classroom</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                <span>
                  Adapt activities for different learning needs using our{" "}
                  <Link href="/innovative-tools" className="text-blue-600 hover:underline">
                    Differentiation Tools
                  </Link>
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Assessment</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                <span>Access formative assessment tools aligned with each activity</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                <span>Track student progress across mathematics strands</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                <span>Generate reports to share with parents and administrators</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
