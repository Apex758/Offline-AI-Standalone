import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChevronLeft, Cloud, Calendar, Download, Lightbulb, BookOpen, Pencil, Music, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"



export default function WeatherUnitWeek4() {

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

            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 px-3 py-1 text-sm">Week 4</Badge>

            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 px-3 py-1 text-sm">Weather Unit</Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-amber-700 flex items-center gap-3">

            <Cloud className="h-8 w-8" /> Week 4: How Do We Know About the Weather?

          </h1>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg mb-6 border border-amber-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-amber-700">Weekly Focus</h2>

            <p className="text-lg">

              Children explore weather forecasting, learn about weather tools and instruments, create weather reports,

              and understand how meteorologists predict weather patterns to help people prepare for different

              conditions.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/activities/weather-unit">

              <Button

                variant="outline"

                className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2 bg-transparent"

              >

                <BookOpen className="h-4 w-4" /> View Activities

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/weather/week-3">

              <Button

                variant="outline"

                className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/weather/week-5">

              <Button

                variant="outline"

                className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-amber-200 shadow-md overflow-hidden">

            <div className="h-48 bg-gradient-to-r from-amber-400 to-amber-500 relative">

              <div className="absolute inset-0 flex items-center justify-center p-2">

                <img src="/caribbean-children-weather-observation.png" alt="Children learning about weather forecasting" className="w-full h-full object-cover" />

              </div>

            </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-amber-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 4</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-amber-800">

                  <Badge className="bg-amber-100 text-amber-800">Monday</Badge>

                  <span>Weather Journals</span>

                </li>

                <li className="flex items-center gap-2 text-amber-800">

                  <Badge className="bg-amber-100 text-amber-800">Tuesday</Badge>

                  <span>Weather Tools</span>

                </li>

                <li className="flex items-center gap-2 text-amber-800">

                  <Badge className="bg-amber-100 text-amber-800">Wednesday</Badge>

                  <span>Weather Forecasting</span>

                </li>

                <li className="flex items-center gap-2 text-amber-800">

                  <Badge className="bg-amber-100 text-amber-800">Thursday</Badge>

                  <span>Weather Data & Patterns</span>

                </li>

                <li className="flex items-center gap-2 text-amber-800">

                  <Badge className="bg-amber-100 text-amber-800">Friday</Badge>

                  <span>Weather Safety</span>

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

          Set up a classroom weather station with simple tools like a thermometer, wind sock, and rain gauge. Have

          children take turns being the daily "meteorologist" to observe, record, and report the weather conditions.

          This hands-on experience helps them understand how weather forecasting works.

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

              <li>Understand how weather forecasts help people prepare</li>

              <li>Identify basic weather tools and instruments</li>

              <li>Create and present simple weather reports</li>

              <li>Recognize the role of meteorologists</li>

              <li>Practice counting and data collection skills</li>

              <li>Develop weather prediction vocabulary</li>

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

                <span className="font-medium text-cyan-700">Forecast</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Meteorologist</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Thermometer</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Weather Station</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Predict</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Observe</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Report</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Prepare</span>

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

              <li>Weather journals and art supplies</li>

              <li>Paper windmill materials</li>

              <li>Thermometer and weather tools</li>

              <li>Chart paper and markers</li>

              <li>Weather symbols and cards</li>

              <li>Video resources and technology</li>

              <li>Recording sheets and clipboards</li>

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

                <h3 className="text-xl font-bold">Monday: Creating Weather Journals</h3>

                <Badge className="bg-white text-cyan-700">Day 1</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">How do we know about the weather?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Weather Words and What They Mean" by Gail Gibbons</li>

                    <li>"The Weather Book" by Diana Craig</li>

                    <li>"What Will the Weather Be?" by Lynda DeWitt</li>

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

                      Ask children the weekly question: "How do we know about the weather?" Record their responses for

                      future reference. Discuss different ways people find out about weather - looking outside, weather

                      reports, asking others.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Encourage children to think about how their families know what

                        weather to expect each day.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Journal Creation</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children create their own Weather Watch Journals using blank paper, hard covers, and art supplies.

                      Show examples of completed weather journals and explain they will act as weather watchers to

                      observe and record daily weather patterns.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Blank paper

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Hard covers

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Art supplies

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Stickers/glitter

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">First Weather Observation</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Take children outside to observe current weather conditions. Look at the sky, feel the

                      temperature, notice wind or lack of wind. Return inside and make first journal entry with drawings

                      and weather words.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Begin daily weather tracking routine that will continue throughout

                        the week.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Outdoor Circle Time</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Sit outside in shade and discuss how families know how to dress for weather. Look at sky, trees,

                      and land. Feel grass and air temperature. Discuss what these observations tell us about weather.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-journals.png" alt="Weather journal creation" className="w-auto h-auto" />

                      <img src="/kindergarten-outdoor-observation.png" alt="Outdoor weather observation" className="w-auto h-auto" />

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

                      Share weather journals and discuss first observations. Create a class chart about "How do we know

                      what the weather is going to be?" using shared writing experience.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What did you observe about today's weather?</li>

                        <li>How do you think people knew about weather long ago?</li>

                        <li>What tools might help us learn about weather?</li>

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

                <h3 className="text-xl font-bold">Tuesday: Simple Weather Tools</h3>

                <Badge className="bg-white text-cyan-700">Day 2</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">What tools help us understand weather?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Weather Forecasting" by Gail Gibbons</li>

                    <li>"Wind and Weather" by Anita Ganeri</li>

                    <li>"Measuring Weather" by Alan Rodgers</li>

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

                      Explain that there are tools people use to know about weather. Introduce wind as something we

                      can't see but can feel and observe through movement of trees and waves. Show video about making

                      paper windmills.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Emphasize that weather forecasters use fancy instruments, but

                        children can use simple tools too.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Making Paper Windmills</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Work with small groups to help children make paper windmills. Follow video instructions and assist

                      with cutting and assembly. Explain how the windmill will help detect wind.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Square paper

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Scissors

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Push pins

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Wooden sticks

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Testing Wind Tools</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Take windmills outside to test for wind. Observe how fast or slow they spin to determine wind

                      strength. Discuss how this helps predict weather conditions.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Compare windmill movement in different locations around the school

                        grounds.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Tools Video</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Watch video about how scientists and meteorologists use different tools to learn about weather.

                      Discuss vocabulary: meteorologist, radar, satellite, patterns.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-paper-windmills.png" alt="Paper windmill creation" className="w-auto h-auto" />

                      <img src="/kindergarten-weather-tools.png" alt="Weather tools exploration" className="w-auto h-auto" />

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

                      Add new ways to know about weather to the class chart using shared writing. Discuss what children

                      learned about weather tools and meteorologists.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>How did your windmill help you learn about wind?</li>

                        <li>What other tools do meteorologists use?</li>

                        <li>Why is it important to know about wind?</li>

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

                <h3 className="text-xl font-bold">Wednesday: Weather Forecasting</h3>

                <Badge className="bg-white text-cyan-700">Day 3</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">How do people predict what weather is coming?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Cloudy With a Chance of Meatballs" by Judi Barrett</li>

                    <li>"Weather Forecasting" by Gail Gibbons</li>

                    <li>"The Weather Report" by various authors</li>

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

                      Review how children know about weather and ask if they've heard someone on radio or TV talk about

                      weather. Discuss weather forecasts and why they're important for planning activities.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Ask children if their families check weather before going out or

                        planning activities.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Forecast Videos</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Watch videos about weather forecasting and simple weather reports. Discuss what children

                      understand about how forecasts help people prepare for weather.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Concept:</strong> Weather prediction

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Concept:</strong> Meteorologist role

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Concept:</strong> Weather maps

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Concept:</strong> Daily forecasts

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Creating Weather Reports</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children choose partners and create their own weather reports through role-play. Use current

                      weather observations and practice weather vocabulary. Provide props like microphones and weather

                      charts.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Set up a "weather station" area where children can practice being

                        meteorologists.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Report Presentations</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children perform their weather reports for the class. Audience members act as viewers watching the

                      weather forecast. Celebrate different presentation styles and weather vocabulary used.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-reports.png" alt="Weather report presentations" className="w-auto h-auto" />

                      <img src="/kindergarten-meteorologist-play.png" alt="Meteorologist role play" className="w-auto h-auto" />

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

                      Discuss what children learned about weather forecasting and meteorologists. Add new information to

                      the class chart about ways to know about weather.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What did you like about being a meteorologist?</li>

                        <li>How do weather forecasts help people?</li>

                        <li>What would happen if we didn't have weather forecasts?</li>

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

                <h3 className="text-xl font-bold">Thursday: Weather Data and Patterns</h3>

                <Badge className="bg-white text-cyan-700">Day 4</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">What patterns can we see in weather?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Weather Patterns" by Monica Hughes</li>

                    <li>"Tracking the Weather" by Gail Gibbons</li>

                    <li>"Weather Charts and Graphs" by various</li>

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

                      Review weather observations from the week using class weather chart. Discuss patterns - were there

                      more sunny days or rainy days? Did weather change from day to day?

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Use the weather chart created throughout the week to identify

                        simple patterns.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Journal Graphs</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children look through their individual weather journals and create simple graphs showing weather

                      patterns from the week. Count sunny days, rainy days, cloudy days, and windy days.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Skill:</strong> Data collection

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Skill:</strong> Counting

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Skill:</strong> Graphing

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Skill:</strong> Pattern recognition

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Class Weather Report</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create a collaborative class weather report using shared writing. Include current date, weather

                      description, temperature, and forecast for tomorrow. Use children's observations and weather app

                      information.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Children can create individual weather report templates to complete.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Prediction Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children make simple predictions about tomorrow's weather based on current observations. Discuss

                      what clues help them make predictions - clouds, wind, temperature.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-graphs.png" alt="Weather pattern graphs" className="w-auto h-auto" />

                      <img src="/kindergarten-weather-predictions.png" alt="Weather prediction activity" className="w-auto h-auto" />

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

                      Share weather graphs and predictions. Discuss patterns noticed in the week's weather and how this

                      information helps meteorologists make forecasts.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What weather pattern did you notice this week?</li>

                        <li>How do patterns help predict weather?</li>

                        <li>What do you predict tomorrow's weather will be?</li>

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

                <h3 className="text-xl font-bold">Friday: Weather Safety and Preparation</h3>

                <Badge className="bg-white text-cyan-700">Day 5</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">Why is it important to know about severe weather?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Severe Weather Safety" by various</li>

                    <li>"Storm Safety" by Christina Hill</li>

                    <li>"Weather Safety Rules" by Martin Gitlin</li>

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

                      Discuss severe weather conditions and show pictures of storms. Ask children what would happen if

                      weather reports said no rain for days or heavy rain for a long time. Introduce the concept of

                      weather safety.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Focus on how weather forecasts help people stay safe rather than

                        creating fear about severe weather.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Safety Discussion</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Ask children how they found out about storms they've experienced and why it was important to know

                      beforehand. Discuss how weather forecasts help people prepare and stay safe.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Safety:</strong> Preparation

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Safety:</strong> Early warning

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Safety:</strong> Planning ahead

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Safety:</strong> Staying informed

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Safety Art</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children create drawings showing how people prepare for different weather conditions. Include

                      people wearing appropriate clothing, bringing items inside, or staying in safe places during

                      storms.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Children can write sentences about their drawings explaining weather

                        safety.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Guest Speaker Preparation</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Prepare questions for next week's guest speaker (community elder who knows old weather sayings).

                      Review what children have learned about weather forecasting and how people knew about weather long

                      ago.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-weather-safety.png" alt="Weather safety drawings" className="w-auto h-auto" />

                      <img src="/kindergarten-weather-preparation.png" alt="Weather preparation activities" className="w-auto h-auto" />

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

                      Complete guest speaker recording sheet together. Write thank you note for the speaker. Celebrate

                      the week's learning about weather forecasting and how we know about weather.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What new ways did you learn to know about weather?</li>

                        <li>How do weather forecasts help keep people safe?</li>

                        <li>What would you like to learn more about weather?</li>

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

        <h2 className="text-2xl font-bold mb-6 text-cyan-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700">Weather Station Setup</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-600 mb-4">

                Create a classroom weather station with simple tools for daily observations and weather tracking.

              </p>

              <div className="space-y-2 text-sm">

                <div className="flex items-center">

                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />

                  <span>30 minutes setup, ongoing use</span>

                </div>

                <div className="flex items-center">

                  <Music className="h-4 w-4 text-gray-400 mr-2" />

                  <span>Thermometer, wind sock, rain gauge, chart</span>

                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700">Weather Report Role Play</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-600 mb-4">

                Children take turns being meteorologists, creating and presenting weather reports to the class.

              </p>

              <div className="space-y-2 text-sm">

                <div className="flex items-center">

                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />

                  <span>25 minutes</span>

                </div>

                <div className="flex items-center">

                  <Music className="h-4 w-4 text-gray-400 mr-2" />

                  <span>Weather symbols, microphone prop, chart paper</span>

                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700">Weather Tool Investigation</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-600 mb-4">

                Explore real weather instruments and create simple versions to understand how meteorologists work.

              </p>

              <div className="space-y-2 text-sm">

                <div className="flex items-center">

                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />

                  <span>35 minutes</span>

                </div>

                <div className="flex items-center">

                  <Music className="h-4 w-4 text-gray-400 mr-2" />

                  <span>Various weather tools, craft materials</span>

                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700">Weather Pattern Graphing</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-600 mb-4">

                Use weather journal data to create simple graphs and identify patterns in local weather conditions.

              </p>

              <div className="space-y-2 text-sm">

                <div className="flex items-center">

                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />

                  <span>20 minutes</span>

                </div>

                <div className="flex items-center">

                  <Music className="h-4 w-4 text-gray-400 mr-2" />

                  <span>Graph paper, weather journals, stickers</span>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>



      <div>

        <h2 className="text-2xl font-bold mb-6 text-cyan-700 flex items-center">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Books

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">

                <li>"Weather Words and What They Mean" by Gail Gibbons</li>

                <li>"The Weather Book" by Diana Craig</li>

                <li>"What Will the Weather Be?" by Lynda DeWitt</li>

                <li>"Weather Forecasting" by Gail Gibbons</li>

                <li>"Cloudy With a Chance of Meatballs" by Judi Barrett</li>

              </ul>

              <Button

                variant="outline"

                className="mt-4 w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" />

                Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700 flex items-center gap-2">

                <Pencil className="h-5 w-5" /> Printables

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">

                <li>Weather journal templates</li>

                <li>Weather tool identification cards</li>

                <li>Weather report templates</li>

                <li>Weather pattern graphing sheets</li>

                <li>Weather safety scenario cards</li>

              </ul>

              <Button

                variant="outline"

                className="mt-4 w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" />

                Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700 flex items-center gap-2">

                <Users className="h-5 w-5" /> Home Connection

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-sm text-gray-600 mb-4 mt-2">

                Send home a family weather watching guide with simple activities for observing and discussing weather at

                home. Include tips for watching weather forecasts together.

              </p>

              <Button

                variant="outline"

                className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" />

                Family Guide

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

          <Button className="bg-amber-600 hover:bg-amber-700">

            <BookOpen className="mr-2 h-4 w-4" /> View All Activities

          </Button>

        </Link>

        <Link to="/curriculum/kindergarten/weather/week-5">

          <Button variant="outline">

            Next Week <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />

          </Button>

        </Link>

      </div>

    </div>

  )

}
