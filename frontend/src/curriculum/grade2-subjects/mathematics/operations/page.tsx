import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calculator, ClipboardCheck } from "lucide-react"

export default function OperationsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <Calculator className="mr-2 h-7 w-7 text-blue-600" />
            Operations with Numbers
          </h1>
          <p className="text-gray-700">
            In Grade 2, students build on their understanding of addition and subtraction while being introduced to the
            foundations of multiplication and division. They develop strategies for solving more complex problems and
            begin to understand the relationship between operations.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Operations with Numbers
        </h3>

        <Tabs defaultValue="additive">
          <TabsList className="grid w-full grid-cols-2 bg-blue-100">
            <TabsTrigger value="additive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Additive Thinking
            </TabsTrigger>
            <TabsTrigger
              value="multiplicative"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Multiplicative Thinking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="additive" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Additive Thinking - Understanding addition, subtraction and their
              relationship
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Add up to three two-digit numbers using strategies based on place value and properties of operations
              </li>
              <li>Add and subtract within 100, using concrete models, drawings, and strategies based on place value</li>
              <li>
                Mentally add 10 or 100 to a given number 100-900, and mentally subtract 10 or 100 from a given number
                100-900
              </li>
              <li>
                Represent and solve addition and subtraction word problems within 100, with unknowns in all positions
              </li>
              <li>
                Use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and up
                to 5 columns
              </li>
              <li>Write an equation to express the total as a sum of equal addends</li>
            </ul>
          </TabsContent>

          <TabsContent value="multiplicative" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Multiplicative Thinking - Understanding multiplication, division and their
              relationship
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Represent multiplication as repeated equal groups, including groups of one-half and one-fourth</li>
              <li>Solve problems related to multiplication using various tools and drawings</li>
              <li>Represent division of up to 12 items as the equal sharing of a quantity</li>
              <li>Solve division problems using various tools and drawings</li>
              <li>Understand the relationship between multiplication and division</li>
              <li>Use arrays to model multiplication and division concepts</li>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Addition and Subtraction Concepts
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Add up to three two-digit numbers within 100 using a variety of strategies without and with
                      regrouping
                    </li>
                    <li>
                      Subtract two-digit number from two-digit number using a variety of strategies without and with
                      regrouping
                    </li>
                    <li>Mentally demonstrate their ability to add 10's or 100's up to 900 from a given number</li>
                    <li>Identify that addition is the opposite of subtraction</li>
                    <li>Use appropriate vocabulary to explain addition and subtraction strategies</li>
                    <li>
                      Use a variety of strategies and tools to add and subtract two-digit numbers with and without
                      regrouping
                    </li>
                    <li>
                      Use problem solving strategies for up to two step problem involving addition and subtraction using
                      single digits
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Arrays and Equal Groups
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows
                      and up to 5 columns
                    </li>
                    <li>Write an equation to express total as a sum of equal addends</li>
                    <li>
                      Demonstrate initial multiplication and division knowledge related to sharing, grouping and array
                    </li>
                    <li>Show how multiplication undo division and vice versa</li>
                    <li>Finding a missing quantity given the whole and another known quantity</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Multiplication and Division Concepts
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Explain in your own words the concept of linear measurement</li>
                    <li>Interpret repeated addition procedures, using terms such as 'sets of', 'times', 'groups of'</li>
                    <li>Use mathematical language such as '4 threes' and '2 groups of 5' to describe equal groups</li>
                    <li>
                      Demonstrate their understanding of the word multiplication and division by correctly solving
                      problems
                    </li>
                    <li>Write a number sentence for a given situation involving multiplication or division</li>
                    <li>Solve a 1-step picture problem involving multiplication and division</li>
                    <li>Work out a multiplication fact by repeated addition</li>
                    <li>Make a number story for a given multiplication or division sentence</li>
                    <li>Demonstrate the ability to share objects equally in groups or sets</li>
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
                  <li>Observation checklists for addition and subtraction strategies</li>
                  <li>Rubrics for evaluating student understanding of arrays and equal groups</li>
                  <li>Performance tasks involving solving word problems</li>
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
                        manipulatives to help students understand regrouping in addition and subtraction.
                      </li>
                      <li>
                        <strong>Mental Math Strategies:</strong> Teach students strategies for mental addition and
                        subtraction, such as making tens, using doubles, and using the relationship between addition and
                        subtraction.
                      </li>
                      <li>
                        <strong>Problem-Solving Contexts:</strong> Present addition and subtraction in meaningful
                        contexts through word problems and real-life situations.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Arrays and Equal Groups</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concrete Models:</strong> Use manipulatives like counters, tiles, or cubes to build
                        arrays and explore equal groups.
                      </li>
                      <li>
                        <strong>Visual Representations:</strong> Have students draw arrays and equal groups to represent
                        multiplication and division situations.
                      </li>
                      <li>
                        <strong>Connection to Addition:</strong> Help students see the connection between repeated
                        addition and multiplication by using arrays.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Multiplication and Division Concepts</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Equal Sharing Activities:</strong> Engage students in activities that involve sharing
                        items equally among groups to develop division concepts.
                      </li>
                      <li>
                        <strong>Story Problems:</strong> Use story problems to help students understand when to use
                        multiplication or division in real-life situations.
                      </li>
                      <li>
                        <strong>Games and Activities:</strong> Incorporate games and activities that reinforce
                        multiplication and division concepts, such as creating equal groups or arrays.
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
                <li>Word problem cards and task cards</li>
                <li>OECS Grade 2 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual manipulatives for modeling operations</li>
                <li>Math journals for recording strategies and solutions</li>
                <li>Visual aids for addition, subtraction, multiplication, and division</li>
                <li>Number cards and dice for math games</li>
                <li>Personal hundreds charts and number lines</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Addition and subtraction are two operations which must be clear to young children. Addition in math is a
              process of combining two or more numbers. Addends are the numbers being added, and the result or the final
              answer we get after the process is called the sum. The operation or process of finding the difference
              between two numbers or quantities is known as subtraction. Multiplication is one of the four basic Math
              operations. It is the opposite of division. When we multiply numbers (factors), our answer (product) gets
              bigger. Multiplication gives the same answer as repeated addition, that is, we add the same
              number/quantity a number of times.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
