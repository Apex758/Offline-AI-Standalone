import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Hash, Calculator, ClipboardCheck } from "lucide-react"

export default function NumberSensePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-teal-200 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-700 flex items-center">
            <Hash className="mr-2 h-7 w-7 text-teal-600" />
            Number Sense
          </h1>
          <p className="text-gray-700">
            Number Sense is the foundation for all mathematical thinking. In Grade 2, students develop a deeper
            understanding of numbers up to 100, including place value, comparing and ordering numbers, and working with
            simple fractions. They learn to recognize patterns in numbers and develop mental math strategies.
          </p>
        </div>
      </div>

      <div className="bg-teal-50 p-6 rounded-lg border border-teal-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-teal-700 flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Grade Two Expectations for Number Sense
        </h3>

        <Tabs defaultValue="whole-numbers">
          <TabsList className="grid w-full grid-cols-2 bg-teal-100">
            <TabsTrigger
              value="whole-numbers"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              Whole Numbers
            </TabsTrigger>
            <TabsTrigger value="fractions" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Fractions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whole-numbers" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Whole Number - Saying Number Sequence, Meaningful Counting and Skip Counting
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Count with meaning to 100 by building quantities and matching quantity and numeral</li>
              <li>Say the number sequence to 200 by 1s, 2s, 5s, and 10s</li>
              <li>Use number lines and hundreds charts to support counting & skip counting</li>
              <li>Determine whether a group of objects (up to 20) has an odd or even number of members</li>
              <li>Compare two two-digit numbers using a variety of strategies</li>
              <li>Use &lt;, =, and &gt; symbols to record the results of comparisons</li>
              <li>Understand place value for numbers up to 100</li>
              <li>Use place value understanding to round whole numbers to the nearest 10</li>
            </ul>
          </TabsContent>

          <TabsContent value="fractions" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Fractions, Decimals and Rational Numbers - Representing and Comparing
              Fractions
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal
                parts
              </li>
              <li>Understand a fraction a/b as the quantity formed by a parts of size 1/b</li>
              <li>
                Partition shapes into parts with equal areas and express the area of each part as a unit fraction of the
                whole
              </li>
              <li>
                Compare two fractions with the same denominator (limited to halves and quarters) by reasoning about
                their size
              </li>
              <li>Recognize that comparisons are valid only when the two fractions refer to the same whole</li>
              <li>Record the results of comparisons with the symbols &gt;, =, or &lt; and justify the conclusions</li>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Whole Number - Counting and Number Sequence
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Count by 1s, 2s, 5s and 10s, forward and backward, to 100</li>
                    <li>
                      Say number sequence by 1s, 2s, 5s and 10s, forward and backward, starting from any point, to 100
                    </li>
                    <li>Read, write and represent whole numbers from 1 - 100</li>
                    <li>Demonstrate different ways of representing numbers from 1 - 100</li>
                    <li>Skip count orally in 2s, 5s and 10s up to 200</li>
                    <li>Use a variety of methods to count and skip count</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Whole Number - Even and Odd Numbers
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Distinguish between odd and even numbers for groups with up to 20 objects</li>
                    <li>Identify equations that express an even number as a sum of two equal addends</li>
                    <li>Write an equation to express an even number as a sum of two numbers of equal value</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Whole Number - Comparing and Ordering
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Compare and order numbers up to 100 in ascending or descending order</li>
                    <li>
                      Indicate and describe the position of specific numbers in a sequence by using ordinal numbers up
                      to tenth
                    </li>
                    <li>Identify 2-digit numbers</li>
                    <li>Use vocabulary related to comparing numbers (greater than, less than, equal to)</li>
                    <li>Distinguish among the symbols (&lt;, &gt;, and =) used to compare 2-digit numbers</li>
                    <li>Arrange numbers in order of size and give reasons for their arrangement</li>
                    <li>Use relevant vocabulary to orally compare numbers (greater than, less than, equal to)</li>
                    <li>Compare pairs of 2-digit numbers using the symbols (&lt;, &gt; and =)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Whole Number - Place Value
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Identify and contrast among the face value, place value, and total value of the digits in any
                      two-digit number
                    </li>
                    <li>
                      Represent numbers concretely and pictorially up to ninety-nine (99) as groups of tens and ones
                    </li>
                    <li>Write the place value and total value of any digit in a 2-digit number</li>
                    <li>Round two-digit numbers to the nearest 10</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Fractions - Representing Fractions
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Recognize simple fractions as representation of the parts of a whole</li>
                    <li>Identify unit fractions correctly</li>
                    <li>Distinguish between the numerator and the denominator</li>
                    <li>Partition given shapes into parts with equal sections</li>
                    <li>Shade parts of given shapes to represent named unit fractions up to eighths</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Fractions - Compare and Ordering Fractions
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Read and write the fractions ½ and ¼ correctly as 'one half' and 'one quarter'</li>
                    <li>
                      Compare two fractions with the same denominator (limited to halves and quarters) referring to the
                      same whole
                    </li>
                    <li>Order fractions with the same denominator (halves and quarters)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-lime-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-lime-50">
              <CardTitle className="text-lime-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-lime-700">Observations:</strong> Teacher observations during hands-on
                  activities, group work, and discussions about numbers and fractions
                </li>
                <li>
                  <strong className="text-lime-700">Conversations:</strong> Student explanations, questions, and
                  discussions about number concepts and relationships
                </li>
                <li>
                  <strong className="text-lime-700">Products:</strong> Student drawings, charts, tables, and written
                  responses demonstrating understanding of number sense
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-lime-50 to-teal-50 rounded-lg border border-lime-100">
                <h4 className="font-semibold mb-2 text-lime-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for number sequence and counting activities</li>
                  <li>Rubrics for evaluating student understanding of place value and fractions</li>
                  <li>Math journals with prompts for reflection and self-assessment</li>
                  <li>Performance tasks involving comparing and ordering numbers</li>
                  <li>Exit tickets to assess daily learning objectives</li>
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
                  <AccordionTrigger>Counting and Number Sequence</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Counting Collections:</strong> Provide opportunities for students to experience counting
                        in 1s, 2s, 5s and 10s through games, songs, and real-life situations.
                      </li>
                      <li>
                        <strong>Number Line Activities:</strong> Use number lines to help students visualize number
                        sequences and skip counting patterns.
                      </li>
                      <li>
                        <strong>Hundreds Chart Exploration:</strong> Have students use hundreds charts to discover
                        patterns when counting by different intervals.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Even and Odd Numbers</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Pairing Activities:</strong> Have students use square tiles to make equal rows and
                        identify which numbers make equal rows and which do not.
                      </li>
                      <li>
                        <strong>Sorting Games:</strong> Provide activities where students sort numbers into even and odd
                        groups and explain their reasoning.
                      </li>
                      <li>
                        <strong>Visual Models:</strong> Use visual representations to help students see the difference
                        between even and odd numbers.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Place Value Understanding</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Base-Ten Blocks:</strong> Use base-ten blocks to help students understand the concept of
                        tens and ones.
                      </li>
                      <li>
                        <strong>Place Value Mats:</strong> Have students use place value mats to represent two-digit
                        numbers.
                      </li>
                      <li>
                        <strong>Trading Activities:</strong> Engage students in activities where they trade 10 ones for
                        1 ten to reinforce place value concepts.
                      </li>
                      <li>
                        <strong>Rounding Games:</strong> Use number lines and hundreds charts to help students
                        understand rounding to the nearest ten.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Fractions</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Fraction Models:</strong> Use concrete models like fraction circles, fraction strips,
                        and pattern blocks to explore fractions.
                      </li>
                      <li>
                        <strong>Equal Sharing Activities:</strong> Engage students in activities that involve sharing
                        items equally among groups.
                      </li>
                      <li>
                        <strong>Paper Folding:</strong> Have students fold paper into equal parts to create halves,
                        quarters, and eighths.
                      </li>
                      <li>
                        <strong>Real-Life Connections:</strong> Connect fractions to real-life situations like sharing
                        food or dividing time.
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
                <li>Number lines and hundreds charts</li>
                <li>Counting objects and manipulatives</li>
                <li>Fraction models and fraction circles</li>
                <li>Number cards and dice</li>
                <li>OECS Grade 2 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual number lines and hundreds charts</li>
                <li>Counting collections</li>
                <li>Math journals for recording observations and strategies</li>
                <li>Fraction manipulatives</li>
                <li>Number cards for comparing and ordering activities</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Number sense development in young children is an important link to future mathematics achievement. It is
              important to constantly check for understanding as students build on their previous knowledge to make
              further connections and identify relationships among numbers. Number sense is fundamental to all other
              areas in Math and making connections to real-life issues. A good knowledge of number sense from an early
              age will prepare students to make critical decisions in life.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
