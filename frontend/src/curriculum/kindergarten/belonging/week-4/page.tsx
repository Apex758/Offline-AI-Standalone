import React from "react"

import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

import { ChevronLeft, Download, Calendar, BookOpen, Lightbulb, Pencil, Music, Building, Users } from "lucide-react"



export default function BelongingUnitWeek4() {

  return (

    <div className="container mx-auto px-4 py-8">

      <div className="flex items-center gap-2 mb-4">

        <Link to="/curriculum/kindergarten/belonging">

          <Button variant="outline" className="mb-2 bg-transparent">

            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Belonging Unit

          </Button>

        </Link>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-2">

            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 px-3 py-1 text-sm">Week 4</Badge>

            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 px-3 py-1 text-sm">

              Belonging Unit

            </Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-teal-700 flex items-center gap-3">

            <Building className="h-8 w-8" /> Week 4: My Community

          </h1>

          <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-lg mb-6 border border-teal-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-teal-700">Weekly Focus</h2>

            <p className="text-lg">

              Children learn about their local community, community helpers, places in the community, and how people in

              a community work together.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-teal-300 text-teal-700 hover:bg-teal-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-teal-300 text-teal-700 hover:bg-teal-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-teal-300 text-teal-700 hover:bg-teal-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/belonging/week-3">

              <Button

                variant="outline"

                className="border-teal-300 text-teal-700 hover:bg-teal-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/belonging/week-5">

              <Button

                variant="outline"

                className="border-teal-300 text-teal-700 hover:bg-teal-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-teal-200 shadow-md overflow-hidden">

          <div className="h-48 bg-gradient-to-r from-teal-400 to-cyan-400 relative">

            <div className="absolute inset-0 flex items-center justify-center p-2">

              <img src="./kindergarten-community.png" alt="Children’s crayon drawings with the word “COMMUNITY,” showing police, doctor, firefighter, store, houses, and kids holding hands, highlighting helpers, places, and working together." className="w-full h-full object-cover" />

            </div>

          </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-teal-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 4</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-teal-800">

                  <Badge className="bg-teal-100 text-teal-800">Monday</Badge>

                  <span>What Is a Community?</span>

                </li>

                <li className="flex items-center gap-2 text-teal-800">

                  <Badge className="bg-teal-100 text-teal-800">Tuesday</Badge>

                  <span>Places in My Community</span>

                </li>

                <li className="flex items-center gap-2 text-teal-800">

                  <Badge className="bg-teal-100 text-teal-800">Wednesday</Badge>

                  <span>Community Helpers</span>

                </li>

                <li className="flex items-center gap-2 text-teal-800">

                  <Badge className="bg-teal-100 text-teal-800">Thursday</Badge>

                  <span>How Communities Work</span>

                </li>

                <li className="flex items-center gap-2 text-teal-800">

                  <Badge className="bg-teal-100 text-teal-800">Friday</Badge>

                  <span>Community Celebration</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="bg-teal-50 border-teal-200 mb-8">

        <Lightbulb className="h-4 w-4 text-teal-600" />

        <AlertTitle className="text-teal-700">Teacher Tip</AlertTitle>

        <AlertDescription className="text-teal-700">

          Before beginning this week, contact local community helpers (firefighters, police officers, librarians, etc.)

          to arrange visits or video calls. Create a community map with your students and gather photos of local

          landmarks and places.

        </AlertDescription>

      </Alert>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className="border-teal-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-teal-50">

            <CardTitle className="text-teal-700 flex items-center gap-2">

              <BookOpen className="h-5 w-5" /> Learning Objectives

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Identify important places in their community</li>

              <li>Recognize community helpers and their roles</li>

              <li>Understand how communities work together</li>

              <li>Develop map reading and location skills</li>

              <li>Practice cooperation and teamwork</li>

              <li>Develop vocabulary related to community</li>

            </ul>

          </CardContent>

        </Card>



        <Card className="border-teal-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-teal-50">

            <CardTitle className="text-teal-700 flex items-center gap-2">

              <Pencil className="h-5 w-5" /> Key Vocabulary

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-2 mt-2">

              <div className="bg-white p-2 rounded border border-teal-100">

                <span className="font-medium text-teal-700">Community</span>

              </div>

              <div className="bg-white p-2 rounded border border-teal-100">

                <span className="font-medium text-teal-700">Neighborhood</span>

              </div>

              <div className="bg-white p-2 rounded border border-teal-100">

                <span className="font-medium text-teal-700">Helper</span>

              </div>

              <div className="bg-white p-2 rounded border border-teal-100">

                <span className="font-medium text-teal-700">Service</span>

              </div>

              <div className="bg-white p-2 rounded border border-teal-100">

                <span className="font-medium text-teal-700">Map</span>

              </div>

              <div className="bg-white p-2 rounded border border-teal-100">

                <span className="font-medium text-teal-700">Location</span>

              </div>

              <div className="bg-white p-2 rounded border border-teal-100">

                <span className="font-medium text-teal-700">Job</span>

              </div>

              <div className="bg-white p-2 rounded border border-teal-100">

                <span className="font-medium text-teal-700">Cooperation</span>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="border-teal-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-teal-50">

            <CardTitle className="text-teal-700 flex items-center gap-2">

              <Music className="h-5 w-5" /> Materials Needed

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Community maps and atlases</li>

              <li>Photos of local landmarks and places</li>

              <li>Community helper costumes and props</li>

              <li>Art supplies for community crafts</li>

              <li>Books about communities and helpers</li>

              <li>Building blocks for community models</li>

              <li>Chart paper and markers</li>

              <li>Materials for community dioramas</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-teal-700 flex items-center">

          <Calendar className="mr-2 h-6 w-6" /> Daily Plans

        </h2>

        <Tabs defaultValue="monday" className="w-full">

          <TabsList className="grid grid-cols-5 mb-4">

            <TabsTrigger value="monday">Monday</TabsTrigger>

            <TabsTrigger value="tuesday">Tuesday</TabsTrigger>

            <TabsTrigger value="wednesday">Wednesday</TabsTrigger>

            <TabsTrigger value="thursday">Thursday</TabsTrigger>

            <TabsTrigger value="friday">Friday</TabsTrigger>

          </TabsList>



          <TabsContent value="monday">

            <Card className="border-teal-200 shadow-md">

              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-t-lg">

                <div className="flex justify-between items-center">

                  <h3 className="text-xl font-bold">Monday: What Is a Community?</h3>

                  <Badge className="bg-white text-teal-700">Day 1</Badge>

                </div>

              </div>

              <CardContent className="pt-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">

                    <h4 className="font-semibold text-teal-800 mb-2 flex items-center gap-2">

                      <Users className="h-4 w-4" /> Focus Question

                    </h4>

                    <p className="text-teal-700 text-lg italic">What makes a community special?</p>

                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                      <BookOpen className="h-4 w-4" /> Suggested Books

                    </h4>

                    <ul className="text-blue-700 space-y-1">

                      <li>"The Little House" by Virginia Lee Burton</li>

                      <li>"Community Helpers" by Various Authors</li>

                      <li>"My Neighborhood" by Lisa Bullard</li>

                    </ul>

                  </div>

                </div>



                <div className="space-y-6">

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-teal-100 text-teal-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        1

                      </div>

                      <h4 className="font-semibold text-teal-800">Morning Circle</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Introduce the theme "My Community." Discuss what a community is and how it's different from a

                        neighborhood. Show pictures of different types of communities.

                      </p>

                      <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                        <p className="text-sm text-yellow-800">

                          <strong>Teacher Tip:</strong> Use a simple definition: "A community is a group of people who

                          live, work, and play together in the same area."

                        </p>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        2

                      </div>

                      <h4 className="font-semibold text-green-800">Literacy Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Read "The Little House" by Virginia Lee Burton. Focus on how the house becomes part of a

                        community and how communities change over time.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> The Little House book

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Chart paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Markers

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Community photos

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        3

                      </div>

                      <h4 className="font-semibold text-green-800">Math Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Count objects in our classroom community. Use small toys or objects to represent different

                        parts of a community (houses, cars, people, etc.).

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Small toys

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Counting mats

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Number cards

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Sorting trays

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        4

                      </div>

                      <h4 className="font-semibold text-green-800">Afternoon Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Begin creating a classroom community mural. Students will draw or paint pictures of community

                        places and people they know.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Large paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Paint

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Brushes

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Markers

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          </TabsContent>



          <TabsContent value="tuesday">

            <Card className="border-green-200 shadow-md">

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">

                <div className="flex justify-between items-center">

                  <h3 className="text-xl font-bold">Tuesday: Community Places</h3>

                  <Badge className="bg-white text-teal-700">Day 2</Badge>

                </div>

              </div>

              <CardContent className="pt-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                      <Users className="h-4 w-4" /> Focus Question

                    </h4>

                    <p className="text-green-700 text-lg italic">What places are important in our community?</p>

                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                      <BookOpen className="h-4 w-4" /> Suggested Books

                    </h4>

                    <ul className="text-blue-700 space-y-1">

                      <li>"Mapping Penny's World" by Loreen Leedy</li>

                      <li>"My Map Book" by Sara Fanelli</li>

                      <li>"There's a Map on My Lap!" by Tish Rabe</li>

                    </ul>

                  </div>

                </div>



                <div className="space-y-6">

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        1

                      </div>

                      <h4 className="font-semibold text-green-800">Morning Circle</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Focus on important places in the community. Discuss what makes a place important (e.g., grocery

                        store, park, library, school, hospital). Show pictures of different community places.

                      </p>

                      <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                        <p className="text-sm text-yellow-800">

                          <strong>Teacher Tip:</strong> Ask children to think about places they visit with their

                          families and why those places are important.

                        </p>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        2

                      </div>

                      <h4 className="font-semibold text-green-800">Literacy Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Read "Mapping Penny's World" by Loreen Leedy. Focus on how maps help us understand community

                        places and how to read simple maps.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Mapping Penny's World book

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Simple community map

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Chart paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Markers

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        3

                      </div>

                      <h4 className="font-semibold text-green-800">Math Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Introduce a simple map of the community. Students will draw or color a basic map of their

                        neighborhood, counting and identifying different places.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Crayons

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Community photos

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Stickers

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        4

                      </div>

                      <h4 className="font-semibold text-green-800">Afternoon Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Create a class book about community places. Students will write or draw descriptions of their

                        favorite places in the community.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Book pages

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Drawing supplies

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Stickers

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Binding materials

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          </TabsContent>



          <TabsContent value="wednesday">

            <Card className="border-green-200 shadow-md">

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">

                <div className="flex justify-between items-center">

                  <h3 className="text-xl font-bold">Wednesday: Community Helpers</h3>

                  <Badge className="bg-white text-green-700">Day 3</Badge>

                </div>

              </div>

              <CardContent className="pt-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                      <Users className="h-4 w-4" /> Focus Question

                    </h4>

                    <p className="text-green-700 text-lg italic">How do community helpers help us?</p>

                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                      <BookOpen className="h-4 w-4" /> Suggested Books

                    </h4>

                    <ul className="text-blue-700 space-y-1">

                      <li>"Whose Hands Are These?" by Miranda Paul</li>

                      <li>"Helpers in My Community" by Bobbie Kalman</li>

                      <li>"When I Grow Up" by Al Yankovic</li>

                    </ul>

                  </div>

                </div>



                <div className="space-y-6">

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        1

                      </div>

                      <h4 className="font-semibold text-green-800">Morning Circle</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Focus on community helpers. Discuss what a helper is and what they do. Show pictures of

                        different community helpers (firefighters, police officers, doctors, teachers, etc.).

                      </p>

                      <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                        <p className="text-sm text-yellow-800">

                          <strong>Teacher Tip:</strong> Ask children to share experiences they've had with community

                          helpers and what they remember about those interactions.

                        </p>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        2

                      </div>

                      <h4 className="font-semibold text-green-800">Literacy Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Read "Whose Hands Are These?" by Miranda Paul. Focus on how helpers help the community and

                        what tools they use in their work.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Whose Hands Are These? book

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Helper tool pictures

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Chart paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Markers

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        3

                      </div>

                      <h4 className="font-semibold text-green-800">Math Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Graph our favorite community helpers. Students will draw a bar graph or simple chart of

                        helpers they know and count how many children like each type of helper.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Chart paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Helper pictures

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Stickers

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Markers

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        4

                      </div>

                      <h4 className="font-semibold text-green-800">Afternoon Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Special visitor: Community helper. Invite a local helper to visit the classroom. Students

                        will ask questions and create thank you cards afterward.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Thank you cards

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Art supplies

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Question list

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Camera

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          </TabsContent>



          <TabsContent value="thursday">

            <Card className="border-green-200 shadow-md">

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">

                <div className="flex justify-between items-center">

                  <h3 className="text-xl font-bold">Thursday: Working Together in a Community</h3>

                  <Badge className="bg-white text-green-700">Day 4</Badge>

                </div>

              </div>

              <CardContent className="pt-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                      <Users className="h-4 w-4" /> Focus Question

                    </h4>

                    <p className="text-green-700 text-lg italic">How do we work together in our community?</p>

                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                      <BookOpen className="h-4 w-4" /> Suggested Books

                    </h4>

                    <ul className="text-blue-700 space-y-1">

                      <li>"Maybe Something Beautiful" by F. Isabel Campoy</li>

                      <li>"The Big Orange Splot" by Daniel Pinkwater</li>

                      <li>"The Gardener" by Sarah Stewart</li>

                    </ul>

                  </div>

                </div>



                <div className="space-y-6">

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        1

                      </div>

                      <h4 className="font-semibold text-green-800">Morning Circle</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Discuss how people in a community work together. Talk about cooperation and teamwork. Share

                        examples of how people help each other in communities.

                      </p>

                      <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                        <p className="text-sm text-yellow-800">

                          <strong>Teacher Tip:</strong> Use concrete examples from your school community to help

                          children understand cooperation.

                        </p>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        2

                      </div>

                      <h4 className="font-semibold text-green-800">Literacy Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Read "Maybe Something Beautiful" by F. Isabel Campoy. Focus on how community members help

                        each other and work together to make their neighborhood beautiful.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Maybe Something Beautiful book

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Community photos

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Chart paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Markers

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        3

                      </div>

                      <h4 className="font-semibold text-green-800">Math Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Patterns in community buildings and structures. Students will draw or color patterns found

                        in their community (brick patterns, window arrangements, etc.).

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Pattern blocks

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Building photos

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Crayons

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        4

                      </div>

                      <h4 className="font-semibold text-green-800">Afternoon Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Complete the community mural as a collaborative project. Students will work together to

                        create a large mural of their community, practicing cooperation and teamwork.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Large mural paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Paint

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Brushes

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Community photos

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          </TabsContent>



          <TabsContent value="friday">

            <Card className="border-green-200 shadow-md">

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">

                <div className="flex justify-between items-center">

                  <h3 className="text-xl font-bold">Friday: Being a Good Community Member</h3>

                  <Badge className="bg-white text-green-700">Day 5</Badge>

                </div>

              </div>

              <CardContent className="pt-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                      <Users className="h-4 w-4" /> Focus Question

                    </h4>

                    <p className="text-green-700 text-lg italic">What makes a good community member?</p>

                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                      <BookOpen className="h-4 w-4" /> Suggested Books

                    </h4>

                    <ul className="text-blue-700 space-y-1">

                      <li>"The Curious Garden" by Peter Brown</li>

                      <li>"Miss Rumphius" by Barbara Cooney</li>

                      <li>"The Lorax" by Dr. Seuss</li>

                    </ul>

                  </div>

                </div>



                <div className="space-y-6">

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        1

                      </div>

                      <h4 className="font-semibold text-green-800">Morning Circle</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        What makes a good community member? Discuss what it means to be a good citizen and how we

                        can help our community. Share examples of good citizenship.

                      </p>

                      <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                        <p className="text-sm text-yellow-800">

                          <strong>Teacher Tip:</strong> Use examples from your classroom to help children understand

                          what it means to be a good community member.

                        </p>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        2

                      </div>

                      <h4 className="font-semibold text-green-800">Literacy Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Read "The Curious Garden" by Peter Brown. Focus on how community members help each other

                        and how one person can make a difference in their community.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> The Curious Garden book

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Garden photos

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Chart paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Markers

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        3

                      </div>

                      <h4 className="font-semibold text-green-800">Math Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Count and sort ways to help in the community. Students will create a list of ways they

                        can help their community and count how many ideas they generate.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Chart paper

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Stickers

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Markers

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Counting manipulatives

                        </div>

                      </div>

                    </div>

                  </div>



                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center gap-2 mb-2">

                      <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                        4

                      </div>

                      <h4 className="font-semibold text-green-800">Afternoon Activity</h4>

                    </div>

                    <div className="pl-10">

                      <p>

                        Simple classroom or school service project. Students will participate in a small,

                        manageable service project like cleaning up the playground or organizing classroom materials.

                      </p>

                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Cleaning supplies

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Gloves

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Bags

                        </div>

                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                          <strong>Material:</strong> Camera

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Building className="h-5 w-5" /> Community Scavenger Hunt

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="mb-4">

                Students work in small groups to find important places and people in the community using a picture

                checklist.

              </p>

              <p className="mb-4">

                Materials: Picture checklists, Clipboards, Pencils, Community map.

              </p>

              <p className="mb-4">

                Learning Areas: Social Studies, Language Arts.

              </p>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Music className="h-5 w-5" /> Community Helper Dress-Up

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="mb-4">

                Students explore different community helper roles through dramatic play with costumes and props.

              </p>

              <p className="mb-4">

                Materials: Community helper costumes, Role-specific props, Job description cards.

              </p>

              <p className="mb-4">

                Learning Areas: Social-Emotional, Drama.

              </p>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Building className="h-5 w-5" /> Build a Community

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="mb-4">

                Using blocks and recycled materials, students create a model community with various buildings and

                services.

              </p>

              <p className="mb-4">

                Materials: Blocks, Recycled materials, Small figures, Toy vehicles.

              </p>

              <p className="mb-4">

                Learning Areas: Engineering, Social Studies.

              </p>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Lightbulb className="h-5 w-5" /> Thank You Cards for Helpers

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="mb-4">

                Students create thank you cards for community helpers who provide important services.

              </p>

              <p className="mb-4">

                Materials: Construction paper, Markers, Stickers, Photos of helpers.

              </p>

              <p className="mb-4">

                Learning Areas: Art, Social-Emotional.

              </p>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="bg-blue-50 border-blue-200 mb-8">

        <Lightbulb className="h-4 w-4 text-blue-600" />

        <AlertTitle className="text-blue-700">Teacher Tip</AlertTitle>

        <AlertDescription className="text-blue-700">

          If you can't take students on a community walk, create a virtual tour using photos of local community

          places and helpers. Display these on a digital slideshow or create a classroom display.

        </AlertDescription>

      </Alert>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700">Books</CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="list-disc pl-5 space-y-1 mt-2">

                <li>"The Little House" by Virginia Lee Burton</li>

                <li>"Mapping Penny's World" by Loreen Leedy</li>

                <li>"Whose Hands Are These?" by Miranda Paul</li>

                <li>"Maybe Something Beautiful" by F. Isabel Campoy</li>

                <li>"The Curious Garden" by Peter Brown</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-green-500 text-green-700 hover:bg-green-50">

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700">Printables</CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="list-disc pl-5 space-y-1 mt-2">

                <li>Community scavenger hunt checklist</li>

                <li>Community helper matching cards</li>

                <li>Simple community map template</li>

                <li>Community helper interview sheets</li>

                <li>Thank you card templates</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-green-500 text-green-700 hover:bg-green-50">

                <Download className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="mb-4">

                Send home a family activity sheet that encourages parents/caregivers to take a walk or drive around the

                community and point out important places and helpers.

              </p>

              <Button variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-50">

                <Download className="mr-2 h-4 w-4" /> Family Activity

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>

  )

}
