import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calculator, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function OperationsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <Calculator className="mr-2 h-7 w-7 text-blue-600" />
            Operations with Numbers
          </h1>
          <p className="text-gray-700">
            In Grade 3, students develop fluency with addition, subtraction, multiplication, and division. They learn
            various strategies for computing with whole numbers, understand the relationships between operations, and
            apply these skills to solve real-world problems.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Operations with Numbers
        </h3>

        <Tabs defaultValue="additive">
          <TabsList className="grid w-full grid-cols-2 bg-blue-100">
            <TabsTrigger value="additive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Addition & Subtraction
            </TabsTrigger>
            <TabsTrigger
              value="multiplicative"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Multiplication & Division
            </TabsTrigger>
          </TabsList>

          <TabsContent value="additive" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Addition and Subtraction - Developing fluency with larger numbers
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Add and subtract whole numbers up to 1,000 with regrouping</li>
              <li>Use mental math strategies for addition and subtraction</li>
              <li>Estimate sums and differences</li>
              <li>Solve word problems involving addition and subtraction</li>
              <li>Understand and apply the relationship between addition and subtraction</li>
              <li>Use properties of operations to solve problems efficiently</li>
            </ul>
          </TabsContent>

          <TabsContent value="multiplicative" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Multiplication and Division - Building fluency with basic facts
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Understand multiplication as repeated addition and arrays</li>
              <li>Develop fluency with multiplication facts (0-10)</li>
              <li>Use properties of multiplication (commutative, associative, distributive)</li>
              <li>Multiply one-digit numbers by multiples of 10</li>
              <li>Understand division as sharing and grouping</li>
              <li>Develop fluency with division facts related to multiplication facts</li>
              <li>Understand and apply the relationship between multiplication and division</li>
              <li>Interpret remainders in division problems</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Addition and Subtraction
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Add and subtract whole numbers up to 1,000 with regrouping</li>
                    <li>Use mental math strategies for addition and subtraction</li>
                    <li>Estimate sums and differences using rounding and other strategies</li>
                    <li>Solve multi-step word problems involving addition and subtraction</li>
                    <li>Use the inverse relationship between addition and subtraction to check answers</li>
                    <li>Apply properties of operations to develop efficient computation strategies</li>
                    <li>
                      Use appropriate tools (number lines, base-ten blocks, algorithms) to solve addition and
                      subtraction problems
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Multiplication Concepts and Facts
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Represent multiplication using equal groups, arrays, and area models</li>
                    <li>Develop fluency with multiplication facts through 10 × 10</li>
                    <li>
                      Apply properties of multiplication (commutative, associative, distributive) to solve problems
                    </li>
                    <li>Multiply one-digit whole numbers by multiples of 10</li>
                    <li>Use strategies based on place value and properties of operations to multiply</li>
                    <li>Solve word problems involving multiplication</li>
                    <li>Use multiplication to find area of rectangles</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Division Concepts and Facts
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Understand division as sharing (partitive) and grouping (quotative)</li>
                    <li>Develop fluency with division facts related to multiplication facts</li>
                    <li>Represent division using equal groups, arrays, and area models</li>
                    <li>Interpret remainders in division problems based on context</li>
                    <li>Use the relationship between multiplication and division to solve problems</li>
                    <li>Solve word problems involving division</li>
                    <li>Use strategies based on place value and properties of operations to divide</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Problem Solving with Operations
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Solve multi-step word problems using the four operations</li>
                    <li>Represent problems using equations with a letter for the unknown</li>
                    <li>Assess the reasonableness of answers using estimation</li>
                    <li>Identify and explain patterns in arithmetic</li>
                    <li>Apply operations to solve real-world problems</li>
                    <li>Use appropriate tools and strategies to solve problems efficiently</li>
                    <li>Explain solution strategies using mathematical language</li>
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
                  <strong className="text-indigo-700">Observations:</strong> Teacher observations during problem-solving
                  activities, group work, and discussions about operations
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Student explanations of their strategies
                  and reasoning when solving addition, subtraction, multiplication, and division problems
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Student work samples, including written
                  solutions, drawings, and models demonstrating their understanding of operations
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for operation strategies</li>
                  <li>Rubrics for evaluating student understanding of multiplication and division concepts</li>
                  <li>Performance tasks involving multi-step word problems</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Math journals for students to explain their thinking and strategies</li>
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
                  <AccordionTrigger>Addition and Subtraction Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Place Value Strategies:</strong> Use base-ten blocks, place value charts, and other
                        manipulatives to help students understand regrouping in addition and subtraction with larger
                        numbers.
                      </li>
                      <li>
                        <strong>Mental Math Strategies:</strong> Teach students strategies for mental addition and
                        subtraction, such as making tens, using doubles, and using the relationship between addition and
                        subtraction.
                      </li>
                      <li>
                        <strong>Estimation Skills:</strong> Develop estimation skills to help students assess the
                        reasonableness of their answers.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Multiplication Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concrete Models:</strong> Use manipulatives like counters, tiles, or cubes to build
                        arrays and explore equal groups.
                      </li>
                      <li>
                        <strong>Visual Representations:</strong> Have students draw arrays and area models to represent
                        multiplication situations.
                      </li>
                      <li>
                        <strong>Fact Strategies:</strong> Teach strategies for learning multiplication facts, such as
                        skip counting, doubling, and using known facts to find unknown facts.
                      </li>
                      <li>
                        <strong>Properties of Multiplication:</strong> Explicitly teach and apply the commutative,
                        associative, and distributive properties.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Division Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Equal Sharing Activities:</strong> Engage students in activities that involve sharing
                        items equally among groups to develop division concepts.
                      </li>
                      <li>
                        <strong>Connection to Multiplication:</strong> Emphasize the relationship between multiplication
                        and division as inverse operations.
                      </li>
                      <li>
                        <strong>Interpreting Remainders:</strong> Provide contexts where students must interpret
                        remainders in different ways based on the problem situation.
                      </li>
                      <li>
                        <strong>Division Models:</strong> Use arrays, area models, and number lines to represent
                        division.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Problem-Solving Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Multiple Representations:</strong> Encourage students to use multiple representations
                        (concrete, pictorial, abstract) when solving problems.
                      </li>
                      <li>
                        <strong>Think-Aloud Modeling:</strong> Model problem-solving strategies by thinking aloud as you
                        solve problems, making your thinking visible to students.
                      </li>
                      <li>
                        <strong>Collaborative Problem Solving:</strong> Provide opportunities for students to work
                        together to solve problems, sharing their strategies and reasoning.
                      </li>
                      <li>
                        <strong>Real-World Connections:</strong> Connect operations to meaningful contexts that students
                        can relate to in their daily lives.
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
                <li>Counters and manipulatives for building arrays</li>
                <li>Number lines and hundreds charts</li>
                <li>Multiplication and division fact cards</li>
                <li>Word problem cards and task cards</li>
                <li>OECS Grade 3 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual manipulatives for modeling operations</li>
                <li>Math journals for recording strategies and solutions</li>
                <li>Visual aids for addition, subtraction, multiplication, and division</li>
                <li>Fact fluency practice materials</li>
                <li>Personal hundreds charts and number lines</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              In Grade 3, students build on their understanding of addition and subtraction while developing fluency
              with multiplication and division. The four operations are interconnected, with addition and subtraction
              being inverse operations, and multiplication and division being inverse operations. Understanding these
              relationships helps students develop efficient strategies and check their work. Students should be
              encouraged to use multiple strategies and representations when solving problems, and to explain their
              reasoning. The development of fact fluency is important, but should be built on conceptual understanding
              rather than rote memorization. Teachers should emphasize the application of operations in real-world
              contexts to help students see the relevance and utility of these mathematical skills.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
