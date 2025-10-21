import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChevronLeft, Cloud, Calendar, Download, Lightbulb, BookOpen, Pencil, Music, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"



export default function WeatherUnitWeek2() {

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

            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1 text-sm">Week 2</Badge>

            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1 text-sm">Weather Unit</Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-blue-700 flex items-center gap-3">

            <Cloud className="h-8 w-8" /> Week 2: What Different Kinds of Weather Do We Have?

          </h1>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-6 border border-blue-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-blue-700">Weekly Focus</h2>

            <p className="text-lg">

              Children explore different types of weather and seasonal patterns through observation, hands-on

              activities, and creative expression. They learn about wet and dry seasons and create weather patterns.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/activities/weather-unit">

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

              >

                <BookOpen className="h-4 w-4" /> View Activities

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/weather/week-1">

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/weather/week-3">

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-blue-200 shadow-md overflow-hidden">

            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-500 relative">

              <div className="absolute inset-0 flex items-center justify-center p-2">

                <img src="./kindergarten-children-observing-different-types-of.png" alt="Children exploring different types of weather" className="w-full h-full object-cover" />

              </div>

            </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-blue-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 2</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Monday</Badge>

                  <span>Read Aloud & Weather Types</span>

                </li>

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Tuesday</Badge>

                  <span>Weather Chart & Data Collection</span>

                </li>

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Wednesday</Badge>

                  <span>Video & Nature Walk</span>

                </li>

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Thursday</Badge>

                  <span>Itsy Bitsy Spider & Crafts</span>

                </li>

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Friday</Badge>

                  <span>Seasons & Weather Patterns</span>

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

          Create a class weather chart that will be used throughout the week. Each day, have a different student be the

          "weather reporter" to observe and record the day's weather. This builds routine, observation skills, and gives

          every child a special role in the learning process.

        </AlertDescription>

      </Alert>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-cyan-50">

            <CardTitle className="text-cyan-700 flex items-center gap-2">

              <BookOpen className="h-5 w-5" /> Learning Objectives

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Identify and describe different weather types (sunny, rainy, cloudy, windy, stormy)</li>

              <li>Understand seasonal patterns in their region (wet season, dry season)</li>

              <li>Collect and interpret weather data using charts and graphs</li>

              <li>Create simple repeating patterns using weather symbols</li>

              <li>Express weather concepts through art, movement, and creative activities</li>

              <li>Develop weather vocabulary and descriptive language</li>

            </ul>

          </CardContent>

        </Card>



        <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-cyan-50">

            <CardTitle className="text-cyan-700 flex items-center gap-2">

              <Pencil className="h-5 w-5" /> Key Vocabulary

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-2 mt-2">

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Sunny</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Rainy</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Cloudy</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Windy</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Stormy</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Seasons</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Wet Season</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Dry Season</span>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-cyan-50">

            <CardTitle className="text-cyan-700 flex items-center gap-2">

              <Music className="h-5 w-5" /> Materials Needed

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Weather chart and symbol cards</li>

              <li>"What Will the Weather Be Like Today?" book/video</li>

              <li>Art supplies for weather crafts and paintings</li>

              <li>Musical instruments for weather sounds</li>

              <li>Weather wheel craft materials</li>

              <li>Rain stick materials (paper towel rolls, foil, rice)</li>

              <li>Pattern cards with weather symbols</li>

              <li>Weather-appropriate clothing for fashion show</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <Tabs defaultValue="monday" className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-cyan-700 flex items-center">

          <Calendar className="mr-2 h-6 w-6" /> Daily Plans

        </h2>

        <TabsList className="grid grid-cols-5 mb-4">

          <TabsTrigger value="monday" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-800">

            Monday

          </TabsTrigger>

          <TabsTrigger value="tuesday" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-800">

            Tuesday

          </TabsTrigger>

          <TabsTrigger value="wednesday" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-800">

            Wednesday

          </TabsTrigger>

          <TabsTrigger value="thursday" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-800">

            Thursday

          </TabsTrigger>

          <TabsTrigger value="friday" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-800">

            Friday

          </TabsTrigger>

        </TabsList>



        <TabsContent value="monday">

          <Card className="border-cyan-200 shadow-md">

            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Monday: Introduction to Weather Types</h3>

                <Badge className="bg-white text-cyan-700">Day 1</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">

                    What different kinds of weather do we have? What seasons do we have?

                  </p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"What Will the Weather Be Like Today?" by Paul Rogers</li>

                    <li>"Weather Words and What They Mean" by Gail Gibbons</li>

                    <li>"All About Weather" by Martha Brockenbrough</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-cyan-800">Read Aloud Introduction</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Begin with the weekly question and invite children to share their favorite types of weather. Show

                      the book cover and ask children to predict what the story will be about based on title and

                      illustrations. Review key weather vocabulary words through matching activities.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Pause during reading to point out illustrations and ask

                        comprehension questions about weather types and seasonal changes.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Interactive Story Reading</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Read "What Will the Weather Be Like Today?" with interactive elements. When reading about sunny

                      weather, have children stand and do sunshine dances. For rainy weather, make rain sounds with

                      bodies. For windy weather, pretend to blow things away or act like items being blown.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Sunshine dance

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Rain sounds

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Wind movements

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Cloud formations

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Discussion & Sharing</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      After the story, ask children to name different types of weather from the story and express their

                      feelings about each type. Have children draw their favorite part of the story and share what they

                      learned. Go outside to describe today's weather based on story information.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Create a class chart of different weather types mentioned in the

                        story and add children's own weather experiences.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children draw and share their favorite weather type from the story. Encourage them to include

                      details about what people wear, what activities they do, and how the environment looks in that

                      weather.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="./kindergarten-weather-types.png" alt="Different weather types illustration" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-cyan-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share weather drawings and discuss the variety of weather types. Begin establishing the weekly

                      weather observation routine and introduce the concept of weather patterns.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What new weather words did you learn today?</li>

                        <li>Which weather type from the story was most interesting?</li>

                        <li>How does weather change throughout the year?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="tuesday">

        <Card className="border-cyan-200 shadow-md">

          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-t-lg">

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">Tuesday: Weather Chart & Data Collection</h3>

              <Badge className="bg-white text-cyan-700">Day 2</Badge>

            </div>

          </div>

          <CardContent className="pt-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                  <Users className="h-4 w-4" /> Focus Activity

                </h4>

                <p className="text-cyan-700 text-lg italic">

                  Creating and maintaining a class weather chart for daily observation and data collection

                </p>

              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                  <BookOpen className="h-4 w-4" /> Key Skills

                </h4>

                <ul className="text-blue-700 space-y-1 text-sm">

                  <li>• Daily weather observation</li>

                  <li>• Data recording and interpretation</li>

                  <li>• Pattern recognition</li>

                  <li>• Days of the week practice</li>

                </ul>

              </div>

            </div>



            <div className="space-y-6">

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    1

                  </div>

                  <h4 className="font-semibold text-cyan-800">Create Class Weather Chart</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Work with children to create a simple weather chart for the classroom. Include days of the week and

                    weather symbols. Assign different children as daily "weather reporters" to observe and record

                    weather using symbols and simple descriptions.

                  </p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                    <p className="text-sm text-yellow-800">

                      <strong>Teacher Tip:</strong> Create a sentence strip with "Today it is _____" for children to

                      complete with weather words.

                    </p>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    2

                  </div>

                  <h4 className="font-semibold text-cyan-800">Daily Weather Reporter Role</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Each day, a different child becomes the "weather reporter" and places the appropriate weather symbol

                    on the chart based on outdoor observations. They also complete the sentence describing the weather.

                  </p>

                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Monday:</strong> Sunny reporter

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Tuesday:</strong> Rainy reporter

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Wednesday:</strong> Cloudy reporter

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Thursday:</strong> Windy reporter

                    </div>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    3

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weekly Weather Analysis</h4>

                </div>

                <div className="pl-10">

                  <p>

                    At the end of each week, discuss the weather chart with children. Ask questions about patterns,

                    count different weather types, and compare days. This builds data analysis and mathematical thinking

                    skills.

                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                    <p className="text-sm text-blue-800">

                      <strong>Discussion Questions:</strong>

                    </p>

                    <ul className="text-sm text-blue-800 list-disc pl-5 mt-1">

                      <li>Which weather did we have most this week?</li>

                      <li>How many sunny/rainy days did we have?</li>

                      <li>Did we have any days with multiple weather types?</li>

                    </ul>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    4

                  </div>

                  <h4 className="font-semibold text-cyan-800">Pattern Recognition Activity</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Help children identify weather patterns over time. Look for sequences like three sunny days in a

                    row, or alternating patterns. This connects to both science and mathematics learning objectives.

                  </p>

                  <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                    <p className="text-sm text-purple-800">

                      <strong>Extension:</strong> Create simple weather patterns using symbol cards and have children

                      extend the patterns.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </TabsContent>



      <TabsContent value="wednesday">

        <Card className="border-cyan-200 shadow-md">

          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-t-lg">

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">Wednesday: Video Exploration & Nature Walk</h3>

              <Badge className="bg-white text-cyan-700">Day 3</Badge>

            </div>

          </div>

          <CardContent className="pt-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                  <Users className="h-4 w-4" /> Focus Activity

                </h4>

                <p className="text-cyan-700 text-lg italic">

                  Exploring weather through multimedia and direct outdoor observation

                </p>

              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                  <BookOpen className="h-4 w-4" /> Featured Video

                </h4>

                <p className="text-blue-700">

                  "All About the Weather" - Educational video exploring different weather conditions and their

                  characteristics

                </p>

              </div>

            </div>



            <div className="space-y-6">

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    1

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather Video Discussion</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Watch "All About the Weather" video and discuss different weather conditions shown. Ask children

                    about their favorite weather type and why, encouraging descriptive language and personal

                    connections.

                  </p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                    <p className="text-sm text-yellow-800">

                      <strong>Discussion Starter:</strong> "What's your favorite type of weather? Why is that your

                      favorite?"

                    </p>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    2

                  </div>

                  <h4 className="font-semibold text-cyan-800">Nature Walk Observation</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Take children on a nature walk to observe current weather conditions. Encourage them to use all

                    their senses - what they see, hear, feel, and smell. Count clouds, puddles, and other

                    weather-related features.

                  </p>

                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>See:</strong> Clouds, sun, rain

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Feel:</strong> Wind, temperature

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Hear:</strong> Wind, rain sounds

                    </div>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    3

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather "I Spy" Game</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Play "I Spy" focusing on weather-related observations. Teacher starts with examples like "I spy

                    something fluffy and white" (clouds). Children take turns giving clues about weather features they

                    observe.

                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                    <p className="text-sm text-blue-800">

                      <strong>Game Examples:</strong>

                    </p>

                    <ul className="text-sm text-blue-800 list-disc pl-5 mt-1">

                      <li>"I spy something bright and yellow" (sun)</li>

                      <li>"I spy something that makes the trees move" (wind)</li>

                      <li>"I spy something wet on the ground" (puddles)</li>

                    </ul>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    4

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather Drawing Activity</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Children draw the current weather they observed during the nature walk. Encourage them to include

                    details about what people might wear, activities they could do, and how the environment looks in

                    this weather.

                  </p>

                  <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                    <p className="text-sm text-purple-800">

                      <strong>Art Extension:</strong> Compare drawings with the video content and discuss similarities

                      and differences between weather shown in the video and current local conditions.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </TabsContent>



      <TabsContent value="thursday">

        <Card className="border-cyan-200 shadow-md">

          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-t-lg">

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">Thursday: Itsy Bitsy Spider & Weather Crafts</h3>

              <Badge className="bg-white text-cyan-700">Day 4</Badge>

            </div>

          </div>

          <CardContent className="pt-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                  <Users className="h-4 w-4" /> Focus Activity

                </h4>

                <p className="text-cyan-700 text-lg italic">

                  Shared reading and weather-themed craft activities connecting literature to weather concepts

                </p>

              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                  <BookOpen className="h-4 w-4" /> Featured Song

                </h4>

                <p className="text-blue-700">

                  "The Itsy-Bitsy Spider" - Traditional song exploring how weather affects living creatures

                </p>

              </div>

            </div>



            <div className="space-y-6">

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    1

                  </div>

                  <h4 className="font-semibold text-cyan-800">Shared Reading: Itsy-Bitsy Spider</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Present the rhyme with pictures on a large chart. Read the title and ask if children have heard it

                    before. Sing the rhyme together and discuss what happens line by line, focusing on weather elements

                    in the story.

                  </p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                    <p className="text-sm text-yellow-800">

                      <strong>Reading Strategies:</strong> Use choral reading and echo reading to build fluency and

                      engagement.

                    </p>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    2

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather Impact Discussion</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Discuss how weather affected the spider in the song. Ask children about the spider's feelings during

                    rain versus sunshine. Connect to how weather affects people, animals, and plants in their own

                    experiences.

                  </p>

                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Rain Effect:</strong> Washed spider down

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Sun Effect:</strong> Dried up rain, spider climbed again

                    </div>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    3

                  </div>

                  <h4 className="font-semibold text-cyan-800">Rain Stick Craft</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Create rain sticks using paper towel rolls, aluminum foil, and rice/corn kernels. Explain how some

                    cultures use rain sticks in ceremonies to call for rain, connecting craft to cultural weather

                    practices.

                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                    <p className="text-sm text-blue-800">

                      <strong>Materials Needed:</strong>

                    </p>

                    <ul className="text-sm text-blue-800 list-disc pl-5 mt-1">

                      <li>Paper towel rolls</li>

                      <li>Aluminum foil</li>

                      <li>Rice, corn kernels, small noodles</li>

                      <li>Duct tape</li>

                      <li>Decorating materials</li>

                    </ul>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    4

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather Wheel Creation</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Using paper plates, children create weather wheels showing four weather types (sunny, rainy, cloudy,

                    windy) with an arrow to point to current weather. Use throughout the day to track weather changes.

                  </p>

                  <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                    <p className="text-sm text-purple-800">

                      <strong>Extension Activity:</strong> Children use their weather wheels to make predictions about

                      tomorrow's weather and share observations with the class.

                    </p>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    5

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather Art Gallery</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Children create weather-inspired paintings using different colors and techniques for each weather

                    type. Display artwork in a classroom gallery and invite other classes to view and discuss the

                    weather art.

                  </p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </TabsContent>



      <TabsContent value="friday">

        <Card className="border-cyan-200 shadow-md">

          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-t-lg">

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">Friday: Seasons & Weather Patterns</h3>

              <Badge className="bg-white text-cyan-700">Day 5</Badge>

            </div>

          </div>

          <CardContent className="pt-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                  <Users className="h-4 w-4" /> Focus Activity

                </h4>

                <p className="text-cyan-700 text-lg italic">

                  Exploring seasonal changes and culminating with a weather fashion show celebration

                </p>

              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                  <BookOpen className="h-4 w-4" /> Key Concepts

                </h4>

                <ul className="text-blue-700 space-y-1 text-sm">

                  <li>• Wet and dry seasons</li>

                  <li>• Weather patterns over time</li>

                  <li>• Seasonal activities and clothing</li>

                  <li>• Weather pattern creation</li>

                </ul>

              </div>

            </div>



            <div className="space-y-6">

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    1

                  </div>

                  <h4 className="font-semibold text-cyan-800">Seasonal Changes Exploration</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Divide the classroom in half representing wet and dry seasons. Give children umbrellas and

                    sunglasses as props. Discuss how weather patterns repeat yearly and introduce the concept of

                    seasonal weather patterns.

                  </p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                    <p className="text-sm text-yellow-800">

                      <strong>Discussion Questions:</strong>

                    </p>

                    <ul className="text-sm text-yellow-800 list-disc pl-5 mt-1">

                      <li>What happens during the wet season?</li>

                      <li>How is the dry season different?</li>

                      <li>What activities do people do in each season?</li>

                    </ul>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    2

                  </div>

                  <h4 className="font-semibold text-cyan-800">Seasonal Matching Activity</h4>

                </div>

                <div className="pl-10">

                  <p>

                    In small groups, children investigate pictures showing plant fields, farms, people, and activities.

                    They look for clues to determine which season is represented and explain their reasoning to the

                    class.

                  </p>

                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Wet Season:</strong> Green plants, umbrellas

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Dry Season:</strong> Brown grass, sun hats

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Activities:</strong> Swimming vs. hiking

                    </div>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    3

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather Pattern Mathematics</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Teach simple repeating patterns using weather symbols. Start with body patterns (boy-girl-boy-girl),

                    then move to color patterns, and finally weather patterns (sun-rain-sun-rain). Children create and

                    extend patterns.

                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                    <p className="text-sm text-blue-800">

                      <strong>Pattern Examples:</strong>

                    </p>

                    <ul className="text-sm text-blue-800 list-disc pl-5 mt-1">

                      <li>☀️🌧️☀️🌧️☀️___ (sun-rain pattern)</li>

                      <li>☁️💨☁️💨☁️___ (cloud-wind pattern)</li>

                      <li>🌞⛈️🌞⛈️🌞___ (sunny-stormy pattern)</li>

                    </ul>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    4

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather Fashion Show Preparation</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Children bring weather-appropriate clothing and accessories from home. Discuss what items are

                    suitable for different weather conditions. Practice walking the "runway" and explaining their

                    weather outfit choices.

                  </p>

                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Rainy:</strong> Raincoats, umbrellas, boots

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Sunny:</strong> Sunglasses, hats, light clothes

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Cold:</strong> Sweaters, jackets, warm clothes

                    </div>

                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                      <strong>Windy:</strong> Secure hats, windbreakers

                    </div>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    5

                  </div>

                  <h4 className="font-semibold text-cyan-800">Weather Fashion Show Finale</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Children model their weather-appropriate outfits on a classroom runway. Each child explains their

                    outfit choice and the weather condition it represents. Celebrate the week's learning with applause

                    and positive feedback.

                  </p>

                  <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                    <p className="text-sm text-purple-800">

                      <strong>Celebration Ideas:</strong> Invite other classes to watch, take photos for families,

                      create certificates for "Weather Experts," and review the week's weather chart together.

                    </p>

                  </div>

                </div>

              </div>



              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                <div className="flex items-center gap-2 mb-2">

                  <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                    6

                  </div>

                  <h4 className="font-semibold text-cyan-800">Week Reflection</h4>

                </div>

                <div className="pl-10">

                  <p>

                    Review the weekly question: "What different kinds of weather do we have? What seasons do we have?"

                    Children share their favorite activities from the week and new weather vocabulary they learned.

                  </p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </TabsContent>

      </Tabs>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-6 text-cyan-700 flex items-center gap-3">

          <Cloud className="h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Users className="h-5 w-5" /> Weather Station Rotations

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Students rotate through four weather stations (sun, rain, clouds, wind) to explore weather

                characteristics through hands-on activities and props, building understanding of different weather

                types.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">

                  Weather station props, sunglasses, umbrellas, cotton balls, fans, weather symbols

                </p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-blue-100 text-blue-800 text-xs">Science</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Exploration</Badge>

                <Badge className="bg-orange-100 text-orange-800 text-xs">Hands-on</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Weather Fashion Show

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Students model weather-appropriate clothing and accessories while explaining how different weather

                conditions affect what we wear, connecting weather to daily life decisions.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">Weather clothing, accessories, runway space, weather cards</p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-red-100 text-red-800 text-xs">Social Studies</Badge>

                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Presentation</Badge>

                <Badge className="bg-green-100 text-green-800 text-xs">Life Skills</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Music className="h-5 w-5" /> Weather Pattern Creation

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Students create and extend simple repeating patterns using weather symbols, developing mathematical

                thinking while reinforcing weather vocabulary and concepts.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">Weather symbol cards, pattern strips, crayons, weather chart</p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-pink-100 text-pink-800 text-xs">Mathematics</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Patterns</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Logic</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Pencil className="h-5 w-5" /> Weather Dance & Movement

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Students express different weather types through creative movement and dance, using props and

                instruments to enhance the sensory experience of weather concepts.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">Musical instruments, scarves, weather props, open space</p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-orange-100 text-orange-800 text-xs">Arts</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Movement</Badge>

                <Badge className="bg-green-100 text-green-800 text-xs">Expression</Badge>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-6 text-cyan-700 flex items-center gap-3">

          <BookOpen className="h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-blue-50">

              <CardTitle className="text-blue-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Books

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"What Will the Weather Be Like Today?" by Paul Rogers</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"The Itsy-Bitsy Spider" traditional song</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"All About the Weather" video</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"Weather Words and What They Mean" by Gail Gibbons</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"Maisy's Wonderful Weather Book" by Lucy Cousins</span>

                </li>

              </ul>

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-purple-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-purple-50">

              <CardTitle className="text-purple-700 flex items-center gap-2">

                <Pencil className="h-5 w-5" /> Printables

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weekly weather chart template</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather symbol cards and pictures</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather pattern activity sheets</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather wheel craft template</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Seasonal sorting activity sheets</span>

                </li>

              </ul>

              <Button

                variant="outline"

                className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Download All

              </Button>

            </CardContent>

          </Card>



          <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-orange-50">

              <CardTitle className="text-orange-700 flex items-center gap-2">

                <Users className="h-5 w-5" /> Home Connection

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Family weather tracking activity</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Seasonal clothing sorting game</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather vocabulary practice cards</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather safety discussion guide</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather pattern creation activities</span>

                </li>

              </ul>

              <Button

                variant="outline"

                className="border-orange-300 text-orange-700 hover:bg-orange-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Family Pack

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      {/* Footer Navigation */}

      <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 pt-8 border-t border-gray-200">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/weather">Back to Weather Unit</Link>

        </Button>

        <Link to="/curriculum/kindergarten/activities/weather-unit">

          <Button className="bg-blue-600 hover:bg-blue-700">

            <BookOpen className="mr-2 h-4 w-4" /> View All Activities

          </Button>

        </Link>

        <Link to="/curriculum/kindergarten/weather/week-3">

          <Button variant="outline">

            Next Week <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />

          </Button>

        </Link>

      </div>

    </div>

  )

}
