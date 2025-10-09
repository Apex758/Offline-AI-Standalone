import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5MathematicsNumberSensePage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Number Sense", href: "/curriculum/grade5-subjects/mathematics/number-sense" },
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
            Grade 5 Mathematics - Number Sense
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Number Sense strand of the Grade 5 Mathematics curriculum. Develop a strong understanding of
            numbers, their relationships, and their properties.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Number Sense
        </h3>

        <Tabs defaultValue="whole-number">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-indigo-100">
            <TabsTrigger
              value="whole-number"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Whole Number
            </TabsTrigger>
            <TabsTrigger
              value="representing-quantities"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Representing and Partitioning Quantities
            </TabsTrigger>
            <TabsTrigger
              value="comparing-quantities"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Comparing and Ordering Quantities
            </TabsTrigger>
            <TabsTrigger
              value="understanding-place"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Understanding Place
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whole-number" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Whole Number</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Demonstrate an understanding of the meaning of all whole numbers to six digits</li>
              <li>Model, describe, and identify special sets of numbers (E.g., square, prime, and composite)</li>
              <li>Count by 2s, 5s, 10s, 100s, 1000s and 10 000s from any number (to 100 000)</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="representing-quantities"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Representing and Partitioning Quantities
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Read, represent and partition any given number to 100 000 concretely, pictorially, and symbolically
              </li>
              <li>
                Read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form to 100
                000.
              </li>
            </ul>
          </TabsContent>

          <TabsContent
            value="comparing-quantities"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">Essential Learning Outcome 3: Comparing and Ordering Quantities</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Compare two multi-digit numbers based on the meanings of the digits in each place (to five place
                values), using {">"}, {"="}, and {"<"} symbols to record the results of comparisons.
              </li>
              <li>Tell the number that is 100, 1000, 10,000, or 100,000 more or less than a given number.</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="understanding-place"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">Essential Learning Outcome 4: Understanding Place</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Recognise that in a multi-digit number, a digit in one place represents 10 times as much as it
                represents in the place to its right and 1/10 of what it represents in the place to its left
              </li>
              <li>
                Represent the place value of numbers in base-ten groupings concretely, pictorially, contextually,
                verbally and symbolically
              </li>
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
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">Whole Number</AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and describe special sets of numbers (square, prime, and composite)</li>
                    <li>Skip count by 2s, 5s, 10s, 100s, 1000s and 10 000s from any number up to 100 000</li>
                    <li>
                      Complete increasing and decreasing number sequences (including special sets of numbers, such as
                      square, prime and composite), beginning at any point
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Representing and Partitioning Quantities
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Represent/ Model five-digit numbers concretely, pictorially, and symbolically</li>
                    <li>Read and write multi-digit whole numbers up to six digits using base-ten numerals and names</li>
                    <li>Express whole numbers up to 100 000 in expanded form</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Comparing and Ordering Quantities
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Compare two whole numbers up to 99 999 using the symbols {">"}, {"="}, and {"<"}
                    </li>
                    <li>
                      Calculate the whole number that is 100, 1000, 10 000 or 100 000 more or less than a given number
                      up to five digits.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Understanding Place
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Recognise that in a multi-digit whole number up to 100 000, each place has a value of ten times
                      greater than the place immediately to its right
                    </li>
                    <li>
                      Recognise and apply the principle that in a whole number up to 100,000, each place is 1/10 of what
                      it represents in the place to its left.
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
                  <strong className="text-indigo-700">Product:</strong> Group Work
                </li>
                <li>
                  <strong className="text-indigo-700">Product:</strong> Ask learners to create a Venn Diagram to show
                  the relationship between Prime and Composite / Odd and prime etc. for Whole Numbers from 1 to 20.
                </li>
                <li>
                  <strong className="text-indigo-700">Observation:</strong> Observe and listen to learners skip count by
                  2’s, 5’s, 10’s, 100’s, 1000’s, and 10 000’s up to 100 000 starting from different points.
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Product: Exit Cards</li>
                  <li>Observational Checklist</li>
                  <li>Think - Pair - Share</li>
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
                  <AccordionTrigger>
                    Provide opportunities for learners to investigate special sets of numbers
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Provide opportunities for learners to investigate special sets of numbers such as odd, even,
                        square, prime and composite numbers; identify and describe them using arrays.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Have learners use concrete materials</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Have learners use concrete materials like money, number lines and place value blocks to skip
                        count by 2’s, 5’s, 10’s, 20’s, 100’s, 1000’s and 10 000’s.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>
                    Provide opportunities for discussion about pattern and order of sequences presented
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Provide opportunities for discussion about pattern and order of sequences presented. Invite
                        learners to complete number sequences starting from different points and also including special
                        numbers.
                      </li>
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
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Number lines</li>
              <li>Number cards</li>
              <li>Counters ( beads, stones, pebbles, sticks)</li>
              <li>Coins, bills</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Websites</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <Link href="https://www.youtube.com/watch?v=oVa_cAllL-w" target="_blank" rel="noopener noreferrer">
                  https://www.youtube.com/watch?v=oVa_cAllL-w
                </Link>
              </li>
              <li>
                <Link
                  href="https://elementaryedu.com/2022/08/games-for-comparing-numbers.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://elementaryedu.com/2022/08/games-for-comparing-numbers.html
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
