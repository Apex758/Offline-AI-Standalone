import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { FallbackImage } from "@/components/fallback-image"
import { Clock, BarChart2, BookOpen, ArrowRight } from "lucide-react"

export default function Grade2SocialStudiesActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      
      <div className="mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-green-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-700">Grade 2 Social Studies Activities</h1>
          <p className="text-gray-700">
            Explore these engaging activities designed to help Grade 2 students develop an understanding of history,
            geography, civics, and economics. These hands-on activities support the curriculum strands of Historical and
            Cultural Thinking, Spatial Thinking, Civic Participation, and Economic Decision Making.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Historical and Cultural Thinking Activities */}
        <Link to="/curriculum/grade2-subjects/activities/social-studies/family-tree-explorer">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-teal-500 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <FallbackImage
                  src="./family-tree-explorer.png"
                  alt="Family Tree Explorer"
                  fallbacksrc="./family-tree-activity.png"
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">Family Tree Explorer</h2>
                <p className="text-gray-600 mb-4">
                  Students create family trees to understand family relationships and heritage, connecting to their
                  cultural identity.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>45 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center text-teal-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Historical</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/curriculum/grade2-subjects/activities/social-studies/community-map-makers">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-green-500 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <FallbackImage
                  src="./community-map-makers.png"
                  alt="Community Map Makers"
                  fallbacksrc="./children-map-making.png"
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">Community Map Makers</h2>
                <p className="text-gray-600 mb-4">
                  Students create maps of their community, identifying key features and using cardinal directions.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>60 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Spatial</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/curriculum/grade2-subjects/activities/social-studies/conflict-resolution-heroes">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-blue-500 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <FallbackImage
                  src="./conflict-resolution-heroes.png"
                  alt="Conflict Resolution Heroes"
                  fallbacksrc="./children-resolving-conflict.png"
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">Conflict Resolution Heroes</h2>
                <p className="text-gray-600 mb-4">
                  Students learn and practice strategies for resolving conflicts through role-play and discussion.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>40 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span>Easy</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Civic</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/curriculum/grade2-subjects/activities/social-studies/goods-and-services-sort">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-amber-500 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <FallbackImage
                  src="./goods-and-services-sort.png"
                  alt="Goods and Services Sort"
                  fallbackSrc="/placeholder.svg?height=200&width=400&query=goods+and+services+activity"
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">Goods and Services Sort</h2>
                <p className="text-gray-600 mb-4">
                  Students identify and classify goods and services in their community through a sorting game.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>30 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span>Easy</span>
                  </div>
                  <div className="flex items-center text-amber-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Economic</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/curriculum/grade2-subjects/activities/social-studies/cultural-celebration-day">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-teal-500 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <FallbackImage
                  src="./cultural-celebration-day.png"
                  alt="Cultural Celebration Day"
                  fallbackSrc="/placeholder.svg?height=200&width=400&query=cultural+celebration+children"
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">Cultural Celebration Day</h2>
                <p className="text-gray-600 mb-4">
                  Students explore and celebrate cultural festivals and traditions from their community.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>90 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span>Advanced</span>
                  </div>
                  <div className="flex items-center text-teal-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Historical</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/curriculum/grade2-subjects/activities/social-studies/community-helpers-interview">
          <Card className="h-full transition-all hover:shadow-lg cursor-pointer border-l-4 border-amber-500 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <FallbackImage
                  src="./community-helpers-interview.png"
                  alt="Community Helpers Interview"
                  fallbackSrc="/placeholder.svg?height=200&width=400&query=community+helpers+children"
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">Community Helpers Interview</h2>
                <p className="text-gray-600 mb-4">
                  Students prepare questions and interview community workers to learn about their roles.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>60 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center text-amber-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Economic</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">About These Activities</h2>
        <p className="mb-4">
          These activities are designed to support the Grade 2 Social Studies curriculum, helping students develop an
          understanding of their community, history, geography, and economic concepts. Each activity includes clear
          learning objectives, step-by-step instructions, and assessment strategies.
        </p>
        <p>
          The activities are categorized by curriculum strand: Historical and Cultural Thinking, Spatial Thinking, Civic
          Participation, and Economic Decision Making. They can be adapted to meet the diverse needs of students and
          integrated with other subject areas.
        </p>
      </div>

      <div className="flex justify-between">
        <Link to="/curriculum/grade2-subjects/social-studies">
          <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Social Studies
          </button>
        </Link>
      </div>
    </div>
  )
}
