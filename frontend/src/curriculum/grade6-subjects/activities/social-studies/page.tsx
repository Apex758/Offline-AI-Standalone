import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History, MapPin, Users, DollarSign, ChevronLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6SocialStudiesActivitiesPage() {
  return (
    <div>
      <div className="container mx-auto py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
            { label: "Social Studies", href: "/curriculum/grade6-subjects/social-studies" },
            { label: "Activities", href: "/curriculum/grade6-subjects/activities/social-studies" },
          ]}
        />

        <div className="w-full min-w-full max-w-[100vw] mb-8">
          <div className="bg-gradient-to-r from-blue-100 via-teal-100 to-green-100 p-8 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
              Grade 6 Social Studies Activities
            </h1>
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto mb-4">
              Explore engaging activities that help students understand the Caribbean's place in the global community.
              These hands-on experiences develop critical thinking, cultural awareness, and global citizenship skills.
            </p>
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-600">Theme: The Caribbean in the World</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-amber-500 hover:-translate-y-2 group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-amber-700 text-xl">
                <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <History className="h-6 w-6" />
                </div>
                Historical and Cultural Thinking
              </CardTitle>
              <CardDescription className="text-base">
                Explore global diversity, Caribbean heritage, and cultural connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700 leading-relaxed">
                Students investigate the end of slavery, East Indian contributions to Caribbean culture, regional arts
                and sports connections, and migration patterns. Activities include creative expression projects, press
                conferences, route mapping, and cultural showcases that bring history to life.
              </p>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-800">Featured Activities:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-amber-50 p-2 rounded border-l-2 border-amber-300">
                    <span className="font-medium">Picture & Video Inferencing</span>
                  </div>
                  <div className="bg-orange-50 p-2 rounded border-l-2 border-orange-300">
                    <span className="font-medium">Story Mapping</span>
                  </div>
                  <div className="bg-red-50 p-2 rounded border-l-2 border-red-300">
                    <span className="font-medium">Timeline Gaming</span>
                  </div>
                  <div className="bg-pink-50 p-2 rounded border-l-2 border-pink-300">
                    <span className="font-medium">Cultural Showcases</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                  Slavery & Emancipation
                </span>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">
                  East Indian Culture
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                  Regional Arts & Sports
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                  Migration Patterns
                </span>
              </div>

              <Link to="/curriculum/grade6-subjects/social-studies/historical-cultural-thinking/activities">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Historical Activities
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 hover:-translate-y-2 group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-green-700 text-xl">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                Spatial Thinking
              </CardTitle>
              <CardDescription className="text-base">
                Investigate global geography and environmental adaptation strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700 leading-relaxed">
                Students explore world continents and oceans, global climatic regions, human adaptation to diverse
                environments, and extreme weather management. Activities include interactive geography games, virtual
                field trips, weather report creation, and case study analysis of real Caribbean weather events.
              </p>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-800">Featured Activities:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-green-50 p-2 rounded border-l-2 border-green-300">
                    <span className="font-medium">Earth from Space</span>
                  </div>
                  <div className="bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                    <span className="font-medium">Continents Discovery</span>
                  </div>
                  <div className="bg-teal-50 p-2 rounded border-l-2 border-teal-300">
                    <span className="font-medium">Weather News Reports</span>
                  </div>
                  <div className="bg-cyan-50 p-2 rounded border-l-2 border-cyan-300">
                    <span className="font-medium">Case Study Analysis</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                  World Geography
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  Climatic Regions
                </span>
                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">
                  Human Adaptation
                </span>
                <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-3 py-1 rounded-full">
                  Extreme Weather
                </span>
              </div>

              <Link to="/curriculum/grade6-subjects/social-studies/spatial-thinking/activities">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Spatial Activities
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-2 group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-purple-700 text-xl">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                Civic Participation
              </CardTitle>
              <CardDescription className="text-base">
                Develop global citizenship and democratic participation skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700 leading-relaxed">
                Students examine national identity, international organizations, global social issues, international
                cooperation, electoral processes, and media literacy. Activities focus on developing active citizenship
                skills while understanding how complex global problems require international cooperation and informed
                participation.
              </p>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-800">Key Focus Areas:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-purple-50 p-2 rounded border-l-2 border-purple-300">
                    <span className="font-medium">National Identity</span>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded border-l-2 border-indigo-300">
                    <span className="font-medium">International Organizations</span>
                  </div>
                  <div className="bg-pink-50 p-2 rounded border-l-2 border-pink-300">
                    <span className="font-medium">Electoral Processes</span>
                  </div>
                  <div className="bg-violet-50 p-2 rounded border-l-2 border-violet-300">
                    <span className="font-medium">Media Literacy</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                  Global Citizenship
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                  Democratic Participation
                </span>
                <span className="bg-pink-100 text-pink-800 text-xs font-medium px-3 py-1 rounded-full">
                  International Cooperation
                </span>
                <span className="bg-violet-100 text-violet-800 text-xs font-medium px-3 py-1 rounded-full">
                  Social Issues
                </span>
              </div>

              <Link to="/curriculum/grade6-subjects/social-studies/civic-participation/activities">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Civic Activities
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-2 group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-blue-700 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <DollarSign className="h-6 w-6" />
                </div>
                Economic Decision Making
              </CardTitle>
              <CardDescription className="text-base">
                Understand global economics and sustainable development principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700 leading-relaxed">
                Students analyze consumer rights and responsibilities, tourism impacts, international relations, global
                resources, and economic sectors. They explore how regional and international movement of goods, people,
                and services shapes Caribbean society and global economic relationships.
              </p>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-800">Key Focus Areas:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                    <span className="font-medium">Consumer Rights</span>
                  </div>
                  <div className="bg-sky-50 p-2 rounded border-l-2 border-sky-300">
                    <span className="font-medium">Tourism Impact</span>
                  </div>
                  <div className="bg-cyan-50 p-2 rounded border-l-2 border-cyan-300">
                    <span className="font-medium">Global Resources</span>
                  </div>
                  <div className="bg-teal-50 p-2 rounded border-l-2 border-teal-300">
                    <span className="font-medium">Economic Sectors</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  International Trade
                </span>
                <span className="bg-sky-100 text-sky-800 text-xs font-medium px-3 py-1 rounded-full">
                  Sustainable Development
                </span>
                <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-3 py-1 rounded-full">
                  Resource Management
                </span>
                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">
                  Economic Systems
                </span>
              </div>

              <Link to="/curriculum/grade6-subjects/social-studies/economic-decision-making/activities">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Economic Activities
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Activity-Based Learning Approach</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Collaborative Learning</h3>
              <p className="text-gray-600 text-sm">
                Students work together on projects that mirror real-world global cooperation and problem-solving.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-World Connections</h3>
              <p className="text-gray-600 text-sm">
                Activities connect classroom learning to current events and Caribbean experiences in the global context.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Critical Thinking</h3>
              <p className="text-gray-600 text-sm">
                Students analyze complex global issues and develop solutions through inquiry-based learning approaches.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Cross-Curricular Integration</h3>
            <p className="text-gray-700 mb-4">
              Grade 6 Social Studies activities integrate seamlessly with other subjects to provide holistic learning
              experiences:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                <span className="font-medium text-amber-800">Language Arts:</span>
                <p className="text-amber-700">Research, presentation, and communication skills</p>
              </div>
              <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <span className="font-medium text-green-800">Science:</span>
                <p className="text-green-700">Climate, weather patterns, and environmental science</p>
              </div>
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                <span className="font-medium text-blue-800">Mathematics:</span>
                <p className="text-blue-700">Data analysis, statistics, and economic calculations</p>
              </div>
              <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <span className="font-medium text-purple-800">Technology:</span>
                <p className="text-purple-700">Digital research, multimedia presentations, and online collaboration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/curriculum/grade6-subjects/social-studies">
            <Button variant="outline" size="lg" className="px-8 py-3">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back to Grade 6 Social Studies Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
