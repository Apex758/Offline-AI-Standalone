import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History, MapPin, Users, DollarSign, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6SocialStudiesPage() {
  return (
    <div>
      <div className="container mx-auto py-8">
                <Link href="/curriculum/grade6-subjects">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Subjects
          </Button>
        </Link>

        <div className="w-full min-w-full max-w-[100vw] mb-8">
          <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
            <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
              Grade 6 Social Studies
            </h1>
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
              Explore the Caribbean's place in the global community through historical understanding, spatial awareness,
              civic participation, and economic decision-making. Students develop critical thinking skills while
              understanding their role as global citizens in an interconnected world.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-amber-500 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <History className="h-5 w-5" />
                Historical and Cultural Thinking
              </CardTitle>
              <CardDescription>Understanding global diversity and Caribbean heritage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Students explore the end of slavery, East Indian contributions to Caribbean culture, regional arts and
                sports connections, and migration patterns. They develop understanding of how diversity strengthens
                communities and how cultural exchanges shape Caribbean identity in the global context.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Slavery & Emancipation
                </span>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  East Indian Culture
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Regional Arts & Sports
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Migration Patterns
                </span>
              </div>
              <Link href="/curriculum/grade6-subjects/social-studies/historical-cultural-thinking">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Explore Historical Thinking</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <MapPin className="h-5 w-5" />
                Spatial Thinking
              </CardTitle>
              <CardDescription>Exploring global geography and environmental adaptation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Students investigate world continents and oceans, global climatic regions, human adaptation to diverse
                environments, and extreme weather conditions. They develop geographic skills while understanding how
                location and climate influence lifestyle, technology use, and international cooperation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  World Geography
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Climatic Regions
                </span>
                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Human Adaptation
                </span>
                <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Extreme Weather
                </span>
              </div>
              <Link href="/curriculum/grade6-subjects/social-studies/spatial-thinking">
                <Button className="w-full bg-green-600 hover:bg-green-700">Explore Spatial Thinking</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Users className="h-5 w-5" />
                Civic Participation
              </CardTitle>
              <CardDescription>Understanding global citizenship and democratic participation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Students examine national identity, international organizations, global social issues, international
                cooperation, electoral processes, and media literacy. They develop skills for active citizenship while
                understanding how complex global problems require international cooperation and informed participation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  National Identity
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  International Organizations
                </span>
                <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Electoral Process
                </span>
                <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Media Literacy
                </span>
              </div>
              <Link href="/curriculum/grade6-subjects/social-studies/civic-participation">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Explore Civic Participation</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <DollarSign className="h-5 w-5" />
                Economic Decision Making
              </CardTitle>
              <CardDescription>Understanding global economics and sustainable development</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Students analyze consumer rights and responsibilities, tourism impacts, international relations, global
                resources, and economic sectors. They explore how regional and international movement of goods, people,
                and services shapes Caribbean society and global economic relationships.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Consumer Rights
                </span>
                <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Tourism Impact
                </span>
                <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Global Resources
                </span>
                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Economic Sectors
                </span>
              </div>
              <Link href="/curriculum/grade6-subjects/social-studies/economic-decision-making">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Economic Decision Making</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade 6 Social Studies Overview</h2>
          <p className="mb-4 text-gray-700">
            The Grade 6 Social Studies curriculum, titled "The Caribbean in the World," provides students with a
            comprehensive understanding of how the Caribbean region connects to and participates in the global
            community. Students develop critical thinking skills while exploring themes of diversity, adaptation,
            cooperation, and sustainable development.
          </p>
          <p className="text-gray-700">
            Through inquiry-based learning, collaborative projects, and real-world connections, students examine complex
            global problems and understand the importance of international cooperation. They explore how historical
            events shape present realities, how geography influences human adaptation, how citizens participate in
            democratic processes, and how economic decisions impact local and global communities.
          </p>
        </div>
      </div>

      <div className="mb-8 text-center">
        <Link href="/curriculum/grade6-subjects/activities/social-studies">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Users className="mr-2 h-5 w-5" />
            View Social Studies Activities
          </Button>
        </Link>
      </div>
    </div>
  )
}
