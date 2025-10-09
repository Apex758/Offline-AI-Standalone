"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function ForcesInteractionsActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade3-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Forces and Interactions Activities</h1>
        <p className="text-gray-600">
          Explore hands-on activities that help students understand forces, motion, and their interactions.
        </p>
      </div>

      <Tabs defaultValue="pushpull" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="pushpull">Push & Pull Forces</TabsTrigger>
          <TabsTrigger value="balanced">Balanced & Unbalanced Forces</TabsTrigger>
          <TabsTrigger value="magnetic">Magnetic Forces</TabsTrigger>
          <TabsTrigger value="friction">Friction & Gravity</TabsTrigger>
        </TabsList>

        <TabsContent value="pushpull" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Push and Pull Forces</CardTitle>
              <CardDescription>
                Activities to help students identify and understand push and pull forces in everyday situations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Push or Pull Identification</h3>
                  <p className="mb-4">Students will identify whether actions show a push or pull force.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Push and Pull worksheet</li>
                      <li>Pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Distribute the worksheet to students</li>
                      <li>Have students look at each picture and determine if it shows a push or pull force</li>
                      <li>Students should place a checkmark in the appropriate column</li>
                      <li>Discuss the answers as a class</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder-g5qky.png"
                        alt="Push and Pull Forces Activity"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href="https://www.liveworksheets.com/w/en/science/1726952"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download Worksheet →
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Force Direction Game</h3>
                  <p className="mb-4">
                    Students will demonstrate understanding of push and pull forces through a physical activity.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Open space for movement</li>
                      <li>Various objects (balls, toy cars, etc.)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Arrange students in pairs</li>
                      <li>Provide each pair with an object</li>
                      <li>Call out "push" or "pull" and have students demonstrate the force</li>
                      <li>Ask students to describe what happens to the object when they push or pull it</li>
                      <li>Discuss how the direction of movement relates to the type of force applied</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Balanced and Unbalanced Forces</CardTitle>
              <CardDescription>
                Activities to help students understand how balanced and unbalanced forces affect motion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Tug of War Experiment</h3>
                  <p className="mb-4">
                    Students will experience balanced and unbalanced forces through a tug of war game.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Rope</li>
                      <li>Chalk (to mark the center line)</li>
                      <li>Open space</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Mark a center line with chalk</li>
                      <li>Divide students into two equal teams</li>
                      <li>Have teams pull on opposite ends of the rope</li>
                      <li>First, ensure teams are evenly matched to demonstrate balanced forces</li>
                      <li>Then, add more students to one side to demonstrate unbalanced forces</li>
                      <li>Discuss how balanced forces result in no movement, while unbalanced forces cause movement</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder-2rmq6.png"
                        alt="Tug of War Activity"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Balanced Forces Worksheet</h3>
                  <p className="mb-4">Students will identify balanced and unbalanced forces in different scenarios.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Balanced Forces worksheet</li>
                      <li>Pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Distribute the worksheet to students</li>
                      <li>
                        Have students look at each diagram and determine if it shows balanced or unbalanced forces
                      </li>
                      <li>Students should write "balanced forces" or "unbalanced forces" for each scenario</li>
                      <li>Discuss the answers as a class</li>
                    </ol>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href="https://www.k5learning.com/worksheets/science/grade-3-balanced-forces-d.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download Worksheet →
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="magnetic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Magnetic Forces</CardTitle>
              <CardDescription>
                Activities to help students understand magnetic forces and interactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Magnetic vs. Non-Magnetic Materials</h3>
                  <p className="mb-4">
                    Students will test various materials to determine if they are magnetic or non-magnetic.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Magnets (one per group)</li>
                      <li>Collection of items (paper clips, coins, rubber bands, aluminum foil, etc.)</li>
                      <li>Recording sheet</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Divide students into small groups</li>
                      <li>Provide each group with a magnet and collection of items</li>
                      <li>Have students predict which items will be attracted to the magnet</li>
                      <li>Students test each item and record their observations</li>
                      <li>Discuss which materials are magnetic and which are not</li>
                      <li>Introduce the concept that not all metals are magnetic</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/children-testing-magnets.png"
                        alt="Testing Magnetic Materials"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Make a Temporary Magnet</h3>
                  <p className="mb-4">Students will create a temporary magnet using a nail and a permanent magnet.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Iron nails</li>
                      <li>Permanent magnets</li>
                      <li>Paper clips</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Demonstrate how to magnetize a nail by stroking it with a magnet in one direction</li>
                      <li>Have students magnetize their own nails</li>
                      <li>Test the magnetized nails by seeing if they can pick up paper clips</li>
                      <li>Count how many paper clips each nail can pick up</li>
                      <li>Discuss how the nail became a temporary magnet</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friction" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Friction and Gravity</CardTitle>
              <CardDescription>
                Activities to help students understand friction and gravity as forces that affect motion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Friction Investigation</h3>
                  <p className="mb-4">
                    Students will investigate how different surfaces affect the movement of objects due to friction.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Toy cars or small objects with wheels</li>
                      <li>Various surfaces (carpet, tile, sandpaper, wax paper, etc.)</li>
                      <li>Ramp (can be made from cardboard)</li>
                      <li>Measuring tape or ruler</li>
                      <li>Recording sheet</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Set up a ramp at a consistent height</li>
                      <li>Place different surfaces at the bottom of the ramp</li>
                      <li>Have students predict which surface will allow the car to travel the farthest</li>
                      <li>Release the car from the top of the ramp and measure how far it travels on each surface</li>
                      <li>Record the results and discuss how friction affects the movement of the car</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=children+testing+friction+with+toy+cars"
                        alt="Friction Investigation"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Gravity Drop</h3>
                  <p className="mb-4">Students will investigate how gravity affects objects of different weights.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Various objects of different weights but similar size (e.g., ping pong ball, tennis ball,
                        marble)
                      </li>
                      <li>Measuring tape or ruler</li>
                      <li>Stopwatch</li>
                      <li>Recording sheet</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        Have students predict which object will hit the ground first when dropped from the same height
                      </li>
                      <li>Drop two objects simultaneously from the same height</li>
                      <li>Observe which object hits the ground first (if any)</li>
                      <li>Repeat with different combinations of objects</li>
                      <li>
                        Discuss how gravity affects all objects equally regardless of weight (in the absence of air
                        resistance)
                      </li>
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
