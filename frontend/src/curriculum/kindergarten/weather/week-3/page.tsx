import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChevronLeft, Cloud, Calendar, Download, Lightbulb, BookOpen, Pencil, Music, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"



export default function WeatherUnitWeek3() {

  return (

    <div className="container mx-auto px-4 py-8">

      <div className="flex items-center gap-2 mb-4">

        <Link to="/curriculum/kindergarten/weather">

          <Button variant="outline" className="mb-2 bg-transparent">

            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Weather Unit

          </Button>

        </Link>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-2">

            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-sm">Week 3</Badge>

            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-sm">Weather Unit</Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-green-700 flex items-center gap-3">

            <Cloud className="h-8 w-8" /> Week 3: Weather and Seasons

          </h1>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg mb-6 border border-green-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-green-700">Weekly Focus</h2>

            <p className="text-lg">

              Children learn about the four seasons and how weather patterns change throughout the year, exploring

              seasonal activities and clothing.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/activities/weather-unit">

              <Button

                variant="outline"

                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

              >

                <BookOpen className="h-4 w-4" /> View Activities

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/weather/week-2">

              <Button

                variant="outline"

                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/weather/week-4">

              <Button

                variant="outline"

                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-green-200 shadow-md overflow-hidden">

          <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-400 relative">

            <div className="absolute inset-0 flex items-center justify-center p-2">

              <img src="/caribbean-weather-shapes.png" alt="Weather shapes and weather patterns" className="w-full h-full object-cover" />

            </div>

          </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-green-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 3</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Monday</Badge>

                  <span>Introduction to Seasons</span>

                </li>

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Tuesday</Badge>

                  <span>Spring Weather & Activities</span>

                </li>

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Wednesday</Badge>

                  <span>Summer Weather & Activities</span>

                </li>

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Thursday</Badge>

                  <span>Fall Weather & Activities</span>

                </li>

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Friday</Badge>

                  <span>Winter Weather & Activities</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="bg-yellow-50 border-yellow-200 mb-8">

        <Lightbulb className="h-4 w-4 text-yellow-600" />

        <AlertTitle className="text-yellow-800">Teacher Tip</AlertTitle>

        <AlertDescription className="text-yellow-700">

          Use seasonal props, clothing, and pictures to help children understand the connection between seasons and weather. 

          Consider creating a seasonal display that changes throughout the year.

        </AlertDescription>

      </Alert>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-green-50">

            <CardTitle className="text-green-700 flex items-center gap-2">

              <BookOpen className="h-5 w-5" /> Learning Objectives

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Identify and describe the four seasons</li>

              <li>Understand how weather changes throughout the year</li>

              <li>Recognize seasonal activities and clothing</li>

              <li>Make connections between seasons and nature</li>

              <li>Develop seasonal vocabulary and concepts</li>

            </ul>

          </CardContent>

        </Card>



        <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-green-50">

            <CardTitle className="text-green-700 flex items-center gap-2">

              <Pencil className="h-5 w-5" /> Key Vocabulary

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-2 mt-2">

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Spring</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Summer</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Fall</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Winter</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Season</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Pattern</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Change</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Cycle</span>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-green-50">

            <CardTitle className="text-green-700 flex items-center gap-2">

              <Music className="h-5 w-5" /> Materials Needed

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Seasonal props and clothing</li>

              <li>Pictures of different seasons</li>

              <li>Seasonal books and stories</li>

              <li>Art supplies for seasonal crafts</li>

              <li>Seasonal music and songs</li>

              <li>Nature items from different seasons</li>

              <li>Chart paper and markers</li>

              <li>Seasonal activity cards</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <Tabs defaultValue="monday" className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

          <Calendar className="mr-2 h-6 w-6" /> Daily Plans

        </h2>

        <TabsList className="grid grid-cols-5 mb-4">

          <TabsTrigger value="monday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">

            Monday

          </TabsTrigger>

          <TabsTrigger value="tuesday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">

            Tuesday

          </TabsTrigger>

          <TabsTrigger value="wednesday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">

            Wednesday

          </TabsTrigger>

          <TabsTrigger value="thursday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">

            Thursday

          </TabsTrigger>

          <TabsTrigger value="friday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">

            Friday

          </TabsTrigger>

        </TabsList>



        <TabsContent value="monday">

          <Card className="border-green-200 shadow-md">

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Monday: Introduction to Seasons</h3>

                <Badge className="bg-white text-green-700">Day 1</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-green-700 text-lg italic">What are the four seasons and how do they change?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"The Seasons of Arnold's Apple Tree" by Gail Gibbons</li>

                    <li>"It's Spring!" by Linda Glaser</li>

                    <li>"The Snowy Day" by Ezra Jack Keats</li>

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

                      Introduce the four seasons by showing large pictures and props representing each season. Ask children to identify seasonal changes and discuss how weather affects our daily lives throughout the year.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Use real objects and pictures to make seasonal concepts concrete for young learners.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-green-800">Literacy Focus</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Read 'The Seasons of Arnold's Apple Tree' and discuss how the tree changes throughout the year. Connect the story to seasonal weather patterns and natural cycles.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Spring:</strong> New leaves

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Summer:</strong> Full growth

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Fall:</strong> Changing colors

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

                      Create a seasons chart and count seasonal items. Sort pictures and objects by season, practice counting from 1-10, and discuss which season has the most/least items.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use seasonal manipulatives to create patterns - spring, summer, fall, winter. Ask children to continue the pattern.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-green-800">Seasons Sorting Game</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Set up four seasonal stations with props and materials. Children rotate through stations to explore each season through hands-on activities and sorting games.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-seasons-spring.png" alt="Spring season activities" className="w-auto h-auto" />

                      <img src="/kindergarten-seasons-sorting.png" alt="Seasonal sorting game" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-green-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share seasonal discoveries and discuss favorite seasons. Ask children which season they like best and why. Begin establishing seasonal observation routines.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What did you learn about seasons today?</li>

                        <li>How does weather change throughout the year?</li>

                        <li>What season do you like best and why?</li>

                      </ul>

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

                <h3 className="text-xl font-bold">Tuesday: Spring Weather & Activities</h3>

                <Badge className="bg-white text-green-700">Day 2</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-green-700 text-lg italic">What happens in spring and what can we do?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"It's Spring!" by Linda Glaser</li>

                    <li>"Mouse's First Spring" by Lauren Thompson</li>

                    <li>"Spring is Here" by Will Hillenbrand</li>

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

                      Discuss spring weather characteristics including rain, warmer temperatures, and new growth. Show pictures of spring changes and ask children to share what they notice about spring.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Take advantage of spring weather for outdoor learning experiences.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-green-800">Literacy Focus</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Read 'It's Spring!' and discuss spring activities and changes. Connect the story to real spring experiences and encourage children to share their spring observations.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Spring:</strong> Rain showers

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Spring:</strong> Flower buds

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Spring:</strong> Baby animals

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-green-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create spring flower paintings using various art supplies. Encourage children to use spring colors and discuss what flowers they see blooming in spring.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use real flowers as inspiration and discuss flower parts and colors.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-green-800">Spring Nature Walk</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Take children outdoors to look for signs of spring. Use observation tools to examine new growth, listen for spring sounds, and collect spring items for classroom display.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-spring-nature-walk.png" alt="Spring nature walk activities" className="w-auto h-auto" />

                      <img src="/kindergarten-spring-flowers.png" alt="Spring flowers and growth" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-green-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share spring discoveries and discuss favorite spring activities. Ask children what they learned about spring and how spring weather affects their daily lives.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What signs of spring did you see today?</li>

                        <li>How does spring weather make you feel?</li>

                        <li>What spring activities do you enjoy most?</li>

                      </ul>

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

                <h3 className="text-xl font-bold">Wednesday: Summer Weather & Activities</h3>

                <Badge className="bg-white text-green-700">Day 3</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-green-700 text-lg italic">What is summer like and what do we do for fun?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Mouse's First Summer" by Lauren Thompson</li>

                    <li>"Summer Days and Nights" by Wong Herbert Yee</li>

                    <li>"The Very Hot Day" by Eileen Spinelli</li>

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

                      Discuss summer weather characteristics including sun, heat, and longer days. Show pictures of summer activities and ask children to share their favorite summer experiences.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Emphasize sun safety and staying hydrated during summer activities.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-green-800">Literacy Focus</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Read 'Mouse's First Summer' and discuss summer adventures and fun. Connect the story to real summer experiences and encourage children to share their summer plans.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Summer:</strong> Beach trips

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Summer:</strong> Ice cream

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Summer:</strong> Swimming

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-green-800">Science Focus</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Learn about sun safety including wearing hats, sunscreen, and staying in the shade. Discuss why the sun is important and how to stay safe during hot weather.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use a thermometer to measure temperature differences in sun and shade.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-green-800">Summer Craft Project</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create summer-themed artwork using various art supplies. Encourage children to use bright summer colors and discuss what makes summer special.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-summer-crafts.png" alt="Summer craft activities" className="w-auto h-auto" />

                      <img src="/kindergarten-summer-activities.png" alt="Summer fun activities" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-green-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share summer artwork and discuss favorite summer activities. Ask children what they learned about summer and how summer weather affects their daily lives.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What makes summer special to you?</li>

                        <li>How do you stay safe in the summer sun?</li>

                        <li>What summer activities do you enjoy most?</li>

                      </ul>

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

                <h3 className="text-xl font-bold">Thursday: Fall Weather & Activities</h3>

                <Badge className="bg-white text-green-700">Day 4</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-green-700 text-lg italic">What happens in fall and what changes do we see?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Leaf Man" by Lois Ehlert</li>

                    <li>"Fall is Not Easy" by Marty Kelley</li>

                    <li>"The Busy Little Squirrel" by Nancy Tafuri</li>

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

                      Discuss fall weather characteristics including cooler temperatures, falling leaves, and shorter days. Show pictures of fall changes and ask children to share what they notice about fall.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Collect a variety of leaves for hands-on learning about fall changes.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-green-800">Literacy Focus</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Read 'Leaf Man' and discuss leaf changes and fall colors. Connect the story to real fall experiences and encourage children to observe leaf changes outdoors.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Fall:</strong> Changing colors

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Fall:</strong> Falling leaves

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Fall:</strong> Cooler weather

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

                      Sort leaves by color, size, and shape. Count different types of leaves and create simple graphs showing leaf characteristics. Practice counting and categorizing skills.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use leaves to create patterns and discuss symmetry in nature.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-green-800">Leaf Art Project</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create artwork using real leaves and art supplies. Encourage children to explore different leaf textures and colors while creating fall-themed artwork.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-fall-leaves.png" alt="Fall leaves and colors" className="w-auto h-auto" />

                      <img src="/kindergarten-leaf-art.png" alt="Leaf art projects" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-green-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share leaf artwork and discuss favorite fall discoveries. Ask children what they learned about fall and how fall weather affects their daily lives.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What changes did you notice in fall today?</li>

                        <li>How does fall weather make you feel?</li>

                        <li>What fall activities do you enjoy most?</li>

                      </ul>

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

                <h3 className="text-xl font-bold">Friday: Winter Weather & Activities</h3>

                <Badge className="bg-white text-green-700">Day 5</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">

                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-green-700 text-lg italic">What is winter like and how do we stay warm?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"The Snowy Day" by Ezra Jack Keats</li>

                    <li>"Winter is Here" by Kevin Henkes</li>

                    <li>"Snow" by Uri Shulevitz</li>

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

                      Discuss winter weather characteristics including cold temperatures, snow, and shorter days. Show pictures of winter activities and ask children to share their favorite winter experiences.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Discuss winter safety and the importance of staying warm and dry.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-green-800">Literacy Focus</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Read 'The Snowy Day' and discuss winter adventures and snow play. Connect the story to real winter experiences and encourage children to share their winter plans.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Winter:</strong> Snow play

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Winter:</strong> Hot chocolate

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Winter:</strong> Warm clothes

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-green-800">Science Focus</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Learn about winter clothing and how to stay warm. Discuss different types of winter clothing and why we need them. Explore how our bodies stay warm in cold weather.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use a thermometer to measure temperature differences indoors and outdoors.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-green-800">Winter Craft Project</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create winter-themed artwork using various art supplies. Encourage children to use winter colors and discuss what makes winter special and beautiful.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-winter-crafts.png" alt="Winter craft activities" className="w-auto h-auto" />

                      <img src="/kindergarten-winter-activities.png" alt="Winter fun activities" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-green-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share winter artwork and discuss favorite winter activities. Ask children what they learned about winter and how winter weather affects their daily lives.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What makes winter special to you?</li>

                        <li>How do you stay warm in winter?</li>

                        <li>What winter activities do you enjoy most?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

          <BookOpen className="mr-2 h-6 w-6" /> Additional Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <Card className="border-green-200 hover:shadow-lg transition-shadow">

            <CardContent className="p-4">

              <h3 className="font-semibold text-green-800 mb-2">Seasonal Songs</h3>

              <p className="text-sm text-gray-600 mb-3">Music and movement activities for each season</p>

              <Button variant="outline" size="sm" className="w-full" asChild>

                <Link to="/curriculum/kindergarten/activities/weather-unit">View Resources</Link>

              </Button>

            </CardContent>

          </Card>

          

          <Card className="border-green-200 hover:shadow-lg transition-shadow">

            <CardContent className="p-4">

              <h3 className="font-semibold text-green-800 mb-2">Seasonal Crafts</h3>

              <p className="text-sm text-gray-600 mb-3">Art projects that represent each season</p>

              <Button variant="outline" size="sm" className="w-full" asChild>

                <Link to="/curriculum/kindergarten/activities/weather-unit">Explore Activities</Link>

              </Button>

            </CardContent>

          </Card>

          

          <Card className="border-green-200 hover:shadow-lg transition-shadow">

            <CardContent className="p-4">

              <h3 className="font-semibold text-green-800 mb-2">Nature Connections</h3>

              <p className="text-sm text-gray-600 mb-3">Outdoor activities for seasonal learning</p>

              <Button variant="outline" size="sm" className="w-full" asChild>

                <Link to="/curriculum/kindergarten/activities/weather-unit">Learn More</Link>

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

          <Users className="mr-2 h-6 w-6" /> Unit Reflection

        </h2>

        <Card className="border-green-200 shadow-md">

          <CardContent className="p-6">

            <p className="text-gray-700 mb-4">

              As we complete our exploration of weather and seasons, take time to reflect on how your students have 

              developed their understanding of seasonal changes and weather patterns.

            </p>

            <ul className="space-y-2 text-gray-700 mb-4">

              <li>• How have students demonstrated understanding of seasonal changes?</li>

              <li>• What seasonal activities were most engaging for the class?</li>

              <li>• How can we continue to reinforce seasonal concepts throughout the year?</li>

              <li>• What connections have students made between weather and seasons?</li>

            </ul>

            <p className="text-gray-700">

              Continue to point out seasonal changes and weather patterns in daily classroom discussions and activities.

            </p>

          </CardContent>

        </Card>

      </div>



      {/* Footer Navigation */}

      <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 pt-8 border-t border-gray-200">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/weather">Back to Weather Unit</Link>

        </Button>

        <Link to="/curriculum/kindergarten/activities/weather-unit">

          <Button className="bg-green-600 hover:bg-green-700">

            <BookOpen className="mr-2 h-4 w-4" /> View All Activities

          </Button>

        </Link>

        <Link to="/curriculum/kindergarten/weather/week-4">

          <Button variant="outline">

            Next Week <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />

          </Button>

        </Link>

      </div>

    </div>

  )

}
