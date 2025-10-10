import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, BookOpen, Map, Target, CheckCircle, Star, Users2, Award } from "lucide-react"

export default function NeighborhoodMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/curriculum/grade1-subjects/activities/social-studies">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activities
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Map className="w-8 h-8 text-white" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">Spatial Thinking</Badge>
                <h1 className="text-4xl font-bold">Neighborhood Map</h1>
              </div>
            </div>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Students create a map of their neighborhood or school, identifying key locations and landmarks to develop
              spatial thinking and understanding of their local environment.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="w-6 h-6 text-emerald-600" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Learning Outcomes</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Understand the purpose and components of maps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Identify and locate important places in their neighborhood or school</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Develop spatial thinking and orientation skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Practice creating and using map symbols and legends</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Curriculum Connections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <h4 className="font-medium text-emerald-800 mb-2">Social Studies</h4>
                      <p className="text-sm text-emerald-700">
                        Spatial thinking, geographic skills, community awareness
                      </p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-medium text-teal-800 mb-2">Mathematics</h4>
                      <p className="text-sm text-teal-700">Spatial relationships, measurement, geometry</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Steps */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  Implementation Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Introduction to Maps</h3>
                      <p className="text-gray-600 mb-3">
                        Begin by discussing what maps are and why people use them. Explain that maps help us find places
                        and understand where things are located in relation to each other.
                      </p>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          <strong>Discussion Questions:</strong> "What is a map?" "When do people use maps?" "What
                          information can we get from a map?"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Explore Map Examples</h3>
                      <p className="text-gray-600 mb-3">
                        Show students various examples of simple maps, including a map of the school, local area, or a
                        simple treasure map. Point out key features like titles, symbols, and compass roses.
                      </p>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          <strong>Map Features:</strong> Title, compass rose (North, South, East, West), legend/key,
                          symbols, and landmarks.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Identify Important Places</h3>
                      <p className="text-gray-600 mb-3">
                        Discuss important features of the neighborhood or school that should be included on their maps.
                        Make a list together of key locations, buildings, and landmarks.
                      </p>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          <strong>Key Places:</strong> School buildings, playground, library, cafeteria, main office,
                          parking areas, nearby streets, parks, or shops.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Create Maps in Pairs</h3>
                      <p className="text-gray-600 mb-3">
                        Have students work in pairs to create their maps on large paper. Encourage them to start with
                        the main features and then add details. Provide guidance on spacing and proportions.
                      </p>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          <strong>Collaboration Tips:</strong> One student can draw while the other suggests locations,
                          then they can switch roles.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Add Map Features</h3>
                      <p className="text-gray-600 mb-3">
                        Encourage students to include essential map features: a title, compass rose showing directions,
                        and a legend with symbols. Use stickers or drawings to mark important landmarks.
                      </p>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          <strong>Symbol Ideas:</strong> Trees for parks, rectangles for buildings, lines for roads,
                          stars for special places.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Share and Compare Maps</h3>
                      <p className="text-gray-600 mb-3">
                        Allow time for pairs to share their maps with the class. Discuss similarities and differences
                        between maps, and talk about how different perspectives can show the same area differently.
                      </p>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          <strong>Discussion Points:</strong> "What did you include that others didn't?" "How are our
                          maps similar?" "What makes a good map?"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Details */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Activity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-gray-600">60 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Group Size</p>
                    <p className="text-sm text-gray-600">Pairs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Difficulty</p>
                    <p className="text-sm text-gray-600">Intermediate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materials Needed */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Materials Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm">Large paper</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm">Markers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm">Rulers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm">Stickers for landmarks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Map Elements Guide */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-emerald-600" />
                  Essential Map Elements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <h4 className="font-medium text-emerald-800 mb-1">Title</h4>
                  <p className="text-sm text-emerald-700">Clear name describing what area the map shows</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <h4 className="font-medium text-teal-800 mb-1">Compass Rose</h4>
                  <p className="text-sm text-teal-700">Shows North, South, East, and West directions</p>
                </div>
                <div className="bg-cyan-50 p-3 rounded-lg">
                  <h4 className="font-medium text-cyan-800 mb-1">Legend/Key</h4>
                  <p className="text-sm text-cyan-700">Explains what symbols and colors represent</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Map Quality Checklist:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                      <span>Includes title and compass rose</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                      <span>Shows important landmarks accurately</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                      <span>Uses symbols and legend effectively</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                      <span>Demonstrates spatial understanding</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <Link to="/curriculum/grade1-subjects/activities/social-studies">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Social Studies Activities
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Download Activity Guide</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
