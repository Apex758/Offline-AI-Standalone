import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Mountain, ClipboardCheck } from 'lucide-react'
import { Breadcrumb } from "@/components/breadcrumb"

export default function EarthSystemsPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-pink-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-pink-700 flex items-center">
            <Mountain className="mr-2 h-7 w-7 text-pink-600" />
            Earth's Systems: Processes that Shape the Earth
          </h1>
          <p className="text-gray-700">
            We live in a world where we watch natural processes shape the landscape. While we can’t always prevent
            small and sometimes catastrophic events, our children should understand enough of these earth changes to be
            prepared to cope with the inevitable consequences.
          </p>
        </div>
      </div>

      <div className="bg-pink-50 p-6 rounded-lg border border-pink-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-pink-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Earth Systems
        </h3>

        <Tabs defaultValue="processes">
          <TabsList className="grid w-full grid-cols-2 bg-pink-100">
            <TabsTrigger value="processes" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Rock Formations & Fossils
            </TabsTrigger>
            <TabsTrigger value="erosion" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Weathering & Erosion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="processes" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Identify evidence from patterns in rock formations and fossils in rock
              layers to support an explanation for changes in a landscape over time
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Recognise how rock formations result in the changes in the landscape</li>
              <li>Create a representation of a canyon to illustrate how a river changes the landscape overtime.</li>
              <li>Illustrate changes in the landscape.</li>
              <li>Outline how soils are made from a variety of rocks. (ST 3 ESS ER 3)</li>
              <li>Collect and classify rocks in their country. (ST 4 ESS ER 1)</li>
            </ul>
          </TabsContent>

          <TabsContent value="erosion" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Make observations and/or measurements to provide evidence of the effects
              of weathering or the rate of erosion by water, ice, wind, or vegetation
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Investigate the factors that contribute to weathering and erosion.</li>
              <li>Compare and contrast weathering and erosion.</li>
              <li>Observe and account for erosion behaviours in a water table.</li>
              <li>Use a model to investigate the variables that may impact the extent of erosion.</li>
              <li>Communicate experimental results by making a model.</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-pink-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Identifying Rock Formations and Processes
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify the three main types of rocks: igneous, sedimentary, and metamorphic.</li>
                    <li>Explain how each type of rock is formed (layers and heating processes).</li>
                    <li>Recognize how rock formations result in the changes in the landscape.</li>
                    <li>Relate the location of mountains, volcanoes and earthquakes to the plate boundaries of the earth.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Investigating Weathering and Erosion
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Observe how fossils in layers of rocks and rock formations indicate a change in the landscape.</li>
                    <li>Measure different materials when making models of devices used in the production of energy.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Describing and Classifying Earth’s Features
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Describe and classify different kinds of land and water formations.</li>
                    <li>Describe how human can minimize damage to the environment.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-pink-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-pink-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-pink-700">Observations:</strong> Teacher observations during landform
                  modeling, water cycle investigations, and natural hazard research
                </li>
                <li>
                  <strong className="text-pink-700">Conversations:</strong> Student explanations of Earth's systems,
                  water distribution, and natural hazard solutions
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100">
                <h4 className="font-semibold mb-2 text-pink-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Performance tasks involving Earth's systems and water cycle concepts</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Science journals for recording observations, data, and reflections</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inclusive Learning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="strategy-1">
                  <AccordionTrigger>Understanding Earth’s Core</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Show images of what may lie beneath the earth’s surface.</li>
                      <li>Relate how layers of the earth relate to daily functions.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Erosion and Weathering</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Guide student to conduct field studies that relate to identifying types of rock and its formation.</li>
                      <li>Create an activity that engages in testing the various bodies of water in your district. </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">For Teachers</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Materials for creating landform models</li>
                <li>Maps and globes showing Earth's features</li>
                <li>Natural hazard information and case studies</li>
                <li>Videos and images of Earth's systems and features</li>
                <li>OECS Grade 4 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Science journals for recording observations and reflections</li>
                <li>Materials for creating models and diagrams</li>
                <li>Earth's systems vocabulary cards</li>
                <li>Visual aids and reference materials</li>
                <li>Simple maps and mapping tools</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Earth's Systems in Grade 4 enables to have a deeper understanding of the different types of landforms
              and bodies of water that make up Earth's surface. They learn about the how Earth’s surface is changed and what are
              the effects.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}