"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function WeatherClimateActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade3-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weather and Climate Activities</h1>
        <p className="text-gray-600">
          Explore activities that help students understand weather patterns, climate in different regions, and solutions
          to weather-related hazards.
        </p>
      </div>

      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="patterns">Weather Patterns</TabsTrigger>
          <TabsTrigger value="climate">Climate Regions</TabsTrigger>
          <TabsTrigger value="hazards">Weather Hazards</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weather Patterns</CardTitle>
              <CardDescription>
                Activities to help students collect and represent data about weather patterns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Weather Journal</h3>
                  <p className="mb-4">Students will create a journal to track and record weather data over time.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Notebook or journal pages</li>
                      <li>Pencils and colored pencils</li>
                      <li>Weather symbols chart</li>
                      <li>Thermometer (if available)</li>
                      <li>Rain gauge (can be homemade)</li>
                      <li>Wind direction indicator (can be homemade)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create a weather journal with pages for each day of observation</li>
                      <li>Each day, have students record the date and time of observation</li>
                      <li>Students should record temperature, precipitation, wind direction, and cloud cover</li>
                      <li>Use drawings or symbols to represent weather conditions</li>
                      <li>After a week or month, analyze the data to identify patterns</li>
                      <li>Create graphs to represent the collected data</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=children+recording+weather+data+in+journal"
                        alt="Weather Journal"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Make Your Own Weather Instruments</h3>
                  <p className="mb-4">
                    Students will create simple weather instruments to measure different weather conditions.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>For Rain Gauge: Clear plastic bottle, ruler, marker, scissors</li>
                      <li>For Anemometer: Paper cups, straws, pencil with eraser, pin, scissors</li>
                      <li>For Wind Vane: Cardboard, straw, pencil with eraser, pin, compass</li>
                      <li>For Thermometer: Small plastic bottle, water, food coloring, clear straw, modeling clay</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Divide students into groups</li>
                      <li>Assign each group a weather instrument to create</li>
                      <li>Provide instructions for making each instrument</li>
                      <li>Have students test their instruments</li>
                      <li>Use the instruments to collect weather data</li>
                      <li>Discuss how each instrument works and what it measures</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=homemade+weather+instruments+for+kids"
                        alt="Homemade Weather Instruments"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href="https://www.youtube.com/watch?v=Rh18GMwwV4M"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Rain Gauge Tutorial →
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="climate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Climate Regions</CardTitle>
              <CardDescription>
                Activities to help students understand different climate regions around the world.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Climate Zone Map</h3>
                  <p className="mb-4">Students will create a world map showing different climate zones.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>World map outline</li>
                      <li>Colored pencils or markers</li>
                      <li>Information about climate zones</li>
                      <li>Pictures of different climate regions</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Discuss the three major climate zones (polar/frigid, temperate, tropical/torrid)</li>
                      <li>Show students where these zones are located on a world map</li>
                      <li>Have students color their own maps to show the different climate zones</li>
                      <li>Students can add pictures or drawings of plants and animals found in each zone</li>
                      <li>Discuss how latitude affects climate</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=world+map+climate+zones"
                        alt="Climate Zone Map"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href="https://www.liveworksheets.com/w/en/social-studies/1162764"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Climate Zones Worksheet →
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Climate Postcard Project</h3>
                  <p className="mb-4">
                    Students will create postcards depicting different climate regions around the world.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Index cards or cardstock cut to postcard size</li>
                      <li>Colored pencils, markers, or crayons</li>
                      <li>Information about different climate regions</li>
                      <li>Pictures of different climate regions (optional)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Assign each student a specific climate region or country</li>
                      <li>Have students research the climate of their assigned region</li>
                      <li>
                        Students create a postcard showing the climate, including typical weather, plants, animals, and
                        clothing people wear
                      </li>
                      <li>
                        On the back of the postcard, students write a message as if they were visiting that region
                      </li>
                      <li>Students share their postcards with the class</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=climate+region+postcards+student+project"
                        alt="Climate Postcards"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hazards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weather Hazards</CardTitle>
              <CardDescription>
                Activities to help students understand weather-related hazards and design solutions to reduce their
                impacts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Design Challenge - Flood Protection</h3>
                  <p className="mb-4">Students will design and test structures to protect against flooding.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Plastic tubs or trays</li>
                      <li>Clay or playdough</li>
                      <li>Small houses or buildings (can be made from paper)</li>
                      <li>Various materials for building barriers (popsicle sticks, straws, rocks, etc.)</li>
                      <li>Water</li>
                      <li>Measuring cup</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create a model landscape with clay in a plastic tub</li>
                      <li>Place small houses or buildings on the landscape</li>
                      <li>Have students design barriers or structures to protect against flooding</li>
                      <li>Test the designs by pouring water into the tub</li>
                      <li>Observe which designs are most effective</li>
                      <li>Discuss how these designs could be applied in real-world situations</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=flood+protection+model+classroom+activity"
                        alt="Flood Protection Design Challenge"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Weather Hazard Warning Posters</h3>
                  <p className="mb-4">
                    Students will create posters to inform others about weather hazards and safety measures.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Large paper or poster board</li>
                      <li>Markers, colored pencils, or crayons</li>
                      <li>Information about different weather hazards</li>
                      <li>Pictures of weather hazards (optional)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Assign each student or group a specific weather hazard (hurricane, flood, tornado, etc.)</li>
                      <li>Have students research their assigned hazard</li>
                      <li>
                        Students create posters that include information about the hazard, warning signs, and safety
                        measures
                      </li>
                      <li>Students present their posters to the class</li>
                      <li>Display posters in the classroom or school hallway</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=weather+hazard+warning+posters+classroom"
                        alt="Weather Hazard Warning Posters"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href="https://www.k5learning.com/worksheets/science/grade-3-weather-hazards-b.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Weather Hazards Worksheet →
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
