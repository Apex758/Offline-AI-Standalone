import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck, ChevronRight } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6MathematicsNumberSensePage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Mathematics", href: "/curriculum/grade6-subjects/mathematics" },
          { label: "Number Sense", href: "/curriculum/grade6-subjects/mathematics/number-sense" },
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
            Grade 6 Mathematics - Number Sense
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Number Sense strand of the Grade 6 Mathematics curriculum. Develop skills in understanding
            numbers and their relationships.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Number Sense
        </h3>

        <Tabs defaultValue="whole-number">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="whole-number"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Whole Number
            </TabsTrigger>
            <TabsTrigger
              value="fractions-decimals-rational-numbers"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Fractions, Decimals and Rational Numbers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whole-number" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Whole Number</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Whole Number – Saying Number Sequence, Meaningful Counting and Skip Counting</li>
              <li>Whole Number – Representing and Partitioning Quantities</li>
              <li>Whole Number – Comparing and Ordering Quantities</li>
              <li>Whole Number – Understanding Place Value</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="fractions-decimals-rational-numbers"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Fractions, Decimals and Rational Numbers
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Fractions, Decimals and Rational Numbers – Representing Fractions</li>
              <li>Fractions, Decimals and Rational Numbers – Comparing and Ordering Fractions</li>
              <li>Fractions, Decimals and Rational Numbers – Representing Decimals</li>
              <li>Fractions, Decimals and Rational Numbers – Comparing and Ordering Decimals</li>
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
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">Number Sense</AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Read and write numbers in words and figures up to 1 000 000 (seven digits)</li>
                    <li>
                      State the face value, place value and total value of any digit in a whole number up to 999 999
                      999.
                    </li>
                    <li>Identify and describe special sets of numbers (square, prime and composite)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Fractions, Decimals and Rational Numbers
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Explain a fraction as the division of the numerator by the denominator using concrete, pictorial,
                      verbal and symbolic representation.
                    </li>
                    <li>Express a whole number division equation as a fraction.</li>
                    <li>Explain a fraction as a ratio showing part to part or part to whole relationship.</li>
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
              <li>Base ten blocks and place value charts</li>
              <li>Number lines and hundred charts</li>
              <li>Fraction bars and circles</li>
              <li>Decimal squares and grids</li>
              <li>Calculators for verification</li>
              <li>Counting materials and sorting trays</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Virtual manipulatives for number sense</li>
              <li>Interactive number line activities</li>
              <li>Fraction and decimal comparison tools</li>
              <li>Place value games and simulations</li>
              <li>Educational videos on number concepts</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Number Sense and Nonsense" by Claudia Zaslavsky</li>
            <li>"Building Number Sense Through the Common Core" by Bradley Witzel</li>
            <li>"Teaching Number Sense" by Chris Confer</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
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
