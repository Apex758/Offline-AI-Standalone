import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade4MathematicsNumberSensePage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4 Subjects", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          { label: "Number Sense", href: "/curriculum/grade4-subjects/mathematics/number-sense" },
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
            Grade 4 Mathematics - Number Sense
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Number Sense strand of the Grade 4 Mathematics curriculum. Develop a deeper understanding of
            numbers up to 10,000, including place value, comparing and ordering numbers, and working with fractions and
            decimals.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Number Sense
        </h3>

        <Tabs defaultValue="whole-numbers">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="whole-numbers"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Whole Numbers
            </TabsTrigger>
            <TabsTrigger
              value="fractions-decimals"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Fractions & Decimals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whole-numbers" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Understanding Whole Numbers up to 10,000
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Demonstrate an understanding of the meaning of all whole numbers to five digits (to 10 000)</li>
              <li>Count by 2s, 5s, 10s, 100s, and 1000s from any number (to 10 000)</li>
              <li>
                Read, represent, and partition any given number to 10 000 concretely, pictorially, and symbolically
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="fractions-decimals" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Understanding Fractions and Decimals</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size
              </li>
              <li>
                Describe two fractions as equivalent (equal) if they are the same size parts of the same one-whole, or
                the same point on a number line
              </li>
              <li>
                Represent proper fractions and decimal tenths concretely, pictorially, contextually and symbolically
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
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">Whole Numbers</AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Skip count by 2s, 5s, 10s, 50s, 100s, and 1000s from any number to 10 000</li>
                    <li>
                      Say number sequence by 2s, 5s,10s, 100s and 1000s forward and backward, starting from any point,
                      to 10 000
                    </li>
                    <li>
                      Model skip- counting by 2s, 3s, 5s, 10s, 100s, and 1000 using number lines, currency and concrete
                      materials.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Fractions and Decimals
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Match number words/names and numerals up to 10,000 with the quantities they represent</li>
                    <li>
                      Represent whole numbers up to 10,000 using various models (concretely, pictorially, and
                      symbolically)
                    </li>
                    <li>Read and write 4-digit whole numbers up to 10 000 in standard and expanded form</li>
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
                  <li>Observation checklists for number sense skills</li>
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
                      <li>Use base-ten blocks to represent numbers</li>
                      <li>Use fraction bars to visualize fractions</li>
                      <li>Use number lines to compare numbers</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Aids</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use place value charts to organize numbers</li>
                      <li>Use diagrams to illustrate fractions</li>
                      <li>Use number lines to compare decimals</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect number sense to real-world scenarios</li>
                      <li>Use money to represent decimals</li>
                      <li>Use cooking to represent fractions</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl shadow-md border border-teal-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-teal-700">Additional Resources and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-teal-600">Manipulatives</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Base-ten blocks</li>
              <li>Place value charts</li>
              <li>Number lines (0-10,000)</li>
              <li>Fraction circles and bars</li>
              <li>Decimal squares and grids</li>
              <li>Counting chips and tokens</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-teal-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive number lines</li>
              <li>Place value games</li>
              <li>Virtual manipulatives for fractions</li>
              <li>Number sense apps and websites</li>
              <li>Educational videos on place value</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-teal-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Math Matters: Understanding the Math You Teach" by Suzanne H. Chapin</li>
            <li>"Teaching Student-Centered Mathematics" by John A. Van de Walle</li>
            <li>"Number Talks: Helping Children Build Mental Math and Computation Strategies" by Sherry Parrish</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
