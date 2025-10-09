import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade4MathematicsMeasurementPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4 Subjects", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          { label: "Measurement", href: "/curriculum/grade4-subjects/mathematics/measurement" },
        ]}
      />
      <Link href="/curriculum/grade4-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Mathematics
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Grade 4 Mathematics - Measurement
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Measurement strand of the Grade 4 Mathematics curriculum. Develop skills in measuring length,
            mass, capacity, area, and time, and apply these skills to solve real-world problems.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Measurement
        </h3>

        <Tabs defaultValue="length">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger value="length" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Length, Mass & Capacity
            </TabsTrigger>
            <TabsTrigger value="time-area" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Time & Area
            </TabsTrigger>
          </TabsList>

          <TabsContent value="length" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Understanding Length, Mass, and Capacity
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Develop and apply language relating to measurement terms for mass and capacity</li>
              <li>Know the relative sizes of measurement units within one system of units</li>
              <li>
                Explain the relationships between grams and kilograms as metric units of mass, and between liters and
                milliliters as metric units of capacity
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="time-area" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Understanding Time and Area</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Solve problems involving elapsed time by applying the relationship between different units of time
              </li>
              <li>
                Use Mental Math to estimate and calculate various methods of payment that can be used to purchase goods
                and services
              </li>
              <li>Create and apply strategies to determine measures of area using standard units</li>
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
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Length, Mass & Capacity
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Develop and apply language relating to measurement terms for mass and capacity</li>
                    <li>Know the relative sizes of measurement units within one system of units</li>
                    <li>
                      Explain the relationships between grams and kilograms as metric units of mass, and between liters
                      and milliliters as metric units of capacity
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">Time & Area</AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Solve problems involving elapsed time by applying the relationship between different units of time
                    </li>
                    <li>
                      Use Mental Math to estimate and calculate various methods of payment that can be used to purchase
                      goods and services
                    </li>
                    <li>Create and apply strategies to determine measures of area using standard units</li>
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
                  <strong className="text-indigo-700">Observations:</strong> Teacher observations during activities
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Student explanations and discussions
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Student work samples and completed tasks
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for measurement skills</li>
                  <li>Rubrics for evaluating student-created models</li>
                  <li>Performance tasks involving real-world applications</li>
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
                      <li>Use rulers to measure length</li>
                      <li>Use scales to measure mass</li>
                      <li>Use measuring cups to measure capacity</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Aids</AccordionTrigger>
                  <AccordionContent>{/* Content for Visual Aids can be added here */}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl shadow-md border border-pink-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-pink-700">Additional Resources and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-pink-600">Manipulatives</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rulers (metric and imperial)</li>
              <li>Measuring tapes</li>
              <li>Scales and balances</li>
              <li>Measuring cups and containers</li>
              <li>Clocks (analog and digital)</li>
              <li>Thermometers</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-pink-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive measurement tools</li>
              <li>Virtual clocks and timers</li>
              <li>Area and perimeter calculators</li>
              <li>Measurement conversion games</li>
              <li>Educational videos on measurement</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-pink-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Teaching Measurement: What Works?" by Doug Clements</li>
            <li>"Measurement in the Middle Grades" by National Council of Teachers of Mathematics</li>
            <li>"How Big Is a Foot?" by Rolf Myller (children's book for introducing measurement concepts)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
