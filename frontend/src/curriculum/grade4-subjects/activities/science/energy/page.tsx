"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function EnergyActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade4-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Energy Activities</h1>
        <p className="text-gray-600">
          Explore different forms of energy, energy transfer, and how energy from natural resources affects the
          environment.
        </p>
      </div>

      <Tabs defaultValue="forms" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="forms">Forms of Energy</TabsTrigger>
          <TabsTrigger value="transfer">Energy Transfer</TabsTrigger>
          <TabsTrigger value="resources">Energy Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Forms of Energy</CardTitle>
              <CardDescription>
                Activities to help students understand different forms of energy, such as kinetic, potential, and
                thermal energy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Kinetic and Potential Energy</h3>
                  <p className="mb-4">
                    Students will explore the difference between kinetic and potential energy through hands-on
                    experiments.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ramp</li>
                      <li>Toy car</li>
                      <li>Measuring tape</li>
                      <li>Books</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Set up a ramp using books and a flat surface.</li>
                      <li>Release the toy car from different heights on the ramp.</li>
                      <li>Measure the distance the car travels each time.</li>
                      <li>
                        Discuss how the car's potential energy changes with height and how it converts to kinetic
                        energy.
                      </li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/toy-car-ramp-energy.png"
                        alt="Kinetic and Potential Energy"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Effect of Speed on Energy</h3>
                  <p className="mb-4">
                    Students will experience how speed affects energy through a simple demonstration.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Crushed paper balls</li>
                      <li>Open space</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Two students stand 2 meters apart with Person 1 facing away.</li>
                      <li>Person 2 throws crushed paper ball slowly at Person 1's back.</li>
                      <li>Person 2 then throws another paper ball with greater speed.</li>
                      <li>Compare the impact felt to understand speed-energy relationship.</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Pendulum Energy Investigation</h3>
                  <p className="mb-4">Students will observe energy conversion in a pendulum system.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>String</li>
                      <li>Small weight</li>
                      <li>Support stand</li>
                      <li>Numbered positions (1-5)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Set up pendulum with numbered positions (1-5).</li>
                      <li>Students identify where potential energy is highest (positions 1 & 5).</li>
                      <li>Identify where kinetic energy is highest (position 3).</li>
                      <li>Discuss energy conversion during pendulum motion.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/pendulum-energy-conversion.png"
                        alt="Pendulum Energy Investigation"
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

        <TabsContent value="transfer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Energy Transfer</CardTitle>
              <CardDescription>
                Activities to help students understand how energy can be transferred from one object to another.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Heat Transfer</h3>
                  <p className="mb-4">
                    Students will investigate how heat energy is transferred through conduction, convection, and
                    radiation.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Metal spoon</li>
                      <li>Plastic spoon</li>
                      <li>Cup of hot water</li>
                      <li>Ice cubes</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Place both spoons in a cup of hot water.</li>
                      <li>Observe which spoon heats up faster.</li>
                      <li>
                        Place ice cubes on different surfaces (metal, wood, plastic) and observe which melts faster.
                      </li>
                      <li>Discuss how heat is transferred in each scenario.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/heat-transfer-methods.png"
                        alt="Heat Transfer"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Energy Transformation Stations</h3>
                  <p className="mb-4">
                    Students will rotate through stations to observe different types of energy transformations.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Electric kettle</li>
                      <li>Cell phone</li>
                      <li>Remote-control car</li>
                      <li>Fan</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        <strong>Station 1</strong>: Electric kettle boiling water (electrical → heat → sound)
                      </li>
                      <li>
                        <strong>Station 2</strong>: Cell phone playing video (chemical → electrical → light + sound +
                        heat)
                      </li>
                      <li>
                        <strong>Station 3</strong>: Remote-control car (chemical → electrical → kinetic + sound + heat)
                      </li>
                      <li>
                        <strong>Station 4</strong>: Fan cooling room (electrical → kinetic + sound + heat)
                      </li>
                      <li>Students record observations at each station.</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Simple Circuit Construction</h3>
                  <p className="mb-4">Students will build a simple circuit to observe energy transformations.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Batteries</li>
                      <li>Connecting wires</li>
                      <li>Switch</li>
                      <li>Light bulb</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Build working circuit following the diagram.</li>
                      <li>Observe what happens when the switch is closed.</li>
                      <li>Identify electrical → light + heat energy conversion.</li>
                      <li>Discuss other energy transformations in the circuit.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/simple-electrical-circuit.png"
                        alt="Simple Circuit Construction"
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

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Energy Resources</CardTitle>
              <CardDescription>
                Activities to help students understand different energy resources and their impact on the environment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Renewable vs. Non-Renewable</h3>
                  <p className="mb-4">
                    Students will classify different energy resources as renewable or non-renewable and discuss their
                    environmental impact.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cards with different energy resources (solar, wind, coal, oil, etc.)</li>
                      <li>Chart paper</li>
                      <li>Markers</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Divide students into groups.</li>
                      <li>Provide each group with cards and chart paper.</li>
                      <li>Have students classify the resources as renewable or non-renewable.</li>
                      <li>Discuss the environmental impact of each resource.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/renewable-non-renewable-energy.png"
                        alt="Renewable vs. Non-Renewable"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Solar Oven Construction</h3>
                  <p className="mb-4">Students will design and build a solar oven to harness solar energy.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Pizza box</li>
                      <li>Aluminum foil</li>
                      <li>Black paper</li>
                      <li>Plastic wrap</li>
                      <li>Thermometer</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Cut a flap in the pizza box lid and line it with foil.</li>
                      <li>Line the bottom of the box with black paper.</li>
                      <li>Cover the opening with plastic wrap to trap heat.</li>
                      <li>Place the oven in sunlight and measure temperature changes.</li>
                      <li>Test cooking capability with simple foods.</li>
                      <li>Graph temperature vs. time data.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/solar-oven-pizza-box.png"
                        alt="Solar Oven Construction"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Fossil Fuel Extraction Simulation</h3>
                  <p className="mb-4">
                    Students will simulate fossil fuel extraction and discuss environmental impacts.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Chocolate chip cookies</li>
                      <li>Toothpicks</li>
                      <li>Paper</li>
                      <li>Colored pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Students draw the "habitat" (cookie) before mining.</li>
                      <li>Extract "fossil fuels" (chocolate chips) with toothpicks.</li>
                      <li>Draw habitat after "mining" is complete.</li>
                      <li>Discuss environmental impact of extraction.</li>
                      <li>Compare to real-world fossil fuel extraction.</li>
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
