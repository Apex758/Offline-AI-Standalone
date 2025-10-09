import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck, ChevronRight } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6MathematicsDataProbabilityPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Mathematics", href: "/curriculum/grade6-subjects/mathematics" },
          { label: "Data Handling & Probability", href: "/curriculum/grade6-subjects/mathematics/data-probability" },
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
            Grade 6 Mathematics - Data Handling & Probability
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Data Handling & Probability strand of the Grade 6 Mathematics curriculum. Develop skills in
            collecting, analyzing, and interpreting data while understanding probability concepts.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Data Handling & Probability
        </h3>

        <Tabs defaultValue="collecting-organizing-displaying-data">
          <TabsList className="grid w-full grid-cols-4 bg-indigo-100">
            <TabsTrigger
              value="collecting-organizing-displaying-data"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
            >
              Collecting & Displaying Data
            </TabsTrigger>
            <TabsTrigger
              value="using-statistical-methods"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
            >
              Statistical Methods
            </TabsTrigger>
            <TabsTrigger
              value="evaluating-inferences-making-predictions"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
            >
              Evaluating & Predicting
            </TabsTrigger>
            <TabsTrigger
              value="understanding-and-applying-concepts"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
            >
              Probability Concepts
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="collecting-organizing-displaying-data"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Collecting, Organizing, and Displaying Data
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Formulating Questions That Can be Answered with Data</li>
              <li>Collecting, Organizing, Displaying and Communicating Data</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="using-statistical-methods"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Using Statistical Methods to Analyse Data
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describing Data Sets</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="evaluating-inferences-making-predictions"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Evaluating Inferences and Making Predictions Based on Data
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Making Inferences with Data Sets</li>
              <li>Evaluating Data Descriptions and Reports</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="understanding-and-applying-concepts"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 4: Understanding and Applying Concepts of Probability
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Predicting and Describing the Likelihood of Events</li>
              <li>Calculating Probabilities</li>
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
                  Collecting, Organizing, and Displaying Data
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Recognize a statistical question as one that anticipates variability in the data related to the
                      question and accounts for it in the answers
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Using Statistical Methods to Analyse Data
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Determine whether a given set of data can be represented by a line graph (continuous data) or a
                      series of points (discrete data) and explain why
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Evaluating Inferences and Making Predictions Based on Data
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Read, explain patterns, and make predictions from data represented in line plots or graphs.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Understanding and Applying Concepts of Probability
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Explore events involving two or more steps; represent data using charts and diagrams</li>
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
