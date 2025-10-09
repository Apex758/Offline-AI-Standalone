import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Hash, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function NumberSensePage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-emerald-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-700 flex items-center">
            <Hash className="mr-2 h-7 w-7 text-teal-600" />
            Number Sense
          </h1>
          <p className="text-gray-700">
            In Grade 3, students develop a deeper understanding of whole numbers up to 10,000, fractions, and decimals.
            They learn to represent, compare, and order numbers, understand place value concepts, and develop mental
            math strategies for working with larger numbers.
          </p>
        </div>
      </div>

      <div className="bg-teal-50 p-6 rounded-lg border border-teal-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-teal-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Number Sense
        </h3>

        <Tabs defaultValue="whole">
          <TabsList className="grid w-full grid-cols-3 bg-teal-100">
            <TabsTrigger value="whole" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Whole Numbers
            </TabsTrigger>
            <TabsTrigger value="fractions" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Fractions
            </TabsTrigger>
            <TabsTrigger value="decimals" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Decimals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whole" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Understanding whole numbers up to 10,000
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Read, write, and represent whole numbers up to 10,000 using numerals, words, and models</li>
              <li>Identify the place value of digits in numbers up to 10,000</li>
              <li>Compare and order whole numbers up to 10,000 using symbols (&lt;, &gt;, =)</li>
              <li>Round numbers to the nearest ten and hundred</li>
              <li>Skip count by various numbers (2s, 3s, 5s, 10s, 25s, 100s)</li>
              <li>Develop mental math strategies for working with larger numbers</li>
            </ul>
          </TabsContent>

          <TabsContent value="fractions" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Understanding fractions as parts of a whole
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Represent fractions using area models, number lines, and sets</li>
              <li>Identify and name fractions (halves, thirds, fourths, fifths, sixths, eighths, tenths)</li>
              <li>Compare and order fractions with like denominators</li>
              <li>Recognize and generate equivalent fractions</li>
              <li>Solve simple problems involving fractions</li>
              <li>Understand fractions as numbers on a number line</li>
            </ul>
          </TabsContent>

          <TabsContent value="decimals" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 3: Introduction to decimal numbers</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Understand the concept of tenths as a decimal fraction</li>
              <li>Represent tenths as decimals and fractions</li>
              <li>Read and write decimals to tenths</li>
              <li>Connect decimal and fraction representations of tenths</li>
              <li>Use models to represent decimal numbers</li>
              <li>Apply decimal concepts in measurement contexts</li>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Place Value and Number Representation
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Read and write numbers up to 10,000 in numerals and words</li>
                    <li>Identify the place value of each digit in a four-digit number</li>
                    <li>Represent numbers using base-ten blocks, place value charts, and expanded notation</li>
                    <li>Compose and decompose numbers up to 10,000 in multiple ways</li>
                    <li>Use place value understanding to round numbers to the nearest 10 and 100</li>
                    <li>Compare and order numbers up to 10,000 using place value understanding</li>
                    <li>Use appropriate vocabulary to describe number relationships</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Fractions and Equivalence
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Identify and represent fractions as parts of a whole, parts of a set, and points on a number line
                    </li>
                    <li>Compare and order fractions with like denominators</li>
                    <li>Recognize and generate simple equivalent fractions</li>
                    <li>Explain why fractions are equivalent using visual models</li>
                    <li>Solve problems involving fractions in real-world contexts</li>
                    <li>Use fraction models to represent and solve problems</li>
                    <li>Express whole numbers as fractions</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">Decimal Numbers</AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Understand the concept of tenths as a decimal fraction</li>
                    <li>Represent tenths as decimals and fractions</li>
                    <li>Read and write decimals to tenths</li>
                    <li>Connect decimal and fraction representations of tenths</li>
                    <li>Use models to represent decimal numbers</li>
                    <li>Apply decimal concepts in measurement contexts</li>
                    <li>Relate decimals to money values</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-emerald-700">Observations:</strong> Teacher observations during number
                  activities, group work, and discussions about number concepts
                </li>
                <li>
                  <strong className="text-emerald-700">Conversations:</strong> Student explanations of their
                  understanding of place value, fractions, and decimals
                </li>
                <li>
                  <strong className="text-emerald-700">Products:</strong> Student work samples, including written
                  solutions, drawings, and models demonstrating their understanding of number concepts
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                <h4 className="font-semibold mb-2 text-emerald-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for place value understanding</li>
                  <li>Rubrics for evaluating student understanding of fractions</li>
                  <li>Performance tasks involving comparing and ordering numbers</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Math journals for students to explain their thinking about number concepts</li>
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
                  <AccordionTrigger>Place Value and Number Representation</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concrete Manipulatives:</strong> Use base-ten blocks, place value charts, and other
                        manipulatives to help students understand place value concepts.
                      </li>
                      <li>
                        <strong>Visual Representations:</strong> Create visual models of numbers using drawings,
                        diagrams, and digital tools.
                      </li>
                      <li>
                        <strong>Number Games:</strong> Engage students in games that involve comparing, ordering, and
                        representing numbers.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Fractions and Equivalence</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Fraction Models:</strong> Use fraction circles, bars, and number lines to represent
                        fractions and demonstrate equivalence.
                      </li>
                      <li>
                        <strong>Real-World Contexts:</strong> Connect fractions to everyday situations like sharing
                        food, measuring ingredients, or dividing time.
                      </li>
                      <li>
                        <strong>Collaborative Activities:</strong> Have students work together to solve fraction
                        problems and explain their reasoning.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Decimal Numbers</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Decimal Models:</strong> Use base-ten blocks, grid paper, and number lines to represent
                        decimal numbers.
                      </li>
                      <li>
                        <strong>Money Connections:</strong> Relate decimals to money values to provide a familiar
                        context for understanding tenths.
                      </li>
                      <li>
                        <strong>Measurement Activities:</strong> Use measurement tools with decimal scales to provide
                        concrete experiences with decimals.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Differentiation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Multiple Representations:</strong> Provide various ways for students to represent and
                        engage with number concepts (concrete, pictorial, abstract).
                      </li>
                      <li>
                        <strong>Flexible Grouping:</strong> Use whole-class, small-group, and individual instruction
                        based on student needs.
                      </li>
                      <li>
                        <strong>Tiered Activities:</strong> Adjust the complexity of tasks while maintaining the same
                        essential concepts for all students.
                      </li>
                      <li>
                        <strong>Visual Supports:</strong> Provide anchor charts, number lines, and other visual
                        references for students who need additional support.
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
                <li>Base-ten blocks and place value mats</li>
                <li>Fraction circles, bars, and number lines</li>
                <li>Decimal models and grids</li>
                <li>Number cards and dice</li>
                <li>OECS Grade 3 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual place value charts</li>
                <li>Fraction kits with various models</li>
                <li>Number lines showing whole numbers, fractions, and decimals</li>
                <li>Math journals for recording strategies and solutions</li>
                <li>Visual aids for number concepts</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Number sense refers to a student's fluidity and flexibility with numbers and their understanding of how
              numbers relate to each other. In Grade 3, students expand their understanding to include larger whole
              numbers up to 10,000, develop deeper concepts of fractions as parts of a whole and as numbers on a number
              line, and are introduced to decimal numbers in the context of tenths. Strong number sense serves as the
              foundation for all future mathematical learning, particularly in the areas of operations, measurement, and
              data analysis. Teachers should emphasize the connections between different number representations and
              encourage students to develop mental math strategies based on place value understanding.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
