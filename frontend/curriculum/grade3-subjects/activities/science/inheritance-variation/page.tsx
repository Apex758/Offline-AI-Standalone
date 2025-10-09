"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function InheritanceVariationActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade3-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inheritance and Variation Activities</h1>
        <p className="text-gray-600">
          Explore activities that help students understand life cycles, inheritance of traits, and how traits can be
          influenced by the environment.
        </p>
      </div>

      <Tabs defaultValue="lifecycles" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="lifecycles">Life Cycles</TabsTrigger>
          <TabsTrigger value="traits">Inherited Traits</TabsTrigger>
          <TabsTrigger value="environment">Environmental Influence</TabsTrigger>
        </TabsList>

        <TabsContent value="lifecycles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Life Cycles</CardTitle>
              <CardDescription>
                Activities to help students understand that organisms have unique and diverse life cycles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Bean Plant Life Cycle Journal</h3>
                  <p className="mb-4">Students will grow bean plants and document their life cycle stages.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Bean seeds</li>
                      <li>Clear plastic bags</li>
                      <li>Paper towels</li>
                      <li>Water</li>
                      <li>Journals or observation sheets</li>
                      <li>Pencils and colored pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Wet a paper towel and place it inside a clear plastic bag</li>
                      <li>Place a bean seed on the paper towel</li>
                      <li>Seal the bag and tape it to a sunny window</li>
                      <li>Have students observe and draw the seed every few days</li>
                      <li>Students should record the date and any changes they observe</li>
                      <li>Discuss the stages of the plant life cycle as they occur</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=bean+plant+life+cycle+in+plastic+bag"
                        alt="Bean Plant Life Cycle"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Butterfly Puppet Play</h3>
                  <p className="mb-4">Students will create puppets to act out the life cycle of a butterfly.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Paper plates or construction paper</li>
                      <li>Craft sticks</li>
                      <li>Markers, crayons, colored pencils</li>
                      <li>Scissors</li>
                      <li>Glue or tape</li>
                      <li>Yarn or string (optional)</li>
                      <li>Script for puppet show</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Discuss the life cycle of a butterfly (egg, caterpillar, chrysalis, butterfly)</li>
                      <li>Have students create puppets for each stage of the life cycle</li>
                      <li>Provide a simple script or have students create their own</li>
                      <li>Students perform the puppet show to demonstrate the butterfly life cycle</li>
                      <li>Discuss how the butterfly changes throughout its life cycle</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=butterfly+life+cycle+puppets"
                        alt="Butterfly Life Cycle Puppets"
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

        <TabsContent value="traits" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inherited Traits</CardTitle>
              <CardDescription>
                Activities to help students understand that plants and animals have traits inherited from parents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Bird Bill Adaptations</h3>
                  <p className="mb-4">
                    Students will explore how different bird bill shapes are adapted for different functions.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Pictures of birds with different bill shapes</li>
                      <li>Various tools to represent different bill types (tweezers, clothespins, spoons, etc.)</li>
                      <li>Different types of "food" (seeds, gummy worms, marbles, etc.)</li>
                      <li>Containers</li>
                      <li>Recording sheet</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Show students pictures of birds with different bill shapes</li>
                      <li>Discuss how bill shape relates to the type of food the bird eats</li>
                      <li>Assign each student or group a different "bill" tool</li>
                      <li>Have students use their "bills" to pick up different types of "food"</li>
                      <li>Record which bill type works best for each food type</li>
                      <li>Discuss how bill shape is an inherited trait that helps birds survive</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=different+bird+beak+shapes+and+functions"
                        alt="Bird Bill Adaptations"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href="https://nhpbs.org/wild/birdcharacteristics.asp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Learn More About Bird Bills →
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Match the Parents with Their Offspring</h3>
                  <p className="mb-4">
                    Students will match animal parents with their offspring based on shared traits.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Pictures of animal parents</li>
                      <li>Pictures of animal offspring</li>
                      <li>Worksheet or chart</li>
                      <li>Pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Provide students with pictures of various animal parents and their offspring</li>
                      <li>Have students match the parents with their offspring</li>
                      <li>Ask students to identify the traits that helped them make the matches</li>
                      <li>Discuss how offspring inherit traits from their parents</li>
                      <li>Extend the activity by discussing variations among siblings</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=animal+parents+and+their+offspring"
                        alt="Animal Parents and Offspring"
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

        <TabsContent value="environment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Influence on Traits</CardTitle>
              <CardDescription>
                Activities to help students understand how traits can be influenced by the environment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Plant Growth Experiment</h3>
                  <p className="mb-4">Students will investigate how environmental factors affect plant growth.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Bean or radish seeds</li>
                      <li>Small pots or cups</li>
                      <li>Soil</li>
                      <li>Water</li>
                      <li>Different growing conditions (sunny window, dark closet, refrigerator, etc.)</li>
                      <li>Measuring tools (ruler)</li>
                      <li>Recording sheet</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Plant seeds in identical pots with the same amount of soil</li>
                      <li>Place pots in different environmental conditions</li>
                      <li>Water all plants with the same amount of water</li>
                      <li>Have students observe and measure plant growth over several weeks</li>
                      <li>Record observations and measurements</li>
                      <li>Discuss how environmental factors affected plant growth</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=plant+growth+experiment+different+conditions"
                        alt="Plant Growth Experiment"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Activity 2: Design an Animal for a Specific Environment
                  </h3>
                  <p className="mb-4">Students will design an imaginary animal adapted to a specific environment.</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Paper</li>
                      <li>Colored pencils, markers, or crayons</li>
                      <li>Description cards of different environments</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Assign each student or group a specific environment (desert, arctic, rainforest, etc.)</li>
                      <li>Discuss the challenges animals face in each environment</li>
                      <li>
                        Have students design an imaginary animal with traits that would help it survive in that
                        environment
                      </li>
                      <li>Students should draw their animal and write a description of its traits</li>
                      <li>Have students present their animals to the class</li>
                      <li>Discuss how environmental conditions influence the traits animals need to survive</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=children+designing+animals+for+different+environments"
                        alt="Design an Animal Activity"
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
