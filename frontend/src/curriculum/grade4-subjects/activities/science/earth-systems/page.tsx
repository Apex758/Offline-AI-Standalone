"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function EarthSystemsActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade4-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Earth Systems Activities</h1>
        <p className="text-gray-600">
          Explore patterns of Earth’s features and how natural processes change landscapes over time.
        </p>
      </div>

      <Tabs defaultValue="rocks" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="rocks">Rock Formations</TabsTrigger>
          <TabsTrigger value="erosion">Weathering & Erosion</TabsTrigger>
          <TabsTrigger value="resources">Natural Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="rocks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rock Formations</CardTitle>
              <CardDescription>
                Activities to help students understand how rock formations change over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Rock Cycle Model</h3>
                  <p className="mb-4">
                    Students will create a model of the rock cycle to understand how rocks change over time.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Crayons</li>
                      <li>Paper</li>
                      <li>Scissors</li>
                      <li>Glue</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Draw a diagram of the rock cycle.</li>
                      <li>Label the different types of rocks (igneous, sedimentary, metamorphic).</li>
                      <li>Explain the processes that change rocks from one type to another.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=rock+cycle+model+diagram"
                        alt="Rock Cycle Model"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Rock Classification Field Trip</h3>
                  <p className="mb-4">
                    Students will collect and classify rocks based on their properties and formation.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Collection bags</li>
                      <li>Magnifying glasses</li>
                      <li>Rock identification charts</li>
                      <li>Notebooks</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Collect rock samples from local area.</li>
                      <li>Sort rocks into igneous, sedimentary, and metamorphic categories.</li>
                      <li>Use identification charts based on color, texture, and layers.</li>
                      <li>Create presentation of findings.</li>
                      <li>Discuss how each type of rock forms.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=rock+classification+collection+samples"
                        alt="Rock Classification"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Fossil Analysis Activities</h3>
                  <p className="mb-4">Students will examine fossils to learn about past environments and organisms.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Fossil samples or images</li>
                      <li>Magnifying glasses</li>
                      <li>Drawing materials</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Examine marine shell fossils vs. plant fossils in different layers.</li>
                      <li>Interpret what different fossil types reveal about past environments.</li>
                      <li>Research climate indicators from fossil evidence.</li>
                      <li>Create drawings showing landscape changes over time.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erosion" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weathering & Erosion</CardTitle>
              <CardDescription>
                Activities to help students understand the effects of weathering and erosion on landscapes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Erosion Simulation</h3>
                  <p className="mb-4">Students will simulate erosion using a stream table and different materials.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Stream table</li>
                      <li>Sand</li>
                      <li>Soil</li>
                      <li>Water</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Set up a stream table with sand and soil.</li>
                      <li>Pour water over the surface and observe the erosion.</li>
                      <li>Change the slope and observe how the rate of erosion changes.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=erosion+simulation+stream+table"
                        alt="Erosion Simulation"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Types of Weathering Demonstration</h3>
                  <p className="mb-4">Students will observe and compare different types of weathering processes.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ice cube trays</li>
                      <li>Limestone or chalk</li>
                      <li>Vinegar</li>
                      <li>Plant seeds</li>
                      <li>Plaster of Paris blocks</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        <strong>Mechanical weathering</strong>: Freeze water in cracks of plaster blocks, observe
                        expansion.
                      </li>
                      <li>
                        <strong>Chemical weathering</strong>: Pour vinegar on limestone/chalk, observe bubbling
                        reaction.
                      </li>
                      <li>
                        <strong>Biological weathering</strong>: Grow plant seeds in cracks of plaster, observe root
                        growth.
                      </li>
                      <li>Document changes over time with photographs.</li>
                      <li>Discuss which type of weathering works fastest.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=weathering+types+mechanical+chemical+biological"
                        alt="Types of Weathering"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Water Table Erosion Experiments</h3>
                  <p className="mb-4">
                    Students will investigate factors that affect erosion using a water table model.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Wooden box water table</li>
                      <li>Sand</li>
                      <li>Pebbles</li>
                      <li>Various mulch materials</li>
                      <li>Water source</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        <strong>Experiment 1</strong>: Test different slope angles (4cm to 19cm height).
                      </li>
                      <li>
                        <strong>Experiment 2</strong>: Add pebble "check dams" across gullies.
                      </li>
                      <li>
                        <strong>Experiment 3</strong>: Compare parallel vs. perpendicular furrows.
                      </li>
                      <li>
                        <strong>Experiment 4</strong>: Test different mulch types (hay, leaves, paper).
                      </li>
                      <li>Record observations and discuss erosion prevention methods.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Natural Resources</CardTitle>
              <CardDescription>
                Activities to help students understand how natural resources are used and their impact on the
                environment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Resource Mapping</h3>
                  <p className="mb-4">
                    Students will create a map of their local area showing the location of different natural resources.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Map of local area</li>
                      <li>Markers</li>
                      <li>Pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Provide students with a map of their local area.</li>
                      <li>
                        Have students identify and mark the location of different natural resources (forests, rivers,
                        etc.).
                      </li>
                      <li>Discuss how these resources are used and their impact on the environment.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=natural+resources+map+local+area"
                        alt="Resource Mapping"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Natural Disaster Preparedness</h3>
                  <p className="mb-4">Students will learn about natural disasters and how to prepare for them.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Building materials (straws, popsicle sticks, play dough)</li>
                      <li>Fan</li>
                      <li>Spray bottle</li>
                      <li>Earthquake simulator (shake table)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Design and construct model buildings for different disaster scenarios.</li>
                      <li>Test earthquake-resistant structures using shake table.</li>
                      <li>Test hurricane-resistant houses with fan (wind) and spray bottle (rain).</li>
                      <li>Design flood protection solutions.</li>
                      <li>Present designs explaining structural choices.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=natural+disaster+resistant+building+models"
                        alt="Natural Disaster Preparedness"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Tectonic Plate Activities</h3>
                  <p className="mb-4">
                    Students will learn about tectonic plates and their role in shaping Earth's surface.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>World map puzzles</li>
                      <li>Clay or play dough</li>
                      <li>Earthquake and volcano location maps</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Use puzzles showing continental drift from Pangaea.</li>
                      <li>Create clay models of different plate boundaries.</li>
                      <li>Map volcanic and earthquake locations relative to plate boundaries.</li>
                      <li>Discuss the relationship between plate boundaries and natural disasters.</li>
                    </ol>
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
