import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5MathematicsMeasurementPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Measurement", href: "/curriculum/grade5-subjects/mathematics/measurement" },
        ]}
      />
      <Link href="/curriculum/grade5-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Mathematics
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Grade 5 Mathematics - Measurement
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Measurement strand of the Grade 5 Mathematics curriculum. Develop skills in converting units,
            calculating volume, and applying measurement concepts to real-world situations.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Measurement
        </h3>

        <Tabs defaultValue="unit-conversion">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="unit-conversion"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Unit Conversion
            </TabsTrigger>
            <TabsTrigger
              value="volume-area"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Volume & Area
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unit-conversion" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Unit Conversion</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Convert like measurement units within a given measurement system</li>
              <li>Use these conversions in solving multi-step, real-world problems</li>
              <li>Understand relationships between different units of measurement</li>
              <li>Apply appropriate measurement units for different contexts</li>
            </ul>
          </TabsContent>

          <TabsContent value="volume-area" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Volume and Area Measurement</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Recognize volume as an attribute of solid figures and understand concepts of volume measurement</li>
              <li>Measure volumes by counting unit cubes using cubic cm, cubic in, cubic ft, and improvised units</li>
              <li>Relate volume to the operations of multiplication and addition</li>
              <li>Find the volume of a right rectangular prism with whole-number side lengths</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-teal-50">
            <CardTitle className="text-teal-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Unit Conversions
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Convert measurements within the metric system</li>
                    <li>Convert measurements within the customary system</li>
                    <li>Solve multi-step problems involving unit conversions</li>
                    <li>Choose appropriate units for different measurement contexts</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Volume Measurement
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Understand volume as an attribute of solid figures</li>
                    <li>Measure volumes by counting unit cubes</li>
                    <li>Apply volume formula for rectangular prisms</li>
                    <li>Relate volume to multiplication and addition</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Area & Perimeter
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Calculate area of rectangles using formulas</li>
                    <li>Find perimeter of polygons</li>
                    <li>Solve real-world area and perimeter problems</li>
                    <li>Understand relationship between area and perimeter</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-indigo-700">Observations:</strong> Measurement technique demonstrations
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Unit conversion reasoning discussions
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Volume calculation and measurement tasks
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Unit conversion problem-solving tasks</li>
                  <li>Volume measurement with manipulatives</li>
                  <li>Real-world measurement application projects</li>
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
                  <AccordionTrigger>Concrete Materials</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use measuring tools (rulers, scales, measuring cups)</li>
                      <li>Use unit cubes for volume measurement</li>
                      <li>Use real objects for hands-on measurement</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Aids</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use conversion charts and reference tables</li>
                      <li>Use measurement comparison displays</li>
                      <li>Use volume and area visual models</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Applications</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect measurement to cooking and recipes</li>
                      <li>Use measurement in construction and design</li>
                      <li>Apply volume concepts to containers and packaging</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 rounded-xl shadow-md border border-indigo-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Additional Resources and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Manipulatives</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rulers, measuring tapes, and yardsticks</li>
              <li>Unit cubes and volume containers</li>
              <li>Scales and balances</li>
              <li>Measuring cups and graduated cylinders</li>
              <li>Stopwatches and timers</li>
              <li>Thermometers and temperature tools</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Virtual measurement tools and simulators</li>
              <li>Unit conversion calculators</li>
              <li>Interactive volume and area activities</li>
              <li>Measurement games and challenges</li>
              <li>Educational videos on measurement concepts</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Measurement in School Mathematics" by National Council of Teachers of Mathematics</li>
            <li>"Teaching Measurement: Activities and Strategies" by Douglas Clements</li>
            <li>"Developing Measurement Concepts in a Problem-Solving Environment" by George Bright</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
