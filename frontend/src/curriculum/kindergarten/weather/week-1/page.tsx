import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChevronLeft, Cloud, Calendar, Download, Lightbulb, BookOpen, Pencil, Music, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"



export default function WeatherUnitWeek1() {

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

            <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100 px-3 py-1 text-sm">Week 1</Badge>

            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1 text-sm">Weather Unit</Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-cyan-700 flex items-center gap-3">

            <Cloud className="h-8 w-8" /> Week 1: Is the Weather Important?

          </h1>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg mb-6 border border-cyan-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-cyan-700">Weekly Focus</h2>

            <p className="text-lg">

              Children explore weather as part of their daily lives, learn basic weather vocabulary, and begin

              understanding how weather affects people, plants, and animals around them.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/activities/weather-unit">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                <BookOpen className="h-4 w-4" /> View Activities

              </Button>

            </Link>

            <Button

              variant="outline"

              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              disabled

            >

              <ChevronLeft className="h-4 w-4" /> Previous Week

            </Button>

            <Link to="/curriculum/kindergarten/weather/week-2">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-cyan-200 shadow-md overflow-hidden">

            <div className="h-48 bg-gradient-to-r from-cyan-400 to-blue-400 relative">

              <div className="absolute inset-0 flex items-center justify-center p-2">

                <img src="/kindergarten-weather-observation.png" alt="Children’s crayon drawing with the word “WEATHER,” showing a sun, clouds, rain, wind, plants, and a smiling child, labeled with simple weather words like “SUNNY,” “CLOUDY,” “RAIN,” and “WINDY.”" className="w-full h-full object-cover" />

              </div>

            </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-cyan-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 1</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-cyan-800">

                  <Badge className="bg-cyan-100 text-cyan-800">Monday</Badge>

                  <span>What is Weather?</span>

                </li>

                <li className="flex items-center gap-2 text-cyan-800">

                  <Badge className="bg-cyan-100 text-cyan-800">Tuesday</Badge>

                  <span>Weather Walk & Observation</span>

                </li>

                <li className="flex items-center gap-2 text-cyan-800">

                  <Badge className="bg-cyan-100 text-cyan-800">Wednesday</Badge>

                  <span>Weather Patterns & Pictures</span>

                </li>

                <li className="flex items-center gap-2 text-cyan-800">

                  <Badge className="bg-cyan-100 text-cyan-800">Thursday</Badge>

                  <span>Weather Games & Activities</span>

                </li>

                <li className="flex items-center gap-2 text-cyan-800">

                  <Badge className="bg-cyan-100 text-cyan-800">Friday</Badge>

                  <span>Weather Art & Reflection</span>

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

          Set up weather observation stations around your classroom with pictures of different weather types (sun, rain,

          clouds, wind). Create a daily weather chart where children can record observations. Consider having a

          designated "weather reporter" each day to help build vocabulary and observation skills.

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

              <li>Understand that weather makes a difference to people, plants and animals</li>

              <li>Identify basic weather types (sunny, rainy, cloudy, windy)</li>

              <li>Use senses to observe and describe weather conditions</li>

              <li>Practice counting and number recognition 1-10</li>

              <li>Develop weather-related vocabulary</li>

              <li>Create simple weather patterns and observations</li>

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

                <span className="font-medium text-cyan-700">Weather</span>

              </div>

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

                <span className="font-medium text-cyan-700">Observe</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Temperature</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Patterns</span>

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

              <li>Weather symbol pictures and cards</li>

              <li>Chart paper and markers</li>

              <li>Art supplies (crayons, paint, paper)</li>

              <li>Weather observation sheets</li>

              <li>Umbrellas, sunglasses, weather props</li>

              <li>Cotton balls, blue paper (for crafts)</li>

              <li>Camera for documentation</li>

              <li>Weather-themed books</li>

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

                <h3 className="text-xl font-bold">Monday: What is Weather?</h3>

                <Badge className="bg-white text-cyan-700">Day 1</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">Is the weather important to me and my family?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Weather Words and What They Mean" by Gail Gibbons</li>

                    <li>"What Will the Weather Be Like Today?" by Paul Rogers</li>

                    <li>"The Weather Book" by Diana Craig</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-cyan-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Introduce the weather unit by showing large pictures of weather symbols (sun, rain, wind, clouds).

                      Ask children to name each one and look outside to identify today's weather. Discuss the essential

                      question: "Is the weather important?"

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Encourage children to use their senses - what do they see, hear,

                        and feel when they think about different types of weather?

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Stations Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Set up four weather stations (Sun, Rain, Clouds, Wind) with props and materials. Children rotate

                      through stations to explore weather through hands-on activities. Sun station has sunglasses and

                      visors, Rain station has umbrellas and boots, etc.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Station:</strong> Sun props

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Station:</strong> Rain materials

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Station:</strong> Cloud cotton

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Station:</strong> Wind activities

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Count and sort weather picture cards. Create a simple graph showing different weather types.

                      Practice counting from 1-10 using weather symbols and discuss which weather type has the

                      most/least cards.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use weather manipulatives to create patterns - sunny, rainy, sunny,

                        rainy. Ask children to continue the pattern.

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

                      Exit Ticket: Children draw one way weather is important to them and their family. Help them write

                      a simple sentence about their picture. Encourage sharing with partners.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-drawing.png" alt="Weather importance drawing example" className="w-auto h-auto" />

                      <img src="/kindergarten-weather-stations.png" alt="Weather stations setup" className="w-auto h-auto" />

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

                      Share weather drawings and discuss favorite weather stations. Ask children which weather type was

                      their favorite and why. Begin establishing daily weather observation routine.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What did you learn about weather today?</li>

                        <li>How does weather affect what you do each day?</li>

                        <li>What weather do you like best and why?</li>

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

                <h3 className="text-xl font-bold">Tuesday: Weather Walk & Observation</h3>

                <Badge className="bg-white text-cyan-700">Day 2</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">How can we observe and describe weather?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Little Cloud" by Eric Carle</li>

                    <li>"Listen to the Rain" by Bill Martin Jr.</li>

                    <li>"Feel the Wind" by Arthur Dorros</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-cyan-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Discuss using our senses to observe weather. Read "Little Cloud" and talk about what we can see,

                      hear, feel, and smell when we experience different weather conditions.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Model using descriptive language - "I see fluffy white clouds" or

                        "I feel the warm sunshine on my face."

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Walk</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Take children on a weather observation walk around the school. Use clipboards and observation

                      sheets to record what they see, hear, feel, and smell. Discuss temperature, wind, clouds, and

                      other weather elements.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Clipboards

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Observation sheets

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Pencils

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Weather chart

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Weather painting: Children paint pictures of the weather they observed during their walk. Use

                      watercolors to create different weather effects and discuss how colors can represent different

                      weather.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Create texture in paintings using different techniques - sponges for

                        clouds, splatter painting for rain, cotton swabs for snow.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Shared Writing</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create a class weather observation story based on the morning walk. Use children's observations

                      and descriptive language to write about today's weather experience.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-walk.png" alt="Weather walk observation" className="w-auto h-auto" />

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

                      Share weather paintings and discuss observations from the walk. Compare what different children

                      noticed and celebrate the variety of observations.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What was the most interesting thing you observed about today's weather?</li>

                        <li>How did the weather feel on your skin?</li>

                        <li>What sounds did you hear that told you about the weather?</li>

                      </ul>

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

                <h3 className="text-xl font-bold">Wednesday: Weather Patterns & Pictures</h3>

                <Badge className="bg-white text-cyan-700">Day 3</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">How can we show and count different types of weather?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"What's the Weather Like Today?" by various</li>

                    <li>"Weather" by DK Eyewitness</li>

                    <li>"Maisy's Wonderful Weather Book" by Lucy Cousins</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-cyan-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Show large pictures of sunny and rainy day scenes. Use Think-Pair-Share to discuss what children

                      see in each picture. Focus on how people dress and what activities they do in different weather.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Encourage children to notice details like clothing, activities,

                        and how the environment looks different in various weather conditions.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Voting and counting activity: Children vote for their favorite weather picture by sitting or

                      standing. Count votes together and determine which picture has more/fewer votes. Practice number

                      recognition and counting.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Skill:</strong> Counting votes

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Skill:</strong> More/less comparison

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Skill:</strong> Number recognition

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Skill:</strong> Data collection

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Shape Weather Craft</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create weather scenes using pre-cut shapes. Use yellow circles for sun, blue rectangles for sky,

                      grey circles for clouds, and green triangles for trees. Discuss shape names and count shapes used.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Ask children to create patterns with weather shapes or sort shapes

                        by color, size, or weather type.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Music & Movement</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Watch and sing along to "What's the Weather Like Today?" video. Practice weather-related movements

                      and actions. Dance like raindrops, shine like the sun, blow like the wind.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-shapes.png" alt="Weather shape craft example" className="w-auto h-auto" />

                      <img src="/kindergarten-weather-dance.png" alt="Weather movement activity" className="w-auto h-auto" />

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

                      Share shape weather scenes and discuss the different weather types created. Review new weather

                      vocabulary learned and practice weather movements.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>Which weather scene was your favorite to create?</li>

                        <li>What shapes did you use the most in your weather picture?</li>

                        <li>How many different types of weather can you name now?</li>

                      </ul>

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

                <h3 className="text-xl font-bold">Thursday: Weather Games & Activities</h3>

                <Badge className="bg-white text-cyan-700">Day 4</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">What do we do in different types of weather?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Rain, Rain, Go Away" traditional song</li>

                    <li>"The Itsy Bitsy Spider" traditional song</li>

                    <li>"When the Wind Blew" by Pat Hutchins</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-cyan-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Teacher dresses up in weather-appropriate clothing (raincoat, umbrella, boots) and asks children

                      to guess what weather they're dressed for. Discuss how weather affects our clothing choices and

                      activities.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Bring various weather clothing items and let children try them on

                        while discussing when we would wear each item.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Game</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Play weather guessing game where children draw items we use in different weather conditions. Teams

                      guess: umbrella for rain, sunglasses for sun, kite for wind, ice cream for hot weather.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Round 1:</strong> Rain protection

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Round 2:</strong> Sun protection

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Round 3:</strong> Wind activities

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Round 4:</strong> Hot weather treats

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Craft Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create weather-appropriate items from craft materials. Make paper umbrellas, sun visors, or wind

                      socks. Children choose their favorite weather and create a related craft item.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Set up a weather dress-up station where children can practice

                        choosing appropriate clothing for different weather scenarios.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Observation</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Begin daily weather tracking chart. Children observe today's weather and color in the appropriate

                      symbol. Discuss patterns and compare with previous days' weather.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-chart.png" alt="Daily weather tracking chart" className="w-auto h-auto" />

                      <img src="/kindergarten-weather-crafts.png" alt="Weather craft examples" className="w-auto h-auto" />

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

                      Share weather crafts and discuss when we would use each item. Practice weather vocabulary and sing

                      weather songs learned this week.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What is your favorite weather activity?</li>

                        <li>How do you prepare for different types of weather?</li>

                        <li>What weather words can you remember from this week?</li>

                      </ul>

                    </div>

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

                <h3 className="text-xl font-bold">Friday: Weather Art & Reflection</h3>

                <Badge className="bg-white text-cyan-700">Day 5</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">How has weather been important to us this week?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Farmer Joe's Hot Day" by Nancy Wilcox Richards</li>

                    <li>"Weather" by Seymour Simon</li>

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

                    <h4 className="font-semibold text-cyan-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Review the week's weather observations and learning. Look at the weather chart created throughout

                      the week and discuss patterns. Read "Farmer Joe's Hot Day" to reinforce how weather affects

                      people.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Use this time to assess children's understanding of weather

                        concepts and vocabulary learned throughout the week.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Sorting Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Sort weather picture cards and objects by weather type. Count items in each category and create a

                      final class graph. Discuss which weather type has the most/least items.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Category:</strong> Sunny weather

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Category:</strong> Rainy weather

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Category:</strong> Windy weather

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Category:</strong> Cloudy weather

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Scene Drawing</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children draw a weather scene showing how weather is important to them and their family. Include

                      people, activities, and appropriate clothing. Write a sentence about their drawing.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Create a class book of weather scenes with each child's drawing and

                        sentence to share with families.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Presentation</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Gallery walk to view all weather work from the week. Children present their weather scenes and

                      explain how weather is important to their families.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-gallery.png" alt="Weather art gallery display" className="w-auto h-auto" />

                      <img src="/kindergarten-weather-scenes.png" alt="Weather scene drawings" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-cyan-800">Week Celebration</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Celebrate the week's learning with weather songs and movements. Return to the essential question:

                      "Is the weather important?" and discuss how children's understanding has grown.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What is the most important thing you learned about weather this week?</li>

                        <li>How is weather important to you and your family?</li>

                        <li>What type of weather do you want to learn more about?</li>

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

        <h2 className="text-2xl font-bold mb-6 text-cyan-700 flex items-center gap-3">

          <Cloud className="h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Users className="h-5 w-5" /> Weather Stations Exploration

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Children rotate through four weather stations (Sun, Rain, Clouds, Wind) with hands-on props and

                materials to explore different weather conditions through sensory experiences.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">

                  Sunglasses, umbrellas, cotton balls, fans, weather props, station signs

                </p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-blue-100 text-blue-800 text-xs">Science</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Sensory</Badge>

                <Badge className="bg-orange-100 text-orange-800 text-xs">Exploration</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Weather Walk Investigation

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Outdoor exploration where children use clipboards and observation sheets to record what they see, hear,

                feel, and smell about today's weather conditions.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">Clipboards, observation sheets, pencils, weather chart</p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-red-100 text-red-800 text-xs">Observation</Badge>

                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Recording</Badge>

                <Badge className="bg-green-100 text-green-800 text-xs">Nature</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Music className="h-5 w-5" /> Weather Shape Art

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Creative activity where children use pre-cut shapes to create weather scenes while learning shape names,

                colors, and counting skills through weather-themed art.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">

                  Pre-cut shapes, glue, construction paper, crayons, weather examples

                </p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-pink-100 text-pink-800 text-xs">Art</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Math</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Creativity</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Pencil className="h-5 w-5" /> Daily Weather Tracking

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Ongoing data collection activity where children observe and record daily weather patterns, building

                graphing skills and weather vocabulary throughout the week.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">Weather chart, weather symbols, crayons, observation sheets</p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-orange-100 text-orange-800 text-xs">Data</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Patterns</Badge>

                <Badge className="bg-green-100 text-green-800 text-xs">Recording</Badge>

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

                  <span>"Weather Words and What They Mean" by Gail Gibbons</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"What Will the Weather Be Like Today?" by Paul Rogers</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"Little Cloud" by Eric Carle</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"Listen to the Rain" by Bill Martin Jr.</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"When the Wind Blew" by Pat Hutchins</span>

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

                  <span>Daily weather observation charts</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather symbol cards and pictures</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather walk observation sheets</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather vocabulary cards</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather graphing templates</span>

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

                  <span>Family weather observation activities</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather vocabulary practice cards</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather clothing sorting game</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weekly weather tracking sheet</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weather song lyrics and activities</span>

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

          <Button className="bg-cyan-600 hover:bg-cyan-700">

            <BookOpen className="mr-2 h-4 w-4" /> View All Activities

          </Button>

        </Link>

        <Link to="/curriculum/kindergarten/weather/week-2">

          <Button variant="outline">

            Next Week <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />

          </Button>

        </Link>

      </div>

    </div>

  )

}
