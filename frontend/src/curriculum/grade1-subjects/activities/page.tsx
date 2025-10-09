import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Calculator, BookOpen, Beaker, Globe } from "lucide-react"

export default function Grade1ActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 1 Subjects
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Grade 1 Activities</h1>
        <p className="text-gray-600 mb-4">
          Explore these engaging, hands-on activities designed to support the Grade 1 curriculum across all subject
          areas. Each activity aligns with specific curriculum outcomes while making learning fun and interactive.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Mathematics Activities
            </CardTitle>
            <CardDescription>Hands-on activities for number sense, patterns, measurement, and more</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Explore fun, interactive activities that help students develop foundational math skills through play and
              discovery. These activities support the development of number sense, pattern recognition, measurement
              concepts, and problem-solving skills.
            </p>
            <Button asChild className="w-full">
              <Link href="/curriculum/grade1-subjects/activities/mathematics">View Activities</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-green-600" />
              Science Activities
            </CardTitle>
            <CardDescription>Experiments and explorations with light, sound, animals, and space</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Discover simple science experiments and hands-on investigations that encourage observation, questioning,
              and discovery. These activities help students explore concepts related to light and sound, animal
              adaptations, and day and night cycles.
            </p>
            <Button asChild className="w-full">
              <Link href="/curriculum/grade1-subjects/activities/science">View Activities</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Language Arts Activities
            </CardTitle>
            <CardDescription>Engaging activities for listening, speaking, reading, and writing</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Explore creative activities that develop literacy skills through storytelling, reading strategies, and
              writing practice. These activities support the development of phonological awareness, comprehension, and
              communication skills.
            </p>
            <Button asChild className="w-full">
              <Link href="/curriculum/grade1-subjects/activities/language-arts">View Activities</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-amber-50">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-600" />
              Social Studies Activities
            </CardTitle>
            <CardDescription>Activities exploring culture, community, and economic awareness</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Discover activities that help students understand their place in the community and world. These activities
              explore cultural celebrations, community helpers, and basic economic concepts through hands-on,
              collaborative learning.
            </p>
            <Button asChild className="w-full">
              <Link href="/curriculum/grade1-subjects/activities/social-studies">View Activities</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cross-Curricular Activities</CardTitle>
          <CardDescription>Activities that integrate multiple subject areas for comprehensive learning</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            These integrated activities combine concepts from multiple subject areas, helping students make connections
            across the curriculum. The weather station activity, for example, incorporates mathematics, science,
            language arts, and social studies concepts.
          </p>
          <Button asChild className="w-full md:w-auto">
            <Link href="/curriculum/grade1-subjects/activities/cross-curricular">View Cross-Curricular Activities</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Using These Activities</h2>
        <p className="mb-4">
          These activities are designed to be flexible and adaptable to different classroom settings and student needs.
          They can be used as:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Whole-class lessons to introduce new concepts</li>
          <li>Small group activities for collaborative learning</li>
          <li>Learning center activities for independent exploration</li>
          <li>Extension activities for students who need additional challenges</li>
          <li>Home connection activities to engage families in the learning process</li>
        </ul>
        <p className="mt-4">
          Each activity includes a list of materials, step-by-step instructions, and suggestions for extensions or
          modifications. Printable resources are also provided where applicable.
        </p>
      </div>
    </div>
  )
}
