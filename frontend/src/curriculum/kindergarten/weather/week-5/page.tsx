import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChevronLeft, Cloud, Calendar, Download, Lightbulb, BookOpen, Pencil, Music, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"



export default function WeatherUnitWeek5() {

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

            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 px-3 py-1 text-sm">Week 5</Badge>

            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 px-3 py-1 text-sm">Weather Unit</Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-purple-700 flex items-center gap-3">

            <Cloud className="h-8 w-8" /> Week 5: How Do People Protect Themselves from Weather?

          </h1>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg mb-6 border border-purple-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-purple-700">Weekly Focus</h2>

            <p className="text-lg">

              Children explore weather safety and protection strategies, learn about emergency preparedness, understand

              the motto "Be prepared; not scared," and discover how people protect themselves and their belongings from

              different weather conditions including severe weather.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/activities/weather-unit">

              <Button

                variant="outline"

                className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2 bg-transparent"

              >

                <BookOpen className="h-4 w-4" /> View Activities

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/weather/week-4">

              <Button

                variant="outline"

                className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Button

              variant="outline"

              className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2 bg-transparent"

            >

              Unit Complete <ChevronLeft className="h-4 w-4 rotate-180" />

            </Button>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-purple-200 shadow-md overflow-hidden">

            <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-500 relative">

              <div className="absolute inset-0 flex items-center justify-center p-2">

                <img src="/caribbean-weather-safety-preparation.png" alt="Caribbean children learning about weather safety" className="w-full h-full object-cover" />

              </div>

            </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-purple-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 5</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-purple-800">

                  <Badge className="bg-purple-100 text-purple-800">Monday</Badge>

                  <span>Weather Safety Stories</span>

                </li>

                <li className="flex items-center gap-2 text-purple-800">

                  <Badge className="bg-purple-100 text-purple-800">Tuesday</Badge>

                  <span>Protection Strategies</span>

                </li>

                <li className="flex items-center gap-2 text-purple-800">

                  <Badge className="bg-purple-100 text-purple-800">Wednesday</Badge>

                  <span>Emergency Preparedness</span>

                </li>

                <li className="flex items-center gap-2 text-purple-800">

                  <Badge className="bg-purple-100 text-purple-800">Thursday</Badge>

                  <span>Building Shelters</span>

                </li>

                <li className="flex items-center gap-2 text-purple-800">

                  <Badge className="bg-purple-100 text-purple-800">Friday</Badge>

                  <span>Unit Celebration</span>

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

          Introduce the motto "Be prepared; not scared" early in the week and refer to it frequently. Focus on how

          preparation helps people feel safe and confident rather than creating anxiety about severe weather. Use

          positive examples of how families and communities work together to stay safe.

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

              <li>Understand the motto "Be prepared; not scared"</li>

              <li>Identify ways people protect themselves from weather</li>

              <li>Recognize severe weather safety practices</li>

              <li>Learn about emergency preparedness kits</li>

              <li>Practice building simple weather shelters</li>

              <li>Develop weather protection vocabulary</li>

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

                <span className="font-medium text-cyan-700">Prepare</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Protect</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Shelter</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Emergency</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Safety</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Severe Weather</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Drill</span>

              </div>

              <div className="bg-white p-2 rounded border border-cyan-100">

                <span className="font-medium text-cyan-700">Warning</span>

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

              <li>Weather safety books and videos</li>

              <li>Emergency kit supplies for demonstration</li>

              <li>Shelter building materials (boxes, fabric)</li>

              <li>Musical instruments for storm sounds</li>

              <li>Art supplies for safety drawings</li>

              <li>Chart paper and markers</li>

              <li>Weather protection clothing items</li>

              <li>Camera for documenting activities</li>

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

                <h3 className="text-xl font-bold">Monday: Weather Safety Stories</h3>

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

                    How do people protect themselves and their belongings from the weather?

                  </p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Clifford and the Big Storm" by Norman Bridwell</li>

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

                    <h4 className="font-semibold text-cyan-800">Morning Circle - Introducing the Motto</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Post the motto "Be prepared; not scared" and read it with children. Explain that being ready for

                      weather helps us feel safe instead of worried. Discuss situations where preparation helps people

                      stay safe (storms, hurricanes, fires).

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Emphasize positive preparation rather than creating fear about

                        severe weather events.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Read Aloud: "Clifford and the Big Storm"</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Read the story and pause to discuss how characters prepare for and stay safe during the storm. Ask

                      children about their favorite parts and what they learned about weather safety.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Concept:</strong> Storm preparation

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Concept:</strong> Helping others

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Concept:</strong> Staying safe

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Concept:</strong> Community support

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">"Be Prepared; Not Scared" Art</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children draw pictures and write sentences showing the motto "Be prepared; not scared." They can

                      draw people preparing for weather, families working together, or safety activities.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Display artwork around the classroom with the motto as a visual

                        reminder throughout the week.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Protection Discussion</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Show pictures of people in different weather conditions and discuss how they protect themselves.

                      Talk about appropriate clothing, staying in safe places, and listening to weather warnings.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/caribbean-weather-protection-clothing.png" alt="Weather protection clothing" className="w-auto h-auto" />

                      <img src="/caribbean-weather-safety-discussion.png" alt="Weather safety discussion" className="w-auto h-auto" />

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

                      Review the motto "Be prepared; not scared" and ask children to share one way people can prepare

                      for weather. Create a class chart of weather protection strategies using shared writing.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What does "Be prepared; not scared" mean to you?</li>

                        <li>How do people in your family prepare for bad weather?</li>

                        <li>What makes you feel safe during storms?</li>

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

                <h3 className="text-xl font-bold">Tuesday: Protection Strategies</h3>

                <Badge className="bg-white text-cyan-700">Day 2</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">

                    What are different ways to stay safe in various weather conditions?

                  </p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Weather Safety" by various authors</li>

                    <li>"Staying Safe in Bad Weather" by Cari Meister</li>

                    <li>"Hurricane Safety" by Lucia Raatma</li>

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

                      Show pictures of people in different weather conditions and discuss protection strategies. Ask

                      children how people protect themselves from sun, rain, wind, and storms.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Use local examples and weather conditions familiar to Caribbean

                        children.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Weather Protection Scenarios</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Present different weather scenarios and discuss appropriate protection strategies. Include sunny

                      days (shade, hats, water), rainy days (umbrellas, staying inside), and windy days (secure

                      objects).

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Sunny:</strong> Shade, hats, water

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Rainy:</strong> Umbrellas, indoors

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Windy:</strong> Secure objects

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Stormy:</strong> Safe shelter

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Guest Speaker: Fisherman</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Local fisherman discusses how weather affects his work and how he prepares for different

                      conditions. Children ask prepared questions about weather safety and boat protection.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Complete guest speaker recording sheet and write thank you note

                        together.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Severe Weather Video</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Watch age-appropriate video about severe weather and safety. Discuss what children observed and

                      how people can prepare for dangerous weather conditions.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/caribbean-fisherman-weather-safety.png" alt="Fisherman discussing weather safety" className="w-auto h-auto" />

                      <img src="/caribbean-severe-weather-preparation.png" alt="Severe weather preparation" className="w-auto h-auto" />

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

                      Add new protection strategies to the class chart. Discuss what children learned from the fisherman

                      and video about staying safe in different weather conditions.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What did you learn from our fisherman visitor?</li>

                        <li>How do different jobs require weather preparation?</li>

                        <li>What weather protection do you use at home?</li>

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

                <h3 className="text-xl font-bold">Wednesday: Emergency Preparedness</h3>

                <Badge className="bg-white text-cyan-700">Day 3</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">

                    How do families prepare for emergencies and severe weather?

                  </p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Emergency Kit" by various authors</li>

                    <li>"Being Prepared" by Cari Meister</li>

                    <li>"Family Safety Plans" by various</li>

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

                      Review the motto "Be prepared; not scared" and discuss what emergency preparedness means. Ask

                      children what their families do to get ready for storms or other emergencies.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Focus on positive preparation activities rather than scary

                        emergency scenarios.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Emergency Kit Show and Tell</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Teacher shows emergency preparedness kit with flashlight, batteries, first aid supplies, water,

                      blanket, radio, and food. Children predict what's in the kit and discuss how each item helps.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Item:</strong> Flashlight

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Item:</strong> Water bottles

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Item:</strong> First aid kit

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Item:</strong> Battery radio

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Emergency Kit Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children draw their own emergency preparedness kit and label items with teacher help. Discuss what

                      other items families might include like medicine, extra clothes, or important papers.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Send home family emergency kit checklist for families to review

                        together.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Safety Drills and Sirens</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Discuss different types of safety drills and why they're important. Show picture of warning siren

                      and play siren sound. Practice simple safety responses like "stop, drop, and cover."

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/caribbean-emergency-kit-activity.png" alt="Emergency kit drawing activity" className="w-auto h-auto" />

                      <img src="/caribbean-safety-drill-practice.png" alt="Safety drill practice" className="w-auto h-auto" />

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

                      Review emergency preparedness concepts and add new ideas to class chart. Discuss how being

                      prepared helps families feel safe and confident during emergencies.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What would you put in your family's emergency kit?</li>

                        <li>How do safety drills help keep people safe?</li>

                        <li>What does it mean to be prepared for emergencies?</li>

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

                <h3 className="text-xl font-bold">Thursday: Building Weather Shelters</h3>

                <Badge className="bg-white text-cyan-700">Day 4</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">How can we build structures to protect from weather?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Building Shelters" by various authors</li>

                    <li>"Houses Around the World" by various</li>

                    <li>"Protecting Our Things" by various</li>

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

                      Discuss what happens when there's too much sunlight and heat. Ask children why people might want

                      to reduce the warming effect of the sun and what structures help protect from weather.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Connect to local examples like market stalls, bus stops, and

                        covered walkways.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Shelter Planning</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children choose what type of shelter to build (house, tent, kennel, school) and explain why.

                      Discuss what materials would work best and what problems they might need to solve.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Type:</strong> House

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Type:</strong> Tent

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Type:</strong> Pet shelter

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Type:</strong> Shade structure

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Building Weather Shelters</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Using craft materials, children build model shelters to protect from sun, rain, or wind. Teacher

                      stops class midway to discuss problem-solving strategies and share solutions.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Test shelters with spray bottles (rain) or fans (wind) to see how

                        well they protect.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">Shelter Gallery Walk</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Children label their shelters with teacher help and display them for others to view. Take turns

                      explaining their shelter design and what weather it protects against.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/caribbean-shelter-building-activity.png" alt="Shelter building activity" className="w-auto h-auto" />

                      <img src="/caribbean-shelter-gallery-display.png" alt="Shelter gallery display" className="w-auto h-auto" />

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

                      Discuss what children learned about building structures for weather protection. Connect to real

                      buildings and structures in their community that provide weather protection.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What was challenging about building your shelter?</li>

                        <li>How did you solve problems during building?</li>

                        <li>What shelters do you see in your community?</li>

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

                <h3 className="text-xl font-bold">Friday: Unit Celebration</h3>

                <Badge className="bg-white text-cyan-700">Day 5</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">

                  <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-cyan-700 text-lg italic">Is the weather important? (Unit essential question)</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>Review favorite weather books from the unit</li>

                    <li>"Weather All Around" by various</li>

                    <li>"Our Weather Unit" (class-made book)</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-cyan-800">Morning Circle - Unit Review</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Review the essential question "Is the weather important?" and compare children's answers from the

                      beginning of the unit. Discuss all the things they've learned about weather over five weeks.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Use charts and displays from throughout the unit to help children

                        remember their learning.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-cyan-800">Gallery Walk Preparation</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Take children on a gallery walk around the classroom to review all their weather learning

                      displays. Prepare them to be "tour guides" for family members and visitors.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Display:</strong> Weather charts

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Display:</strong> Weather journals

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Display:</strong> Safety artwork

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-200">

                        <strong>Display:</strong> Weather shelters

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-cyan-800">Celebration of Learning</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Invite family members, other classes, or school staff for a Celebration of Learning. Children act

                      as tour guides, explaining their weather learning and demonstrating activities.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Children can perform weather songs, demonstrate weather tools, or

                        share weather reports.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-cyan-100 text-cyan-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-cyan-800">"Be Prepared; Not Scared" Celebration</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      End the celebration with a special treat and group recitation of the motto "Be prepared; not

                      scared." Take photos of children with their weather learning displays.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/caribbean-weather-unit-celebration.png" alt="Weather unit celebration" className="w-auto h-auto" />

                      <img src="/caribbean-weather-learning-gallery.png" alt="Weather learning gallery walk" className="w-auto h-auto" />

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

                      Final reflection on the weather unit and the essential question. Children share their favorite

                      weather learning experiences and what they want to continue exploring about weather.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What was your favorite part of learning about weather?</li>

                        <li>How will you use what you learned about weather safety?</li>

                        <li>What do you still want to learn about weather?</li>

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

              <CardTitle className="text-cyan-700">Emergency Kit Creation</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-600 mb-4">

                Children learn about emergency preparedness by exploring a real emergency kit and creating their own

                drawings.

              </p>

              <div className="space-y-2 text-sm">

                <div className="flex items-center">

                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />

                  <span>25 minutes</span>

                </div>

                <div className="flex items-center">

                  <Music className="h-4 w-4 text-gray-400 mr-2" />

                  <span>Emergency supplies, art materials, clipboards</span>

                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700">Weather Shelter Building</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-600 mb-4">

                Hands-on engineering activity where children design and build model shelters to protect from different

                weather conditions.

              </p>

              <div className="space-y-2 text-sm">

                <div className="flex items-center">

                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />

                  <span>40 minutes</span>

                </div>

                <div className="flex items-center">

                  <Music className="h-4 w-4 text-gray-400 mr-2" />

                  <span>Boxes, fabric, craft materials, spray bottles</span>

                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700">Storm Sound Creation</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-600 mb-4">

                Musical activity where children use instruments to recreate storm sounds and practice safety responses.

              </p>

              <div className="space-y-2 text-sm">

                <div className="flex items-center">

                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />

                  <span>20 minutes</span>

                </div>

                <div className="flex items-center">

                  <Music className="h-4 w-4 text-gray-400 mr-2" />

                  <span>Drums, shakers, cymbals, wind chimes</span>

                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-cyan-50">

              <CardTitle className="text-cyan-700">Weather Safety Role Play</CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-600 mb-4">

                Interactive scenarios where children practice appropriate responses to different weather conditions and

                emergencies.

              </p>



              <div className="space-y-2 text-sm">

                <div className="flex items-center">

                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />

                  <span>30 minutes</span>

                </div>

                <div className="flex items-center">

                  <Music className="h-4 w-4 text-gray-400 mr-2" />

                  <span>Scenario cards, props, costumes</span>

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

                <li>"Clifford and the Big Storm" by Norman Bridwell</li>

                <li>"Storm Safety" by Christina Hill</li>

                <li>"Weather Safety Rules" by Martin Gitlin</li>

                <li>"Emergency Kit" by various authors</li>

                <li>"Being Prepared" by Cari Meister</li>

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

                <li>Emergency kit checklist for families</li>

                <li>Weather safety scenario cards</li>

                <li>Shelter building instruction templates</li>

                <li>"Be prepared; not scared" coloring pages</li>

                <li>Weather protection strategy cards</li>

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

                Send home a family emergency preparedness guide with the motto "Be prepared; not scared." Include a

                checklist for creating a family emergency kit and discussing weather safety at home.

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

          <Link to="/curriculum/kindergarten/weather/week-4">Previous Week: How Do We Know About Weather?</Link>

        </Button>

        <Link to="/curriculum/kindergarten/activities/weather-unit">

          <Button className="bg-purple-600 hover:bg-purple-700">

            <BookOpen className="mr-2 h-4 w-4" /> View All Activities

          </Button>

        </Link>

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/weather">Weather Unit Complete</Link>

        </Button>

      </div>

    </div>

  )

}
