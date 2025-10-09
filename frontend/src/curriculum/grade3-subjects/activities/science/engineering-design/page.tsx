"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function EngineeringDesignActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade3-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Engineering Design Activities</h1>
        <p className="text-gray-600">
          Explore activities that help students understand the engineering design process and solve real-world problems.
        </p>
      </div>

      <Tabs defaultValue="process" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="process">Design Process</TabsTrigger>
          <TabsTrigger value="weather">Weather Solutions</TabsTrigger>
          <TabsTrigger value="challenges">Design Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Engineering Design Process</CardTitle>
              <CardDescription>
                Activities to help students understand the steps of the engineering design process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Activity 1: Introduction to the Engineering Design Process
                  </h3>
                  <p className="mb-4">
                    Students will learn about the steps of the engineering design process through a simple activity.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Engineering design process poster or handout</li>
                      <li>Paper</li>
                      <li>Pencils</li>
                      <li>Markers or colored pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Introduce the engineering design process: Ask, Imagine, Plan, Create, Improve</li>
                      <li>Discuss each step and what engineers do during that step</li>
                      <li>Have students create a visual representation of the engineering design process</li>
                      <li>Students can draw pictures or write descriptions for each step</li>
                      <li>Discuss how engineers use this process to solve problems</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=engineering+design+process+for+kids"
                        alt="Engineering Design Process"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Problem-Solution Matching</h3>
                  <p className="mb-4">Students will match engineering problems with potential solutions.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cards with engineering problems</li>
                      <li>Cards with potential solutions</li>
                      <li>Paper</li>
                      <li>Pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        Create cards with different engineering problems (e.g., crossing a river, protecting from rain)
                      </li>
                      <li>Create cards with potential solutions (e.g., bridge, umbrella)</li>
                      <li>Mix up the cards and distribute them to students</li>
                      <li>Have students find their matching problem-solution pairs</li>
                      <li>Discuss how engineers identify problems and develop solutions</li>
                      <li>Extend the activity by having students come up with alternative solutions</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weather-Related Solutions</CardTitle>
              <CardDescription>
                Activities to help students design solutions to weather-related problems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Retaining Wall Design Challenge</h3>
                  <p className="mb-4">
                    Students will design and test materials to plug a hole in a retaining wall during flooding.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Two Styrofoam cups</li>
                      <li>A liter container of water</li>
                      <li>Sample blocking agents (paper towel, kitchen sponge, polyester fill or fabric)</li>
                      <li>A measuring cylinder or graduated cup</li>
                      <li>A timer</li>
                      <li>Pencil (for poking hole)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Use a pencil to poke a hole in the bottom of one of the Styrofoam cups</li>
                      <li>Place a small piece of paper towel over the hole on the inside of the cup</li>
                      <li>Place this cup with the hole inside the cup without a hole</li>
                      <li>Have a partner time 30 seconds while you half fill the inside cup with water</li>
                      <li>Withdraw the inside cup from the outside cup and measure how much water went through</li>
                      <li>Repeat with the kitchen sponge and then the polyester fill/fabric</li>
                      <li>Make a data table to compare which material was most effective at blocking the hole</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=retaining+wall+design+challenge+classroom+activity"
                        alt="Retaining Wall Design Challenge"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href="https://www.teachengineering.org/lessons/view/umo_challenges_lesson01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Design Challenge Worksheet →
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Roof Design for Hurricane Protection</h3>
                  <p className="mb-4">Students will compare different roof designs for hurricane resistance.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cardboard or foam board</li>
                      <li>Scissors</li>
                      <li>Glue or tape</li>
                      <li>Fan or hair dryer (to simulate wind)</li>
                      <li>Small weights (to test stability)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Discuss different roof designs (flat, pitched, gabled, hipped)</li>
                      <li>Have students build simple house models with different roof designs</li>
                      <li>Test each design by exposing it to "wind" from a fan or hair dryer</li>
                      <li>Add small weights to test the stability of each design</li>
                      <li>Record which designs are most resistant to wind</li>
                      <li>Discuss why certain designs perform better than others</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=roof+design+hurricane+resistance+classroom+activity"
                        alt="Roof Design for Hurricane Protection"
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

        <TabsContent value="challenges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Challenges</CardTitle>
              <CardDescription>Additional engineering design challenges for students to solve.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Flood Protection System</h3>
                  <p className="mb-4">Students will design and build a system to protect a community from flooding.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Aluminum pan (with one end removed)</li>
                      <li>Plasticine or clay</li>
                      <li>Small model houses (can be made from paper)</li>
                      <li>Plastic tub (to collect water)</li>
                      <li>Water</li>
                      <li>Various materials for building levees (clay, rocks, sticks, etc.)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create a model of a floodplain using an aluminum pan covered with plasticine</li>
                      <li>Shape the clay to create a river with a narrow section</li>
                      <li>Place model houses on the riverbank</li>
                      <li>Pour water through the river and observe what happens</li>
                      <li>Have students design and build levees to protect the houses</li>
                      <li>Test the designs by pouring water through the river again</li>
                      <li>Discuss which designs were most effective and why</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=flood+protection+system+model+classroom+activity"
                        alt="Flood Protection System"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Lightning Rod Design</h3>
                  <p className="mb-4">
                    Students will learn about lightning rods and design a system to protect a building.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cardboard boxes (to represent buildings)</li>
                      <li>Aluminum foil</li>
                      <li>Straws or skewers</li>
                      <li>Copper wire</li>
                      <li>Tape</li>
                      <li>Scissors</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Discuss how lightning rods work to protect buildings</li>
                      <li>Have students design a lightning rod system for a model building</li>
                      <li>Students should create a rod that extends above the building</li>
                      <li>Connect the rod to a "ground" using copper wire</li>
                      <li>Students should explain how their design would protect the building</li>
                      <li>Discuss the importance of proper grounding in lightning protection</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=lightning+rod+design+classroom+activity"
                        alt="Lightning Rod Design"
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
      </Tabs>
    </div>
  )
}
