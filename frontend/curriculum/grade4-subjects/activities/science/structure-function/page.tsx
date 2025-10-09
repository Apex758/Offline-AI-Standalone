"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function StructureFunctionActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade4-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Structure and Function Activities</h1>
        <p className="text-gray-600">
          Learn about internal and external structures of plants and animals and how they support survival, growth,
          behavior, and reproduction.
        </p>
      </div>

      <Tabs defaultValue="plants" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="plants">Plant Structures</TabsTrigger>
          <TabsTrigger value="animals">Animal Structures</TabsTrigger>
          <TabsTrigger value="adaptations">Adaptations</TabsTrigger>
        </TabsList>

        <TabsContent value="plants" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Plant Structures</CardTitle>
              <CardDescription>
                Activities to help students understand the structures of plants and their functions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Plant Dissection</h3>
                  <p className="mb-4">
                    Students will dissect a flower to identify and understand the function of each part.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Flowers</li>
                      <li>Magnifying glasses</li>
                      <li>Tweezers</li>
                      <li>Paper</li>
                      <li>Pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Provide each student with a flower.</li>
                      <li>
                        Have students dissect the flower and identify the different parts (petals, sepals, stamen,
                        pistil).
                      </li>
                      <li>Use magnifying glasses to observe the structures closely.</li>
                      <li>Discuss the function of each part in the plant's reproduction.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=flower+dissection+plant+structures"
                        alt="Plant Dissection"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Transpiration Demonstration</h3>
                  <p className="mb-4">
                    Students will observe how water moves through plants and evaporates from leaves.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>White carnations or celery stalks</li>
                      <li>Food coloring</li>
                      <li>Clear cups</li>
                      <li>Water</li>
                      <li>Plastic bags</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Sketch and label plant parts.</li>
                      <li>Place white carnation or celery in colored water.</li>
                      <li>Observe how colored water moves up through the stem.</li>
                      <li>Place plastic bag over some leaves to observe water collection.</li>
                      <li>Explain importance of transpiration for plant survival.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=plant+transpiration+colored+water+experiment"
                        alt="Transpiration Demonstration"
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

        <TabsContent value="animals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Animal Structures</CardTitle>
              <CardDescription>
                Activities to help students understand the structures of animals and their functions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Animal Adaptations</h3>
                  <p className="mb-4">
                    Students will research and present on how different animal adaptations help them survive in their
                    environment.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Research materials (books, internet)</li>
                      <li>Paper</li>
                      <li>Pencils</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Assign each student an animal to research.</li>
                      <li>Have students research the animal's adaptations and how they help it survive.</li>
                      <li>Students will present their findings to the class.</li>
                      <li>Discuss the importance of adaptations for survival.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=animal+adaptations+survival"
                        alt="Animal Adaptations"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Human Survival Features Analysis</h3>
                  <p className="mb-4">
                    Students will examine how human body parts aid survival and compare with other animals.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Human body diagram</li>
                      <li>Animal comparison charts</li>
                      <li>Worksheets</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Examine how human body parts aid survival:</li>
                      <li>Teeth for food processing</li>
                      <li>Arms for reaching and tool use</li>
                      <li>Legs for mobility and escape</li>
                      <li>Senses for detecting danger and finding food</li>
                      <li>Compare human features with those of other animals</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=human+body+survival+adaptations+comparison"
                        alt="Human Survival Features"
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

        <TabsContent value="adaptations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Adaptations</CardTitle>
              <CardDescription>
                Activities to help students understand how adaptations support survival, growth, behavior, and
                reproduction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Activity 1: Camouflage</h3>
                  <p className="mb-4">
                    Students will explore how camouflage helps animals survive by blending into their environment.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Pictures of camouflaged animals</li>
                      <li>Construction paper</li>
                      <li>Markers</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Show students pictures of camouflaged animals.</li>
                      <li>Discuss how camouflage helps animals avoid predators and catch prey.</li>
                      <li>Have students create their own camouflaged animals using construction paper and markers.</li>
                      <li>Discuss the importance of camouflage for survival.</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=animal+camouflage+blending+environment"
                        alt="Camouflage"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 2: Animal Senses Research Project</h3>
                  <p className="mb-4">
                    Students will research animals with special sensory abilities and present their findings.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Research materials (books, internet)</li>
                      <li>Poster board</li>
                      <li>Art supplies</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Choose 3 animals with special sensory abilities:</li>
                      <li>Housefly peripheral vision</li>
                      <li>Mosquito CO2 detection</li>
                      <li>Colossal squid large eyes for deep water vision</li>
                      <li>Frog sound/vibration communication</li>
                      <li>Blue-footed booby visual mating displays</li>
                      <li>Create posters explaining how these senses help the animals survive</li>
                    </ol>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="relative h-64 w-full max-w-md">
                      <Image
                        src="/placeholder.svg?height=250&width=400&query=animal+special+senses+adaptations"
                        alt="Animal Senses Research"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Activity 3: Light and Reflection Experiments</h3>
                  <p className="mb-4">
                    Students will investigate how light reflection works and its importance for vision.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Materials Needed:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Flashlights</li>
                      <li>Mirrors</li>
                      <li>Smooth and rough surfaces</li>
                      <li>Cardboard</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Procedure:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Turn lights on/off to demonstrate need for light to see objects.</li>
                      <li>Use mirrors to direct flashlight beams around room.</li>
                      <li>Compare specular reflection (smooth surfaces) vs diffuse reflection (rough surfaces).</li>
                      <li>Build simple periscope using mirrors and cardboard.</li>
                      <li>Discuss how eyes use reflected light to see objects.</li>
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
