import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Hash, Ruler, ChevronLeft, ChevronRight, BarChart, Shapes, Repeat } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade2MathematicsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Subjects
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Grade 2 Mathematics Curriculum
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Mathematics provides students with essential skills for understanding the world, solving problems, and
            making informed decisions. The Grade 2 curriculum builds upon foundational concepts and introduces new
            mathematical ideas through engaging, hands-on learning experiences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-teal-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-teal-700">
              <Hash className="h-5 w-5" />
              Number Sense
            </CardTitle>
            <CardDescription>Understanding numbers and their relationships</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              In Grade 2, students develop a deeper understanding of numbers up to 100, including place value, comparing
              and ordering numbers, and working with simple fractions. They learn to recognize patterns in numbers and
              develop mental math strategies.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade2-subjects/mathematics/number-sense">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calculator className="h-5 w-5" />
              Operations
            </CardTitle>
            <CardDescription>Addition, subtraction, and early multiplication concepts</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students build fluency with addition and subtraction within 100, using various strategies including place
              value, properties of operations, and the relationship between addition and subtraction. They also explore
              the foundations of multiplication through repeated addition and arrays.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade2-subjects/mathematics/operations">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-amber-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-amber-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Repeat className="h-5 w-5" />
              Patterns & Relationships
            </CardTitle>
            <CardDescription>Recognizing, creating, and extending patterns</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Grade 2 students identify, describe, extend, and create a variety of patterns, including those found in
              real-life contexts. They develop algebraic thinking by exploring number relationships and solving problems
              with unknown quantities.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade2-subjects/mathematics/patterns-relationships">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Shapes className="h-5 w-5" />
              Geometrical Thinking
            </CardTitle>
            <CardDescription>Exploring shapes and their attributes</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students analyze and classify two-dimensional shapes as polygons or non-polygons based on their
              attributes. They recognize, name, and build three-dimensional shapes, and develop spatial reasoning
              through various activities and explorations.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade2-subjects/mathematics/geometrical-thinking">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-pink-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Ruler className="h-5 w-5" />
              Measurement
            </CardTitle>
            <CardDescription>Understanding and applying measurement concepts</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              In Grade 2, students learn to measure length, weight, and capacity using standard units. They tell and
              write time to the nearest five minutes, and solve problems involving money. Students also estimate
              measurements and make comparisons based on attributes.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade2-subjects/mathematics/measurement">
              <Button className="w-full bg-pink-600 hover:bg-pink-700">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-indigo-500 hover:-translate-y-1">
          <CardHeader className="pb-3 bg-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <BarChart className="h-5 w-5" />
              Data Handling & Probability
            </CardTitle>
            <CardDescription>Collecting, organizing, and analyzing data</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Students learn to collect, organize, and represent data using pictographs and bar graphs. They interpret
              data to answer questions and make decisions. Grade 2 students also explore basic probability concepts,
              using terms like "impossible," "possible," and "certain."
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade2-subjects/mathematics/data-handling">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">View Strand</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade 2 Mathematics Overview</h2>
        <p className="mb-4 text-gray-700">
          The Grade 2 mathematics curriculum is designed to build upon the foundation established in Grade 1. It
          encourages students to develop deeper understanding, critical thinking skills, and greater independence in
          their mathematical reasoning. The curriculum is organized around key strands, each with specific learning
          outcomes and expectations.
        </p>
        <p className="text-gray-700">
          Teachers are encouraged to integrate learning across strands where appropriate, creating meaningful
          connections for students. Assessment is ongoing and designed to support student growth and development in
          mathematical understanding and skills.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/curriculum/grade2-subjects/activities/mathematics" className="flex items-center">
            <span className="mr-2">View Mathematics Activities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
