import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { BookOpen, Map, Users, DollarSign, ArrowRight, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function SocialStudiesPage() {
  return (
    <div className="container mx-auto py-8">
      

      <div className="mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-green-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-700">Grade 2 Social Studies</h1>
          <p className="text-gray-700">
            In Grade 2 Social Studies, students expand their understanding of history, geography, civics, and economics
            through inquiry-based learning. They explore their community's past and present, develop spatial thinking
            skills, learn about civic participation, and begin to understand economic decision-making. Through diverse
            learning experiences, students develop essential knowledge and skills to become engaged citizens.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        <Link href="/curriculum/grade2-subjects/social-studies/historical-cultural-thinking">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-teal-500 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Historical and Cultural Thinking</h2>
              <p className="text-gray-600">
                Students explore how our past and present shape our identity through studying ancestors, families,
                festivals, and historical sites.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/curriculum/grade2-subjects/social-studies/spatial-thinking">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-green-500 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Map className="h-6 w-6 text-green-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Spatial Thinking</h2>
              <p className="text-gray-600">
                Students develop an understanding of how islands are made up of diverse regions and communities by
                exploring maps, directions, and environmental features.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/curriculum/grade2-subjects/social-studies/civic-participation">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-blue-500 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Civic Participation</h2>
              <p className="text-gray-600">
                Students learn how rights and responsibilities are important for building strong communities through
                safety, conflict resolution, and community governance.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/curriculum/grade2-subjects/social-studies/economic-decision-making">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-amber-500 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Economic Decision Making</h2>
              <p className="text-gray-600">
                Students discover how communities provide goods and services to meet needs and wants through exploring
                resources, land use, jobs, and community workers.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">Grade 2 Social Studies Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-lg mb-2 text-teal-700">Learning Approach</h3>
            <p className="text-gray-700 mb-4">
              Students engage in diverse learning experiences including discussions, role-plays, field trips, visual
              analysis, and community service projects. Through these experiences, students develop critical thinking
              skills and begin to understand their role in their community and the wider world.
            </p>
            <h3 className="font-medium text-lg mb-2 text-teal-700">Assessment</h3>
            <p className="text-gray-700">
              Assessment includes observations of student participation, conversations about concepts, and products such
              as drawings, role-plays, journals, and presentations that demonstrate understanding of social studies
              concepts.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2 text-teal-700">Cross-Curricular Connections</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Language Arts: Reading stories about communities, writing reflections</li>
              <li>Mathematics: Creating graphs of community data, measuring distances on maps</li>
              <li>Science: Understanding natural resources and environmental changes</li>
              <li>Arts: Creating visual representations of community features and historical sites</li>
              <li>Physical Education: Playing traditional games from different cultures</li>
            </ul>
            <div className="mt-4">
              <Image
                src="/placeholder-ner2b.png"
                alt="Social Studies Learning"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/curriculum/grade2-subjects/activities/social-studies" className="flex items-center">
            <span className="mr-2">View Social Studies Activities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
