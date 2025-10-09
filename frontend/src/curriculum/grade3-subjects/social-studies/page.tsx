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
        <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700">Grade 3 Social Studies</h1>
          <p className="text-gray-700">
            In Grade 3 Social Studies, students deepen their understanding of history, geography, civics, and economics
            through inquiry-based learning. They explore their island's cultural heritage, develop spatial awareness of
            their region, learn about civic responsibilities, and examine economic decision-making. Through diverse
            learning experiences, students develop essential knowledge and skills to become engaged citizens who
            appreciate their Caribbean identity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        <Link href="/curriculum/grade3-subjects/social-studies/historical-cultural-thinking">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-blue-500 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Historical and Cultural Thinking</h2>
              <p className="text-gray-600">
                Students explore their island's diverse heritage by studying ancestors, cultural contributions, local
                dialects, and how music has changed over time, nurturing respect for diversity.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/curriculum/grade3-subjects/social-studies/spatial-thinking">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-teal-500 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <Map className="h-6 w-6 text-teal-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Spatial Thinking</h2>
              <p className="text-gray-600">
                Students appreciate how geographic factors like tropical climate, island environment, and natural
                hazards shape Caribbean life, while learning to prepare for environmental challenges.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/curriculum/grade3-subjects/social-studies/civic-participation">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-purple-500 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Civic Participation</h2>
              <p className="text-gray-600">
                Students develop national pride by learning about their country's symbols, anthem, pledge, national
                birds and trees, and the contributions of national heroes to their society.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/curriculum/grade3-subjects/social-studies/economic-decision-making">
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
                Students understand how natural and human resources shape island identity through exploring economic
                activities, cultural economy, population changes, and the impacts of migration.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">Grade 3 Social Studies Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-lg mb-2 text-blue-700">Learning Approach</h3>
            <p className="text-gray-700 mb-4">
              Students engage in diverse learning experiences including discussions, role-plays, field trips, research
              projects, and community service activities. Through these experiences, students develop critical thinking
              skills and deepen their understanding of their role in their community, country, and the wider Caribbean
              region.
            </p>
            <h3 className="font-medium text-lg mb-2 text-blue-700">Assessment</h3>
            <p className="text-gray-700">
              Assessment includes observations of student participation, conversations about concepts, and products such
              as research projects, role-plays, journals, digital presentations, and creative expressions that
              demonstrate understanding of social studies concepts and their application to real-world contexts.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2 text-blue-700">Cross-Curricular Connections</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Language Arts: Reading historical texts, writing reflections, creating cultural stories</li>
              <li>Mathematics: Analyzing population data, measuring distances on maps, creating graphs</li>
              <li>Science: Understanding natural resources, environmental changes, and natural hazards</li>
              <li>Arts: Creating visual representations of cultural heritage and national symbols</li>
              <li>Technology: Using digital tools for research and presentations about Caribbean culture</li>
            </ul>
            <div className="mt-4">
              <Image
                src="/placeholder-4x4ma.png"
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
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/curriculum/grade3-subjects/activities/social-studies" className="flex items-center">
            <span className="mr-2">View Social Studies Activities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
