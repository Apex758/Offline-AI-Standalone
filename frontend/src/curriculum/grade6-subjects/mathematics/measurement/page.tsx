import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck, ChevronRight } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6MathematicsMeasurementPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Mathematics", href: "/curriculum/grade6-subjects/mathematics" },
          { label: "Measurement", href: "/curriculum/grade6-subjects/mathematics/measurement" },
        ]}
      />
      <Link href="/curriculum/grade6-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Mathematics
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Grade 6 Mathematics - Measurement
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Measurement strand of the Grade 6 Mathematics curriculum. Develop skills in understanding and
            applying measurement concepts.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Measurement
        </h3>

        <Tabs defaultValue="understanding-what-and-how">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="understanding-what-and-how"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Understanding What and How We Measure
            </TabsTrigger>
            <TabsTrigger
              value="applying-techniques-tools-formulas"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Applying Techniques, Tools and Formulas for Measuring
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="understanding-what-and-how"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Understanding What and How We Measure</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Developing an Understanding of Measurable Attributes</li>
              <li>Comparing and Ordering Based on Measurable Attributes</li>
              <li>Developing and Applying Non-standard Units of Measure</li>
              <li>Developing and Applying Standard Units of Measure</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="applying-techniques-tools-formulas"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Applying Techniques, Tools and Formulas for Measuring
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Developing Personal Referents for Measuring Attributes</li>
              <li>Using Tools to Measure Attributes</li>
              <li>Developing and Applying Formulae for Measuring</li>
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
            <CardDescription>By the end of Grade Six, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Understanding What and How We Measure
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Use and apply language relating to measurement terms (surface area, money, time and angles).
                    </li>
                    <li>Explain how an angle is formed</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Applying Techniques, Tools and Formulas for Measuring
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Apply the area, perimeter, volume formulae for rectangles, triangles, parallelograms, composite
                      shapes and prisms in real world and mathematical problems.
                    </li>
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
                  <strong className="text-indigo-700">Observations:</strong> Data collection and analysis processes
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Statistical reasoning discussions
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Graph creation and probability experiments
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Data analysis project rubrics</li>
                  <li>Graph interpretation tasks</li>
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
                      <li>Use base ten blocks to represent numbers</li>
                      <li>Use number lines to compare numbers</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Representations</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use place value charts</li>
                      <li>Use number lines</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect numbers to money and measurement</li>
                      <li>Use numbers in real-life situations</li>
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
              <li>Rulers, measuring tapes, and meter sticks</li>
              <li>Protractors and angle measurers</li>
              <li>Balance scales and weights</li>
              <li>Measuring cups and containers</li>
              <li>Stopwatches and timers</li>
              <li>Grid paper and formula charts</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Virtual measuring tools and simulators</li>
              <li>Interactive area and perimeter calculators</li>
              <li>3D volume exploration software</li>
              <li>Measurement conversion tools</li>
              <li>Educational videos on measurement concepts</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Measurement in School Mathematics" by Albert Shulte</li>
            <li>"Teaching Measurement: Activities and Strategies" by Douglas Clements</li>
            <li>"Developing Measurement Concepts in a Problem-Solving Environment" by George Bright</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Grade 6 Mathematics Overview</h2>
        <p className="mb-4 text-gray-700">
          The Grade 6 mathematics curriculum is designed to solidify learners' fundamental mathematical understanding,
          skills, and values, building upon their prior knowledge.
        </p>
        <p className="text-gray-700">
          This curriculum introduces more complex mathematical concepts, encouraging learners to apply logical reasoning
          and critical thinking to a variety of mathematical problems.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/curriculum/grade6-subjects/activities/mathematics" className="flex items-center">
            <span className="mr-2">View Mathematics Activities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
