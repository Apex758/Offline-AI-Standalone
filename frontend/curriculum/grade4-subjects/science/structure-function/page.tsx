import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Leaf, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function StructureFunctionPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-200">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <Leaf className="mr-2 h-7 w-7 text-amber-600" />
            Structure and Function: From Cells to Organisms
          </h1>
          <p className="text-amber-800">
            Understanding how structure relates to function in living things. All living organisms have structures that
            allow them to interact and survive in their environment. Understanding the function linked to such
            structures allows us to better care for living things and also adapt as humans.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Structure and Function
        </h3>

        <Tabs defaultValue="plants">
          <TabsList className="grid w-full grid-cols-2 bg-amber-100">
            <TabsTrigger value="plants" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Plant Structures
            </TabsTrigger>
            <TabsTrigger value="animals" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Animal Structures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plants" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Develop models to describe that organisms have unique and diverse life
              cycles but all have in common birth, growth, reproduction, and death
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-amber-900">
              <li>Identify the major structures of plants (roots, stems, leaves, flowers, fruits, seeds)</li>
              <li>Explain how each plant structure contributes to survival and reproduction</li>
              <li>Compare different plant adaptations to various environments</li>
              <li>Investigate how plant structures respond to environmental stimuli</li>
              <li>Create models showing the relationship between structure and function in plants</li>
            </ul>
          </TabsContent>

          <TabsContent value="animals" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Construct an argument that plants and animals have internal and external
              structures that function to support survival, growth, behavior, and reproduction
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-amber-900">
              <li>Identify major external structures of animals and their functions</li>
              <li>Explore how animal structures help them obtain food, protect themselves, and reproduce</li>
              <li>Compare similar structures across different animal groups</li>
              <li>Investigate how animal structures are adapted to their environments</li>
              <li>Create models showing the relationship between structure and function in animals</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-amber-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Plant Structures and Functions
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2 text-amber-900">
                    <li>Identify and describe the function of major plant parts (roots, stems, leaves, flowers)</li>
                    <li>Explain how roots absorb water and nutrients from soil</li>
                    <li>Describe how stems transport water, nutrients, and sugars throughout the plant</li>
                    <li>Explain how leaves capture sunlight energy and produce food through photosynthesis</li>
                    <li>Describe how flowers attract pollinators and produce seeds for reproduction</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Animal Structures and Functions
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2 text-amber-900">
                    <li>Identify and describe external structures of animals and their functions</li>
                    <li>Compare how different animals use similar structures for different purposes</li>
                    <li>Explain how animal structures help them obtain food, water, and oxygen</li>
                    <li>Describe how animal structures provide protection from predators and the environment</li>
                    <li>Explain how animal structures support movement in different environments</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Environmental Adaptations
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2 text-amber-900">
                    <li>Explain how plant and animal structures are adapted to specific environments</li>
                    <li>Compare structures of organisms living in different Caribbean habitats</li>
                    <li>Investigate how changes in the environment affect plant and animal structures</li>
                    <li>Describe how humans have structures similar to other animals</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-amber-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-amber-900">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2 text-amber-900">
                <li>
                  <strong className="text-amber-700">Observations:</strong> Teacher observations during plant
                  dissections, animal structure investigations, and model-building activities
                </li>
                <li>
                  <strong className="text-amber-700">Conversations:</strong> Student explanations of structure-function
                  relationships, adaptations, and environmental interactions
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                <h4 className="font-semibold mb-2 text-amber-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-amber-900">
                  <li>Labeled diagrams of plant and animal structures with function descriptions</li>
                  <li>Structure-function matching activities and quizzes</li>
                  <li>Science journals documenting observations of living organisms</li>
                  <li>3D models showing how structures support specific functions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700">Inclusive Learning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="strategy-1" className="border border-amber-200">
                  <AccordionTrigger className="hover:bg-amber-50">Exploring Plant Structures</AccordionTrigger>
                  <AccordionContent className="bg-amber-50">
                    <ul className="list-disc pl-5 space-y-2 text-amber-900">
                      <li>Grow plants from seeds and document structural changes over time</li>
                      <li>Dissect flowers to identify reproductive structures</li>
                      <li>Create models showing how water moves through plant structures</li>
                      <li>Compare plant adaptations in different Caribbean environments</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2" className="border border-amber-200">
                  <AccordionTrigger className="hover:bg-amber-50">Investigating Animal Structures</AccordionTrigger>
                  <AccordionContent className="bg-amber-50">
                    <ul className="list-disc pl-5 space-y-2 text-amber-900">
                      <li>Use magnifying glasses to observe small animal structures</li>
                      <li>Compare animal adaptations for movement in different environments</li>
                      <li>Create models showing how animal structures support specific functions</li>
                      <li>Investigate how human body structures compare to other animals</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border border-amber-200">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-amber-700">Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-amber-800">For Teachers</h3>
              <ul className="list-disc pl-5 space-y-1 text-amber-900">
                <li>Plant and animal structure diagrams and posters</li>
                <li>Magnifying glasses and digital microscopes</li>
                <li>Seeds, plants, and gardening materials</li>
                <li>Videos and images of plant and animal adaptations</li>
                <li>OECS Grade 4 Science Curriculum Guide</li>
                <li>Field guides to local Caribbean plants and animals</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-amber-800">For Students</h3>
              <ul className="list-disc pl-5 space-y-1 text-amber-900">
                <li>Science journals for recording observations and drawings</li>
                <li>Materials for creating structure-function models</li>
                <li>Plant and animal vocabulary cards</li>
                <li>Observation tools (hand lenses, rulers, etc.)</li>
                <li>Structure-function matching cards and games</li>
                <li>Plant growing kits and observation journals</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold mb-2 text-amber-700">Teacher Content Knowledge</h3>
            <p className="text-amber-900">
              Structure and Function in Grade 4 enables students to develop a deeper understanding of how living things
              are organized and how their parts work together. Students learn that all organisms have structures with
              specific functions that help them survive, grow, and reproduce in their environments. This foundational
              understanding helps students recognize patterns across living things while appreciating the diversity of
              adaptations in the natural world.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
