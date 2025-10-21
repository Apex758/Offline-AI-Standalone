import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Cloud, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function WeatherWatchersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-sky-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">
            Weather Watchers
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            An ongoing Earth and Space Science investigation where students observe, record, and track daily weather
            patterns using simple tools and scientific methods.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-sky-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Weather Watchers transforms students into meteorologists as they systematically observe and document
                daily weather conditions over time. Through consistent data collection and the use of simple weather
                instruments, students develop scientific observation skills while building understanding of weather
                patterns and seasonal changes. This ongoing investigation helps students recognize patterns in nature
                and understand how weather affects our daily lives.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="./children-observing-weather-with-thermometer-and-we.png" alt="Weather Watchers Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Observe and describe daily weather conditions</li>
                <li>Use simple tools to measure temperature and precipitation</li>
                <li>Record weather data using symbols and charts</li>
                <li>Identify patterns in weather over time</li>
                <li>Understand how weather affects daily activities</li>
                <li>Develop scientific vocabulary related to weather</li>
                <li>Practice data collection and recording skills</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Earth and Space Science:</strong> Weather and seasonal changes
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Daily and seasonal weather patterns</li>
                  <li>Weather observation and measurement</li>
                  <li>How weather affects living things</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Scientific Inquiry:</strong> Data collection and analysis
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Making systematic observations</li>
                  <li>Using tools for measurement</li>
                  <li>Recording and organizing data</li>
                  <li>Identifying patterns over time</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-sky-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-sky-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Setup and Introduction (Day 1 - 20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Create a classroom weather station with chart and tools</li>
                    <li>Introduce weather vocabulary: sunny, cloudy, rainy, windy, hot, cold</li>
                    <li>Show students weather symbols and their meanings</li>
                    <li>Demonstrate how to read a thermometer</li>
                    <li>Explain the daily weather routine and assign weather helpers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-sky-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Daily Weather Observation (15 minutes daily)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Begin each day with weather observation time</li>
                    <li>Look outside and describe what students see and feel</li>
                    <li>Check the thermometer and record temperature</li>
                    <li>Measure any precipitation in the rain gauge</li>
                    <li>Select appropriate weather symbols for the day</li>
                    <li>Record observations on the class weather chart</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-sky-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Individual Weather Journals (10 minutes daily)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students record daily weather in personal journals</li>
                    <li>Draw pictures of the day's weather conditions</li>
                    <li>Write or dictate sentences describing the weather</li>
                    <li>Include temperature readings and weather symbols</li>
                    <li>Note how weather affects clothing choices and activities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-sky-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Weekly Pattern Analysis (20 minutes weekly)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Review the week's weather data as a class</li>
                    <li>Look for patterns: Which days were similar?</li>
                    <li>Compare temperatures throughout the week</li>
                    <li>Discuss how weather changed from day to day</li>
                    <li>Make predictions about next week's weather</li>
                    <li>Graph temperature data or count weather types</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-sky-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Monthly Weather Summary (30 minutes monthly)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Create graphs showing the month's weather patterns</li>
                    <li>Count how many sunny, cloudy, and rainy days occurred</li>
                    <li>Find the highest and lowest temperatures</li>
                    <li>Discuss seasonal changes observed</li>
                    <li>Compare to previous months' data</li>
                    <li>Share findings with other classes or families</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-sky-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-sky-50 p-3 rounded-md border border-sky-200">
                  <h3 className="text-md font-semibold mb-1 text-sky-700">Weather Predictions</h3>
                  <p className="text-sm">
                    Have students make daily weather predictions and compare them to actual conditions the next day.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Weather and Clothing</h3>
                  <p className="text-sm">
                    Connect weather observations to appropriate clothing choices and outdoor activities.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Weather Art</h3>
                  <p className="text-sm">
                    Create art projects that represent different weather conditions using various materials and
                    techniques.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Weather Stories</h3>
                  <p className="text-sm">
                    Write or tell stories about adventures in different types of weather conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-sky-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-sky-700">For Advanced Learners</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Research weather in different parts of the world</li>
                    <li>Create more detailed weather graphs and charts</li>
                    <li>Learn about weather instruments and how they work</li>
                    <li>Make connections between weather and seasonal changes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-sky-700">For Students Needing Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on basic weather types: sunny, cloudy, rainy</li>
                    <li>Use picture symbols instead of written descriptions</li>
                    <li>Work with a partner for observations and recording</li>
                    <li>Simplify temperature recording to hot, warm, cool, cold</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-sky-700">Language Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide weather vocabulary cards with pictures</li>
                    <li>Use gestures and actions to demonstrate weather words</li>
                    <li>Allow drawing with minimal writing requirements</li>
                    <li>Connect to weather words in students' home languages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-sky-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-sky-700">Weather Observation</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Makes accurate, detailed observations daily
                    </li>
                    <li>
                      <strong>Good:</strong> Makes consistent observations with some details
                    </li>
                    <li>
                      <strong>Developing:</strong> Makes basic observations with reminders
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs significant support for observations
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-sky-700">Data Recording</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Records data accurately and consistently
                    </li>
                    <li>
                      <strong>Good:</strong> Records most data with minimal errors
                    </li>
                    <li>
                      <strong>Developing:</strong> Records basic data with support
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs help with data recording
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-sky-700">Pattern Recognition</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Identifies multiple weather patterns
                    </li>
                    <li>
                      <strong>Good:</strong> Identifies some patterns with guidance
                    </li>
                    <li>
                      <strong>Developing:</strong> Recognizes basic patterns
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs support to see patterns
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-sky-50 p-6 rounded-xl shadow-md border border-sky-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-sky-800">Weather Station Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-sky-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Large weather chart for classroom display</li>
              <li>Weather symbols (laminated cards)</li>
              <li>Outdoor thermometer (large, easy-to-read)</li>
              <li>Simple rain gauge (clear container with measurements)</li>
              <li>Individual weather journals</li>
              <li>Pencils and colored pencils</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-sky-700">Setup Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Place thermometer in shaded area outside classroom window</li>
              <li>Position rain gauge away from buildings and trees</li>
              <li>Create a consistent daily routine for weather observation</li>
              <li>Assign rotating weather helper roles to students</li>
              <li>Keep extra materials available for replacements</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/science/material-sorters">
          <Button variant="outline" className="mr-4 bg-transparent">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous: Material Sorters
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/science/shadow-investigators">
          <Button className="bg-sky-600 hover:bg-sky-700">Next Activity: Shadow Investigators</Button>
        </Link>
      </div>
    </div>
  )
}
