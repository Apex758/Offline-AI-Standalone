import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Repeat, ClipboardCheck } from "lucide-react"

export default function PatternsRelationshipsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <Repeat className="mr-2 h-7 w-7 text-amber-600" />
            Patterns and Relationships
          </h1>
          <p className="text-gray-700">
            In Grade 2, students expand their understanding of patterns by identifying, creating, and extending more
            complex patterns. They learn to recognize patterns in numbers and shapes, and begin to understand how
            patterns can be used to solve problems and make predictions.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Patterns and Relationships
        </h3>

        <Tabs defaultValue="patterns">
          <TabsList className="grid w-full grid-cols-2 bg-amber-100">
            <TabsTrigger value="patterns" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Patterns
            </TabsTrigger>
            <TabsTrigger value="variables" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Variables and Relationships
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Recognizing, Describing and Extending Patterns
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Create and extend simple patterns, repeating and growing patterns</li>
              <li>
                Identify and describe a variety of patterns involving simple geometric designs including patterns found
                in real life context
              </li>
              <li>Create and translate patterns using various representations, including shapes and numbers</li>
              <li>
                Determine pattern rules and use them to extend patterns, make and justify predictions, and identify
                missing elements in patterns
              </li>
              <li>Create and describe patterns to illustrate relationships among whole numbers up to 100</li>
            </ul>
          </TabsContent>

          <TabsContent value="variables" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Variables and Relationships</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify when symbols are being used as variables, and describe how they are being used</li>
              <li>Understand and represent equivalence for whole numbers up to 100, in various contexts</li>
              <li>
                Determine what needs to be added to or subtracted from addition and subtraction expressions to make them
                equivalent
              </li>
              <li>Represent algebraic expressions using variables and symbols</li>
              <li>Represent unknown quantities concretely, pictorially and numerically</li>
              <li>
                Simplify algebraic expression problems involving an unknown quantity in an addition and subtraction
                situation
              </li>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Creating and Extending Patterns
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Describe a given pattern</li>
                    <li>Identify whether given terms form a pattern or not</li>
                    <li>Make predictions as to what may come next in a given pattern</li>
                    <li>Create and extend simple patterns with 3-5 elements</li>
                    <li>
                      Create patterns resulting from repeating an operation or making a repeated change to an attribute
                    </li>
                    <li>
                      Copy and extend a repeating pattern (using manipulatives, diagrams, body movements/actions/sounds)
                    </li>
                    <li>
                      Translate simple repeating patterns (e.g., a repeating orientation pattern to a repeating sound
                      pattern)
                    </li>
                    <li>Copy and extend growing patterns</li>
                    <li>Recognize patterns as either repeating or growing</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Increasing and Decreasing Patterns
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Determine the rule used to extend a growing and a shrinking pattern</li>
                    <li>
                      Identify, describe, and create through investigation, growing and shrinking patterns (increasing
                      and decreasing) involving addition and subtraction
                    </li>
                    <li>Solve simple patterns involving increasing and decreasing patterns</li>
                    <li>Use pattern rules to extend patterns and to make predictions</li>
                    <li>Complete patterns where elements are missing</li>
                    <li>
                      Demonstrate the ability to obtain a rule for a number pattern by determining the relationship
                      between given numbers
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Variables and Symbols
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and interpret simple number sentences using words, diagrams and symbols</li>
                    <li>
                      Communicate and interpret simple additive and subtractive strategies using words, diagrams and
                      symbols
                    </li>
                    <li>Explain how the arrangement of numbers (commutative property) does not affect the sum/total</li>
                    <li>Recognize that the commutative property does not apply to subtraction</li>
                    <li>Represent algebraic expressions using variables and symbols</li>
                    <li>Represent unknown quantities concretely, pictorially and numerically</li>
                    <li>
                      Simplify algebraic expression problems involving an unknown quantity in an addition and
                      subtraction situation
                    </li>
                    <li>
                      Demonstrate an appreciation for the use of symbols as a substitute for real life objects when
                      counting and grouping items up to a hundred
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Understanding Equivalence
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Represent numbers up to 100 in a variety of ways</li>
                    <li>Apply the commutative property when adding numbers</li>
                    <li>Identify equivalent monetary values of coins and bills</li>
                    <li>Create equivalent sum of money using different coins</li>
                    <li>Generalize whole numbers can be decomposed and composed without changing its value</li>
                    <li>Demonstrate and explain what equality means using manipulatives and diagrams (0-100)</li>
                    <li>Record equalities and inequalities symbolically using the correct symbol</li>
                    <li>Solve for missing quantities to make the equation equivalent</li>
                    <li>Model equalities using a variety of concrete representation and record</li>
                    <li>Appreciate the need for equating an expression to values</li>
                    <li>Accept that an equation is a number sentence</li>
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
                  creation, extension activities, and work with variables and equations
                </li>
                <li>
                  <strong className="text-yellow-700">Conversations:</strong> Student explanations of pattern rules,
                  predictions, and reasoning about equivalence and variables
                </li>
                <li>
                  <strong className="text-yellow-700">Products:</strong> Student-created patterns, completed pattern
                  worksheets, and solutions to equivalence problems
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
                <h4 className="font-semibold mb-2 text-yellow-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for pattern recognition and extension</li>
                  <li>Rubrics for evaluating student-created patterns and explanations</li>
                  <li>Performance tasks involving identifying and extending patterns</li>
                  <li>Exit tickets to assess understanding of variables and equivalence</li>
                  <li>Pattern portfolios showcasing student work with patterns</li>
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
                  <AccordionTrigger>Creating and Extending Patterns</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Pattern Walks:</strong> Take students on a "pattern walk" around the school or classroom
                        to identify patterns in their environment.
                      </li>
                      <li>
                        <strong>Manipulative Patterns:</strong> Provide a variety of manipulatives (blocks, buttons,
                        beads) for students to create and extend patterns.
                      </li>
                      <li>
                        <strong>Movement Patterns:</strong> Engage students in creating and extending patterns using
                        body movements, sounds, or actions.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Increasing and Decreasing Patterns</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Visual Models:</strong> Use visual models like staircases or towers to represent
                        increasing and decreasing patterns.
                      </li>
                      <li>
                        <strong>Number Patterns:</strong> Explore number patterns on a hundreds chart, looking for
                        patterns when counting by different intervals.
                      </li>
                      <li>
                        <strong>Pattern Rule Discovery:</strong> Provide opportunities for students to discover pattern
                        rules through investigation and discussion.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Variables and Symbols</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concrete Representations:</strong> Use manipulatives to represent variables and unknown
                        quantities in equations.
                      </li>
                      <li>
                        <strong>Symbol Introduction:</strong> Gradually introduce symbols to represent unknown
                        quantities, starting with pictures or shapes before moving to letters.
                      </li>
                      <li>
                        <strong>Real-Life Connections:</strong> Connect variables to real-life situations where unknown
                        quantities need to be found.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Understanding Equivalence</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Balance Scale Activities:</strong> Use a balance scale to demonstrate equality and
                        equivalence in equations.
                      </li>
                      <li>
                        <strong>Number Decomposition:</strong> Explore different ways to decompose numbers to develop
                        understanding of equivalence.
                      </li>
                      <li>
                        <strong>Missing Number Problems:</strong> Provide problems with missing numbers to develop
                        understanding of equivalence and the meaning of the equal sign.
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
                <li>Pattern blocks and manipulatives</li>
                <li>Hundreds charts and number lines</li>
                <li>Balance scales for equivalence activities</li>
                <li>Pattern cards and task cards</li>
                <li>OECS Grade 2 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual pattern blocks and manipulatives</li>
                <li>Pattern journals for recording patterns and rules</li>
                <li>Visual aids for patterns and equivalence</li>
                <li>Number cards for creating patterns</li>
                <li>Personal hundreds charts</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Learning about patterns and relationships helps students to make their own predictions and determine
              missing values by applying an identified rule as well as help them form logical connections. Patterns are
              important as they provide students with the skills needed to better understand Mathematical concepts. It
              creates a clearer understanding of relationships and therefore helps improve students' reasoning skills.
              It forms the basis for the understanding of algebra and allows for quicker problem solving.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
