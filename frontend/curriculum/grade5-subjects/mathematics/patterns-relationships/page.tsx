import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5MathematicsPatternsPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Patterns & Relationships", href: "/curriculum/grade5-subjects/mathematics/patterns-relationships" },
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
            Grade 5 Mathematics - Patterns and Relationships
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Patterns and Relationships strand of the Grade 5 Mathematics curriculum. Develop algebraic
            thinking through pattern analysis and coordinate graphing.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Patterns and Relationships
        </h3>

        <Tabs defaultValue="numerical-patterns">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="numerical-patterns"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Numerical Patterns
            </TabsTrigger>
            <TabsTrigger
              value="coordinate-graphing"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Coordinate Graphing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="numerical-patterns" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Numerical Patterns</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Generate two numerical patterns using two given rules</li>
              <li>Identify apparent relationships between corresponding terms</li>
              <li>Form ordered pairs consisting of corresponding terms from the two patterns</li>
              <li>Analyze patterns and relationships in number sequences</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="coordinate-graphing"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Coordinate Graphing and Relationships</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Graph ordered pairs in the first quadrant of the coordinate plane</li>
              <li>Interpret coordinate graphs and identify patterns</li>
              <li>Use coordinate graphs to solve real-world and mathematical problems</li>
              <li>Understand the relationship between patterns and their graphical representations</li>
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
                  Pattern Generation & Analysis
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Generate numerical patterns using given rules</li>
                    <li>Identify relationships between corresponding terms</li>
                    <li>Extend patterns and predict future terms</li>
                    <li>Create rules for given patterns</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Coordinate Plane
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Plot ordered pairs on coordinate plane</li>
                    <li>Read coordinates from graphed points</li>
                    <li>Understand x and y axes and their relationship</li>
                    <li>Use coordinate plane to solve problems</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Pattern Relationships
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Form ordered pairs from two related patterns</li>
                    <li>Graph pattern relationships</li>
                    <li>Analyze graphed relationships</li>
                    <li>Make predictions based on patterns</li>
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
                  <strong className="text-indigo-700">Observations:</strong> Pattern recognition and extension
                  activities
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Mathematical reasoning about relationships
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Coordinate graphing and pattern analysis tasks
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pattern extension and rule identification tasks</li>
                  <li>Coordinate graphing accuracy checks</li>
                  <li>Pattern relationship analysis rubrics</li>
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
                      <li>Use pattern blocks and tiles for visual patterns</li>
                      <li>Use coordinate grids and graphing materials</li>
                      <li>Use counters and manipulatives for number patterns</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Representations</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use tables and charts to organize patterns</li>
                      <li>Use coordinate plane posters and grids</li>
                      <li>Use color coding for pattern relationships</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Applications</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect patterns to growth in nature</li>
                      <li>Use coordinate systems in maps and navigation</li>
                      <li>Apply patterns to music and art</li>
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
              <li>Pattern blocks and geometric tiles</li>
              <li>Coordinate grid paper and boards</li>
              <li>Graphing materials and rulers</li>
              <li>Colored counters and sorting materials</li>
              <li>Number lines and hundred charts</li>
              <li>Pattern cards and sequence materials</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive coordinate plane tools</li>
              <li>Pattern generation software</li>
              <li>Graphing calculator applications</li>
              <li>Virtual pattern block activities</li>
              <li>Educational videos on algebraic thinking</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Thinking Mathematically" by John Mason</li>
            <li>"Patterns in Mathematics" by Charles Lovitt</li>
            <li>"Algebraic Thinking in Elementary School" by Susan Jo Russell</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
