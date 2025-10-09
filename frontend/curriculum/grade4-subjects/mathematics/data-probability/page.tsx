import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade4MathematicsDataPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4 Subjects", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          { label: "Data Handling & Probability", href: "/curriculum/grade4-subjects/mathematics/data-probability" },
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
            Grade 4 Mathematics - Data Handling & Probability
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Data Handling & Probability strand of the Grade 4 Mathematics curriculum. Develop skills in
            collecting, organizing, and analyzing data, and understand basic probability concepts.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Data Handling & Probability
        </h3>

        <Tabs defaultValue="collecting-data">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="collecting-data"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Collecting & Organizing Data
            </TabsTrigger>
            <TabsTrigger
              value="analyzing-probability"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Analyzing Data & Probability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collecting-data" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Collecting and Organizing Data</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Recognize bias in questions and take steps to reduce bias in formulating questions for survey</li>
              <li>Represent real-world data using double-bar graphs to make comparisons</li>
              <li>Collect data from different primary and secondary sources to answer questions of interest</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="analyzing-probability"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Analyzing Data and Understanding Probability
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Solve a given problem by constructing and interpreting a double bar graph</li>
              <li>
                Summarize numerical data sets in relation to their context, such as by reporting the number of
                observations
              </li>
              <li>Understand that the probability of a chance event is a number between 0 and 1</li>
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
                  Collecting & Organizing Data
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Recognize bias in questions and take steps to reduce bias in formulating questions for survey
                    </li>
                    <li>Represent real-world data using double-bar graphs to make comparisons</li>
                    <li>
                      Collect data from different primary and secondary sources that involve comparing two or more sets
                      of data
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Analyzing Data & Probability
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Solve a given problem by constructing and interpreting a double bar graph</li>
                    <li>Summarize numerical data sets in relation to their context</li>
                    <li>Understand that the probability of a chance event is a number between 0 and 1</li>
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
                  <li>Observation checklists for data handling skills</li>
                  <li>Rubrics for evaluating student-created graphs</li>
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
                      <li>Use counters to represent data</li>
                      <li>Use blocks to create graphs</li>
                      <li>Use spinners to conduct probability experiments</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Aids</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use charts to organize data</li>
                      <li>Use diagrams to illustrate probability</li>
                      <li>Use graphs to represent data</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect data handling to real-world surveys</li>
                      <li>Use probability in games and sports</li>
                      <li>Use data to make informed decisions</li>
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
              <li>Spinners and dice</li>
              <li>Colored counters</li>
              <li>Probability kits</li>
              <li>Graph paper and chart paper</li>
              <li>Survey materials</li>
              <li>Data collection tools</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Graph creation software</li>
              <li>Virtual probability simulators</li>
              <li>Data analysis tools</li>
              <li>Survey creation platforms</li>
              <li>Educational videos on data and probability</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Teaching Statistics: A Bag of Tricks" by Andrew Gelman</li>
            <li>"Data Analysis for Elementary School Children" by National Council of Teachers of Mathematics</li>
            <li>"Probability Models and Applications" by Ingram Olkin (teacher resource)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
