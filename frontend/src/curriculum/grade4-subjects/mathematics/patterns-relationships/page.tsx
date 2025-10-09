import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade4MathematicsPatternsPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4 Subjects", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          {
            label: "Patterns and Relationships",
            href: "/curriculum/grade4-subjects/mathematics/patterns-relationships",
          },
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
            Grade 4 Mathematics - Patterns and Relationships
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Patterns and Relationships strand of the Grade 4 Mathematics curriculum. Discover repeating,
            growing, and shrinking patterns, and learn to identify and explain the relationships between numbers and
            shapes.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Patterns and Relationships
        </h3>

        <Tabs defaultValue="repeating-patterns">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="repeating-patterns"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Repeating Patterns
            </TabsTrigger>
            <TabsTrigger
              value="number-patterns"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Number Patterns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repeating-patterns" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Understanding Repeating Patterns</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify and describe repeating patterns in real-life contexts</li>
              <li>Determine pattern rules and use them to extend patterns</li>
              <li>Identify missing elements in repeating patterns</li>
            </ul>
          </TabsContent>

          <TabsContent value="number-patterns" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Understanding Number Patterns</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify and explain the patterns in equivalent fractions</li>
              <li>Identify and explain the patterns in decimal numbers up to tenths</li>
              <li>Translate patterns using various representations, including shapes and numbers</li>
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
                  Repeating Patterns
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Determine pattern rules and use them to extend patterns</li>
                    <li>Identify missing elements in repeating, growing, and shrinking patterns</li>
                    <li>Translate patterns using various representations, including shapes and numbers</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">Number Patterns</AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and explain the patterns in equivalent fractions</li>
                    <li>Identify and explain the patterns in decimal numbers up to tenths</li>
                    <li>
                      Create and describe patterns to illustrate relationships among whole numbers and decimal numbers
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
                  <li>Observation checklists for pattern recognition skills</li>
                  <li>Rubrics for evaluating student-created patterns</li>
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
                      <li>Use pattern blocks to create repeating patterns</li>
                      <li>Use counters to represent number patterns</li>
                      <li>Use number lines to visualize patterns</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Aids</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use charts to organize patterns</li>
                      <li>Use diagrams to illustrate patterns</li>
                      <li>Use color-coding to highlight patterns</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect patterns to real-world scenarios</li>
                      <li>Use patterns in music</li>
                      <li>Use patterns in art</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl shadow-md border border-amber-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-700">Additional Resources and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-600">Manipulatives</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pattern blocks</li>
              <li>Colored tiles</li>
              <li>Linking cubes</li>
              <li>Function machines</li>
              <li>Hundred charts</li>
              <li>Algebra tiles</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pattern creation software</li>
              <li>Interactive function tables</li>
              <li>Virtual pattern blocks</li>
              <li>Algebraic thinking games</li>
              <li>Educational videos on patterns</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-amber-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Patterns in Mathematics: Problem Solving from Counting to Chaos" by Robert Welch</li>
            <li>
              "Thinking Mathematically: Integrating Arithmetic and Algebra in Elementary School" by Thomas P. Carpenter
            </li>
            <li>"Patterns and Algebraic Thinking" by Linda Dacey</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
