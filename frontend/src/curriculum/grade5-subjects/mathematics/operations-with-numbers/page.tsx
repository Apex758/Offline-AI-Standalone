import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5MathematicsOperationsPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Operations with Numbers", href: "/curriculum/grade5-subjects/mathematics/operations-with-numbers" },
        ]}
      />

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Grade 5 Mathematics - Operations with Numbers
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Operations with Numbers strand of the Grade 5 Mathematics curriculum. Develop fluency with
            multi-digit operations and extend understanding to fractions and decimals.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Operations with Numbers
        </h3>

        <Tabs defaultValue="whole-number-operations">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="whole-number-operations"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Whole Number Operations
            </TabsTrigger>
            <TabsTrigger
              value="fraction-decimal-operations"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Fraction & Decimal Operations
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="whole-number-operations"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Whole Number Operations</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Fluently multiply multi-digit whole numbers using the standard algorithm</li>
              <li>Find whole-number quotients of whole numbers with up to four-digit dividends</li>
              <li>Use parentheses, brackets, or braces in numerical expressions and evaluate expressions</li>
              <li>Write simple expressions and interpret patterns in numerical expressions</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="fraction-decimal-operations"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Fraction and Decimal Operations</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Add and subtract fractions with unlike denominators using equivalent fractions</li>
              <li>Solve word problems involving addition and subtraction of fractions</li>
              <li>Interpret a fraction as division of the numerator by the denominator</li>
              <li>Multiply a fraction or whole number by a fraction</li>
              <li>Add, subtract, multiply, and divide decimals to hundredths</li>
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
                  Multi-Digit Operations
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Multiply multi-digit numbers using standard algorithm with fluency</li>
                    <li>Divide multi-digit numbers using long division algorithm</li>
                    <li>Estimate products and quotients to check reasonableness</li>
                    <li>Solve multi-step word problems using multiple operations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Fraction Operations
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Add and subtract fractions with unlike denominators</li>
                    <li>Multiply fractions by whole numbers and other fractions</li>
                    <li>Divide unit fractions by whole numbers</li>
                    <li>Solve real-world problems involving fraction operations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Decimal Operations
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Add and subtract decimals to hundredths</li>
                    <li>Multiply decimals by whole numbers</li>
                    <li>Divide decimals by whole numbers</li>
                    <li>Apply decimal operations to money and measurement</li>
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
                  <strong className="text-indigo-700">Observations:</strong> Strategy use during problem solving
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Mathematical reasoning and explanations
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Computational fluency assessments
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Multi-step problem solving rubrics</li>
                  <li>Computational fluency checks</li>
                  <li>Error analysis tasks</li>
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
                      <li>Use base-ten blocks for multiplication and division</li>
                      <li>Use fraction bars and circles for fraction operations</li>
                      <li>Use decimal grids for decimal operations</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Models</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use area models for multiplication</li>
                      <li>Use number lines for fraction operations</li>
                      <li>Use arrays and grids for division</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Problem-Solving Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Teach multiple solution strategies</li>
                      <li>Encourage estimation and checking</li>
                      <li>Connect to real-world applications</li>
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
              <li>Base-ten blocks and place value mats</li>
              <li>Fraction bars, circles, and tiles</li>
              <li>Decimal squares and grids</li>
              <li>Multiplication and division arrays</li>
              <li>Calculators for verification</li>
              <li>Algorithm charts and reference sheets</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Virtual manipulatives for operations</li>
              <li>Interactive algorithm demonstrations</li>
              <li>Fraction and decimal operation tools</li>
              <li>Problem-solving simulation games</li>
              <li>Educational videos on operation strategies</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Teaching Student-Centered Mathematics" by John A. Van de Walle</li>
            <li>"Building Thinking Classrooms in Mathematics" by Peter Liljedahl</li>
            <li>"5 Practices for Orchestrating Productive Mathematics Discourse" by Margaret Smith</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
