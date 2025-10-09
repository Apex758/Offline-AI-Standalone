import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History, MapPin, Users, DollarSign, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5SocialStudiesPage() {
  return (
    <div>
      <div className="container mx-auto py-8">
        
        <Link href="/curriculum/grade5-subjects">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Subjects
          </Button>
        </Link>

        <div className="w-full min-w-full max-w-[100vw] mb-8">
          <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
            <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
              Grade 5 Social Studies
            </h1>
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
              Explore the rich history, diverse geography, civic participation, and economic relationships that shape our
              Caribbean region. Students develop critical thinking skills while understanding their role as Caribbean
              citizens in an interconnected world.
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
              <CardDescription>Understanding our Caribbean heritage and cultural evolution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Students explore the evolution of communication technology, media literacy, European colonization, the
                experiences of enslaved Africans, and acts of resistance. They develop critical thinking skills to analyze
                historical sources and understand how the past shapes our present.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Communication Evolution
                </span>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Media Literacy
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Colonization Impact
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Resistance Stories
                </span>
              </div>
              <Link href="/curriculum/grade5-subjects/social-studies/historical-cultural-thinking">
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
              <CardDescription>Exploring Caribbean geography and environmental challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Students investigate Caribbean island classifications, volcanic vs coral formations, major landmarks,
                climate patterns, and severe weather events. They develop geographic skills while understanding how
                location influences culture, economy, and daily life.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Island Classifications
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Volcanic vs Coral
                </span>
                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Climate Patterns
                </span>
                <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Natural Disasters
                </span>
              </div>
              <Link href="/curriculum/grade5-subjects/social-studies/spatial-thinking">
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
              <CardDescription>Understanding government systems and regional cooperation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Students examine different government systems across the Caribbean, explore regional integration through
                organizations like CARICOM and OECS, and understand the importance of democratic participation and
                regional cooperation for Caribbean development.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Government Systems
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Regional Integration
                </span>
                <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  CARICOM & OECS
                </span>
                <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Democratic Values
                </span>
              </div>
              <Link href="/curriculum/grade5-subjects/social-studies/civic-participation">
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
              <CardDescription>Understanding trade, movement, and economic relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Students analyze Caribbean trade relationships, agricultural changes since 1900, transportation and
                communication networks, and the movement of people, goods, and services. They explore how economic
                decisions shape Caribbean society and daily life.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Regional Trade
                </span>
                <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Agricultural Change
                </span>
                <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Transportation
                </span>
                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Migration Patterns
                </span>
              </div>
              <Link href="/curriculum/grade5-subjects/social-studies/economic-decision-making">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Economic Decision Making</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade 5 Social Studies Overview</h2>
          <p className="mb-4 text-gray-700">
            The Grade 5 Social Studies curriculum, titled "Our Caribbean Region," provides students with a comprehensive
            understanding of the Caribbean's rich history, diverse geography, democratic institutions, and economic
            relationships. Students develop critical thinking skills while exploring how the past influences the present
            and how geographic factors shape cultural and economic patterns.
          </p>
          <p className="text-gray-700">
            Through inquiry-based learning, collaborative projects, and real-world connections, students examine the
            interconnected nature of Caribbean societies. They explore themes of resistance and resilience, regional
            cooperation, environmental challenges, and economic interdependence while developing their identity as
            informed Caribbean citizens prepared to participate in an increasingly connected world.
          </p>
        </div>
      </div>
      
      <div className="mb-8 text-center">
        <Link href="/curriculum/grade5-subjects/activities/social-studies">
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
