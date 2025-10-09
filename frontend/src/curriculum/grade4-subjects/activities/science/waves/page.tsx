"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function WavesActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade4-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Waves Activities</h1>
        <p className="text-gray-600">
          Investigate wave patterns, amplitude, wavelength, and how waves transfer information.
        </p>
      </div>

      <Tabs defaultValue="light" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="light">Light Waves</TabsTrigger>
          <TabsTrigger value="sound">Sound Waves</TabsTrigger>
          <TabsTrigger value="information">Wave Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="light" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Light Waves</CardTitle>
              <CardDescription>
                Activities to help students understand the properties of light waves, such as reflection and refraction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Reflection Experiment</h3>
                  <p className="mb-4">
                    Students will explore how light reflects off different surfaces and create a periscope.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Mirrors</li>
                      <li>Cardboard box</li>
                      <li>Scissors</li>
                      <li>Tape</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Cut holes in the cardboard box.</li>
                      <li>Place mirrors inside the box at an angle.</li>
                      <li>Observe how light reflects through the periscope.</li>
                      <li>Discuss the law of reflection.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=periscope+reflection+light+waves"
                        alt="Reflection Experiment"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Water Wave Creation</h3>
                  <p className="mb-4">
                    Students will observe wave patterns in water and understand basic wave properties.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Clear container with water</li>
                      <li>Small stones</li>
                      <li>Small floating objects (cork, paper clips)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Drop stones in water container with floating objects.</li>
                      <li>Observe circular wave patterns moving outward.</li>
                      <li>Note that objects move up/down but don't travel with waves.</li>
                      <li>Discuss how waves transfer energy without transferring matter.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=water+waves+ripples+circular+pattern"
                        alt="Water Wave Creation"
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

        <TabsContent value="sound" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sound Waves</CardTitle>
              <CardDescription>
                Activities to help students understand the properties of sound waves, such as frequency and amplitude.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Sound Frequency</h3>
                  <p className="mb-4">Students will investigate how the frequency of a sound wave affects the pitch.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tuning forks</li>
                      <li>Glass bottles</li>
                      <li>Water</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Fill glass bottles with different amounts of water.</li>
                      <li>Strike the tuning forks and hold them over the bottles.</li>
                      <li>Observe how the pitch changes with different water levels.</li>
                      <li>Discuss the relationship between frequency and pitch.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=sound+frequency+pitch+tuning+forks"
                        alt="Sound Frequency"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Slinky Wave Experiments</h3>
                  <p className="mb-4">
                    Students will use a slinky to explore different types of waves and their properties.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Metal slinky</li>
                      <li>Ribbon</li>
                      <li>Open floor space</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        <strong>Transverse waves</strong>: Move slinky side to side.
                      </li>
                      <li>
                        <strong>Longitudinal waves</strong>: Push and pull slinky forward/backward.
                      </li>
                      <li>Tie ribbon to observe particle movement.</li>
                      <li>Identify compressions and rarefactions in longitudinal waves.</li>
                      <li>Compare to sound waves traveling through air.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=slinky+wave+transverse+longitudinal+demonstration"
                        alt="Slinky Wave Experiments"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Sound Travel Through Materials</h3>
                  <p className="mb-4">Students will investigate how sound travels through different materials.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Empty bottles</li>
                      <li>Water-filled bottles</li>
                      <li>Wooden blocks</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Use pairs of bottles (empty, water-filled) and wooden blocks.</li>
                      <li>Have partner tap bottles while listening through each.</li>
                      <li>Compare sound transmission through air, water, and solids.</li>
                      <li>Record observations about sound clarity and volume.</li>
                      <li>Discuss which materials conduct sound best and why.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="information" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Wave Applications</CardTitle>
              <CardDescription>
                Activities to help students understand how waves are used to transfer information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Morse Code</h3>
                  <p className="mb-4">
                    Students will learn and use Morse code to send and receive messages using light or sound.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Morse code chart</li>
                      <li>Flashlights</li>
                      <li>Buzzers</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Learn the Morse code chart.</li>
                      <li>Use flashlights or buzzers to send messages in Morse code.</li>
                      <li>Decode messages received from others.</li>
                      <li>Discuss how waves are used to transfer information.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=morse+code+light+sound+communication"
                        alt="Morse Code"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: String Telephone Investigation</h3>
                  <p className="mb-4">
                    Students will build and test string telephones to understand sound transmission.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Paper cups of different sizes</li>
                      <li>String of different thicknesses</li>
                      <li>Paperclips</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        <strong>Experiment 1</strong>: Compare cup sizes and string types.
                      </li>
                      <li>
                        <strong>Experiment 2</strong>: Test different string materials.
                      </li>
                      <li>
                        <strong>Experiment 3</strong>: Compare cup sizes.
                      </li>
                      <li>Analyze which combinations produce clearest sound.</li>
                      <li>Discuss how sound waves travel through the string.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=string+telephone+cups+communication"
                        alt="String Telephone Investigation"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Binary Code Activities</h3>
                  <p className="mb-4">
                    Students will learn how information can be encoded and transmitted using binary code.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Grid paper</li>
                      <li>Black and white markers</li>
                      <li>Binary code reference sheet</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create 8x8 grid images using black and white squares.</li>
                      <li>Convert images to binary code (0s and 1s).</li>
                      <li>Exchange codes with classmates for decoding.</li>
                      <li>Use online binary image tools if technology available.</li>
                      <li>Discuss how computers use binary code to transmit information.</li>
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
