import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5MathematicsDataProbabilityPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Data Handling & Probability", href: "/curriculum/grade5-subjects/mathematics/data-probability" },
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
            Grade 5 Mathematics - Data Handling & Probability
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Data Handling & Probability strand of the Grade 5 Mathematics curriculum. Develop skills in
            collecting, analyzing, and interpreting data while understanding probability concepts.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Data Handling & Probability
        </h3>

        <Tabs defaultValue="data-analysis">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="data-analysis"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Data Analysis & Graphing
            </TabsTrigger>
            <TabsTrigger
              value="probability-concepts"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Probability Concepts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data-analysis" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Data Analysis and Graphing</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Make a line plot to display a data set of measurements in fractions of a unit</li>
              <li>Use operations on fractions to solve problems involving information presented in line plots</li>
              <li>Collect, organize, and analyze data to answer questions</li>
              <li>Create and interpret various types of graphs and charts</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="probability-concepts"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Probability Concepts and Applications</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Understand that the probability of a chance event is a number between 0 and 1</li>
              <li>Approximate the probability of a chance event by collecting data on the chance process</li>
              <li>Develop probability models and compare probabilities from a model to observed frequencies</li>
              <li>Use probability concepts to make predictions and informed decisions</li>
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
                  Data Collection & Display
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Create line plots with fractional measurements</li>
                    <li>Interpret data from various graph types</li>
                    <li>Collect data using surveys and observations</li>
                    <li>Organize data in tables and charts</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Statistical Analysis
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Calculate measures of center (mean, median, mode)</li>
                    <li>Analyze data to answer questions</li>
                    <li>Compare data sets and draw conclusions</li>
                    <li>Use data to make predictions</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Probability Understanding
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Understand probability as a number between 0 and 1</li>
                    <li>Conduct probability experiments</li>
                    <li>Compare theoretical and experimental probability</li>
                    <li>Use probability to make informed decisions</li>
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
                  <li>Probability experiment reports</li>
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
                      <li>Use spinners, dice, and coins for probability</li>
                      <li>Use counters and sorting materials for data</li>
                      <li>Use graph paper and chart materials</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Representations</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use various graph types and charts</li>
                      <li>Use probability trees and diagrams</li>
                      <li>Use data organization templates</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect data to sports statistics and weather</li>
                      <li>Use probability in games and decision making</li>
                      <li>Apply data analysis to school and community issues</li>
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
              <li>Spinners, dice, and probability materials</li>
              <li>Colored counters and sorting trays</li>
              <li>Graph paper and chart paper</li>
              <li>Survey materials and clipboards</li>
              <li>Calculators for data analysis</li>
              <li>Measuring tools for data collection</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Graphing software and applications</li>
              <li>Virtual probability simulators</li>
              <li>Data collection and analysis tools</li>
              <li>Interactive statistics games</li>
              <li>Educational videos on data and probability</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Statistics Through Applications" by Daren Starnes</li>
            <li>"Teaching Statistics and Probability" by Carmen Batanero</li>
            <li>"Data Analysis and Probability for Elementary Teachers" by Kay Merseth</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
