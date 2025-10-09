import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Repeat, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function PatternsRelationshipsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <Repeat className="mr-2 h-7 w-7 text-amber-600" />
            Patterns and Relationships
          </h1>
          <p className="text-gray-700">
            In Grade 3, students identify, describe, extend, and create patterns in numbers, shapes, and everyday
            contexts. They explore how patterns help us make predictions and understand mathematical relationships,
            laying the foundation for algebraic thinking.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Patterns and Relationships
        </h3>

        <Tabs defaultValue="patterns">
          <TabsList className="grid w-full grid-cols-2 bg-amber-100">
            <TabsTrigger value="patterns" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Pattern Recognition
            </TabsTrigger>
            <TabsTrigger
              value="relationships"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Relationships & Functions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Pattern Recognition and Extension</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify and describe repeating patterns in various contexts</li>
              <li>Extend repeating patterns with shapes, colors, and numbers</li>
              <li>Identify and describe growing and shrinking patterns</li>
              <li>Extend growing and shrinking patterns</li>
              <li>Identify errors and missing elements in patterns</li>
              <li>Create patterns using given rules</li>
            </ul>
          </TabsContent>

          <TabsContent value="relationships" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Relationships and Functions</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify and extend number patterns involving addition and subtraction</li>
              <li>Identify and extend number patterns involving multiplication and division</li>
              <li>Describe the rule for a given number pattern</li>
              <li>Complete input-output tables using simple rules</li>
              <li>Determine the rule for a given input-output table</li>
              <li>Represent relationships using tables and graphs</li>
              <li>Solve problems involving patterns and relationships</li>
              <li>Understand and use symbols to represent unknown quantities</li>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Pattern Recognition and Extension
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and describe repeating patterns in various contexts</li>
                    <li>Extend repeating patterns with shapes, colors, and numbers</li>
                    <li>Identify and describe growing and shrinking patterns</li>
                    <li>Extend growing and shrinking patterns</li>
                    <li>Identify errors and missing elements in patterns</li>
                    <li>Create patterns using given rules</li>
                    <li>Translate patterns from one representation to another (e.g., from numbers to shapes)</li>
                    <li>Identify patterns in the environment, art, music, and architecture</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">Number Patterns</AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and extend number patterns involving addition and subtraction</li>
                    <li>Identify and extend number patterns involving multiplication and division</li>
                    <li>Describe the rule for a given number pattern</li>
                    <li>Create number patterns using given rules</li>
                    <li>Connect number patterns to skip counting and the number line</li>
                    <li>Identify patterns in multiplication and division facts</li>
                    <li>Use patterns to develop mental math strategies</li>
                    <li>Solve problems involving number patterns</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Relationships and Functions
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Complete input-output tables using simple rules</li>
                    <li>Determine the rule for a given input-output table</li>
                    <li>Represent relationships using tables and graphs</li>
                    <li>Solve problems involving patterns and relationships</li>
                    <li>Understand and use symbols to represent unknown quantities</li>
                    <li>Find the value of an unknown in simple equations</li>
                    <li>Describe relationships between quantities in words and symbols</li>
                    <li>Use patterns to make predictions</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Patterns in the Environment
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify patterns in nature, art, music, and architecture</li>
                    <li>Create patterns for practical and aesthetic purposes</li>
                    <li>Connect mathematical patterns to real-world contexts</li>
                    <li>Use patterns to make predictions</li>
                    <li>Explain how patterns help us understand the world</li>
                    <li>Identify and describe patterns in cultural designs and artifacts</li>
                    <li>Create and analyze patterns in tessellations and tilings</li>
                    <li>Recognize patterns in calendars and schedules</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-yellow-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="text-yellow-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-yellow-700">Observations:</strong> Teacher observations during pattern
                  activities, group work, and discussions about pattern concepts
                </li>
                <li>
                  <strong className="text-yellow-700">Conversations:</strong> Student explanations of pattern rules,
                  relationships, and predictions
                </li>
                <li>
                  <strong className="text-yellow-700">Products:</strong> Student work samples, including created
                  patterns, extended patterns, completed input-output tables, and pattern-based projects
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
                <h4 className="font-semibold mb-2 text-yellow-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for pattern recognition and extension</li>
                  <li>Rubrics for evaluating student understanding of relationships and functions</li>
                  <li>Performance tasks involving creating and analyzing patterns</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Pattern journals for students to record and reflect on patterns they discover</li>
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
                  <AccordionTrigger>Pattern Recognition and Extension</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concrete Materials:</strong> Use manipulatives like pattern blocks, colored counters,
                        and other objects to create and extend patterns.
                      </li>
                      <li>
                        <strong>Visual Representations:</strong> Create visual displays of different types of patterns
                        and their extensions.
                      </li>
                      <li>
                        <strong>Pattern Hunts:</strong> Have students search for patterns in the classroom, school, and
                        community environment.
                      </li>
                      <li>
                        <strong>Multi-sensory Approaches:</strong> Incorporate sound, movement, and touch into pattern
                        activities to engage different learning modalities.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Number Patterns</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Number Charts:</strong> Use hundreds charts and other number grids to identify and
                        highlight patterns.
                      </li>
                      <li>
                        <strong>Skip Counting:</strong> Practice skip counting forwards and backwards to reinforce
                        number patterns.
                      </li>
                      <li>
                        <strong>Pattern Rules:</strong> Encourage students to describe pattern rules in their own words
                        before using mathematical language.
                      </li>
                      <li>
                        <strong>Calculator Explorations:</strong> Use calculators to explore and extend number patterns
                        efficiently.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Relationships and Functions</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Input-Output Machines:</strong> Use physical or virtual "function machines" to
                        demonstrate how rules transform inputs into outputs.
                      </li>
                      <li>
                        <strong>T-Charts:</strong> Organize input-output pairs in T-charts to help students visualize
                        relationships.
                      </li>
                      <li>
                        <strong>Guess My Rule:</strong> Play games where students must determine the rule based on given
                        input-output pairs.
                      </li>
                      <li>
                        <strong>Real-World Connections:</strong> Connect function concepts to everyday situations, such
                        as converting measurements or calculating costs.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Differentiation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Scaffolded Tasks:</strong> Provide patterns with varying levels of complexity to meet
                        the needs of different learners.
                      </li>
                      <li>
                        <strong>Visual Supports:</strong> Use color coding, arrows, and other visual cues to help
                        students identify pattern structures.
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Organize students in mixed-ability groups to work on
                        pattern challenges together.
                      </li>
                      <li>
                        <strong>Open-Ended Tasks:</strong> Provide opportunities for students to create their own
                        patterns and rules, allowing for creativity and multiple entry points.
                      </li>
                      <li>
                        <strong>Technology Integration:</strong> Use interactive digital tools to explore patterns and
                        relationships dynamically.
                      </li>
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
                <li>Pattern blocks and other manipulatives</li>
                <li>Function machine templates</li>
                <li>Input-output table templates</li>
                <li>Hundreds charts and number lines</li>
                <li>Pattern cards and task cards</li>
                <li>OECS Grade 3 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual pattern blocks and manipulatives</li>
                <li>Pattern journals</li>
                <li>T-charts for recording input-output pairs</li>
                <li>Grid paper for creating patterns</li>
                <li>Pattern recognition worksheets</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Patterns and relationships form the foundation of algebraic thinking. In Grade 3, students build on their
              understanding of repeating patterns and begin to explore more complex growing and shrinking patterns. They
              also develop their understanding of functional relationships through work with input-output tables and
              simple rules. The ability to recognize, describe, extend, and create patterns helps students make sense of
              the mathematical world and develop problem-solving skills. Teachers should emphasize the connections
              between patterns and other mathematical concepts, such as operations, number sense, and geometry. By
              providing opportunities for students to explore patterns in various contexts, teachers help them develop
              the ability to generalize and abstract, which are essential skills for higher-level mathematics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
