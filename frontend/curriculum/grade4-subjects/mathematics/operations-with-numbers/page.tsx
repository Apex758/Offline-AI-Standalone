import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade4MathematicsOperationsPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4 Subjects", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          { label: "Operations with Numbers", href: "/curriculum/grade4-subjects/mathematics/operations-with-numbers" },
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
            Grade 4 Mathematics - Operations with Numbers
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Operations with Numbers strand of the Grade 4 Mathematics curriculum. Build fluency with
            addition, subtraction, multiplication, and division, and apply them to solve real-world problems.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Operations with Numbers
        </h3>

        <Tabs defaultValue="additive-thinking">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="additive-thinking"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Additive Thinking
            </TabsTrigger>
            <TabsTrigger
              value="multiplicative-thinking"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Multiplicative Thinking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="additive-thinking" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Understanding Addition and Subtraction</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Understand a fraction a/b with a &gt; 1 as a sum of fractions 1/b</li>
              <li>
                Decompose a fraction into a sum of fractions with the same denominator in more than one way, recording
                each decomposition with an equation
              </li>
              <li>
                Use concrete models or drawings and strategies based on place value to add and subtract decimals to
                tenths
              </li>
            </ul>
          </TabsContent>

          <TabsContent
            value="multiplicative-thinking"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Understanding Multiplication and Division
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Use strategies to recall multiplication facts to 100 and related division facts</li>
              <li>Represent multiplication concretely with rectangle and array models using a variety of materials</li>
              <li>
                Find whole-number quotients and remainders with up to three-digit dividends and one-digit divisors
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
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Additive Thinking
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Decompose a fraction less than or equal to 1 into a sum of fractions with the same denominator in
                      more than one way, recording each decomposition with an equation
                    </li>
                    <li>Justify decompositions with a visual model, such as a tape diagram or number line</li>
                    <li>
                      Use concrete models or drawings and strategies based on place value to add and subtract decimals
                      to tenths
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Multiplicative Thinking
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use strategies to recall multiplication facts to 100</li>
                    <li>Represent multiplication concretely using a variety of materials</li>
                    <li>Demonstrate the relationship between multiplication and division by using simple examples</li>
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
                  <li>Observation checklists for operations skills</li>
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
                      <li>Use counters to model multiplication</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Aids</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use area models to represent multiplication</li>
                      <li>Use diagrams to illustrate fractions</li>
                      <li>Use number lines to model addition and subtraction</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect operations to real-world scenarios</li>
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Additional Resources and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Manipulatives</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Base-ten blocks</li>
              <li>Counters and tokens</li>
              <li>Array cards</li>
              <li>Multiplication tables</li>
              <li>Division boards</li>
              <li>Fraction manipulatives</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive multiplication games</li>
              <li>Division practice apps</li>
              <li>Virtual manipulatives for operations</li>
              <li>Fact fluency websites</li>
              <li>Educational videos on operations</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Mastering the Basic Math Facts in Multiplication and Division" by Susan O'Connell</li>
            <li>"Teaching Arithmetic: Lessons for Extending Multiplication" by Maryann Wickett</li>
            <li>"Minilessons for Operations with Fractions, Decimals, and Percents" by Catherine Twomey Fosnot</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
