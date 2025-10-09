import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Ruler, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function MeasurementPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-pink-700 flex items-center">
            <Ruler className="mr-2 h-7 w-7 text-pink-600" />
            Measurement
          </h1>
          <p className="text-gray-700">
            In Grade 2, students develop their understanding of measurement concepts and skills. They learn to measure
            length, time, and money using appropriate tools and units, and begin to understand the relationship between
            different units of measurement.
          </p>
        </div>
      </div>

      <div className="bg-pink-50 p-6 rounded-lg border border-pink-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-pink-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Measurement
        </h3>

        <Tabs defaultValue="understanding">
          <TabsList className="grid w-full grid-cols-2 bg-pink-100">
            <TabsTrigger
              value="understanding"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
            >
              Understanding Measurement
            </TabsTrigger>
            <TabsTrigger value="applying" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Applying Measurement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="understanding" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Understanding What and How We Measure</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Choose and use non-standard units appropriately to measure lengths</li>
              <li>Describe the inverse relationship between the size of a unit and the number of units needed</li>
              <li>Explain the relationship between centimeters and meters as units of length</li>
              <li>Use benchmarks for these units to estimate lengths</li>
              <li>Measure and draw lengths in centimetres and metres, using a measuring tool</li>
              <li>Recognize the impact of starting at points other than zero</li>
              <li>
                Use units of time, including seconds, minutes, hours, and non-standard units, to describe the duration
                of various events
              </li>
              <li>
                Tell and write time from analog and digital clocks to the nearest five minutes, using a.m. and p.m.
              </li>
              <li>Count a mixed collection of coins whose sum is less than or equal to one dollar</li>
            </ul>
          </TabsContent>

          <TabsContent value="applying" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Applying Techniques, Tools and Formulae for Measuring
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Measure to determine how much longer one object is than another</li>
              <li>Express the length difference in terms of a standard length unit</li>
              <li>
                Use addition and subtraction within 100 to solve word problems involving lengths that are given in the
                same units
              </li>
              <li>Estimate lengths using units of centimeters, and meters</li>
              <li>
                Explore and estimate liquid volumes and masses of objects using standard units of grams (g) and
                milliliters (mL)
              </li>
              <li>Develop personal referents for measuring attributes</li>
              <li>Use tools to measure attributes</li>
              <li>Develop and apply formulae for measuring</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-pink-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Linear Measurement
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Explain in your own words the concept of linear measurement</li>
                    <li>
                      Differentiate among measurable attributes related to linear measurements (length, width, height,
                      depth and distance)
                    </li>
                    <li>
                      Use vocabulary relating to each attribute (long, short, wide, narrow, deep, shallow, far, tall,
                      near)
                    </li>
                    <li>Describe the term of non-standard units</li>
                    <li>
                      Use non-standard units (units must be the same size and must be joined from end to end - no gaps)
                    </li>
                    <li>Compare and order measurements using non-standard units of measurement</li>
                    <li>
                      Choose to use standard and non-standard units for the measurement of linear measurement where
                      appropriate
                    </li>
                    <li>
                      Estimate and measure length, height, and distance, using standard units (i.e. centimetre, metre)
                    </li>
                    <li>
                      Record and represent measurements of height, and distance length using a variety of ways (e.g.
                      concretely, pictorial, written)
                    </li>
                    <li>
                      Use a measuring tool such as a ruler or a tape measure, in both centimetres and metres to measure
                      length, height and distances
                    </li>
                    <li>Identify the starting point of a measuring tool</li>
                    <li>Recognize and use the abbreviations "cm" and "m" when measuring and recording lengths</li>
                    <li>Create real life scenarios that involve measuring lengths, height and distances</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">Time</AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Use units of time, including seconds, minutes, hours, and non-standard units, to describe the
                      duration of various events
                    </li>
                    <li>Represent and read time on the hour, half past the hour and quarter past the hour</li>
                    <li>Tell time from analog and digital clocks to the nearest five minutes, using a.m. and p.m.</li>
                    <li>
                      Use the common terms in time, such as, but not limited to, quarter past, half past appropriately
                    </li>
                    <li>Compare the time taken to complete two or more given activities using non-standard units</li>
                    <li>
                      Compare and order the durations of different events using terms such as shorter, longer, and equal
                    </li>
                    <li>Solve simple addition and subtraction problems involving duration of time</li>
                    <li>
                      Use appropriate vocabulary to describe time such as "seconds," "minutes," "hours," "shorter,"
                      "longer," "earlier," and "later," among others
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">Money</AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Add a mixed collection of coins whose sum is less than or equal to one dollar. e.g. 25c, 10c and
                      5c pieces
                    </li>
                    <li>
                      Solve real world and mathematical problems within one dollar involving 25c, 10c, 5c, and pennies,
                      using the ¢ (cent) symbol appropriately
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">Volume and Mass</AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Compare Measurement of lengths using a standard unit</li>
                    <li>
                      Solve addition and subtraction problems involving lengths up to 100 that are given in the same
                      units
                    </li>
                    <li>Estimate lengths using centimeters and Meters</li>
                    <li>
                      Explore and estimate liquid volumes and masses of objects using standard units of grams (g) and
                      milliliters (ml)
                    </li>
                    <li>
                      Measure attributes like length, weight, and time accurately by using units such as inches,
                      centimeters, pounds, kilograms, and minutes
                    </li>
                    <li>
                      Estimate measurements and make comparisons between different objects or quantities based on their
                      attributes such as longer/shorter, heavier/lighter, and faster/slower
                    </li>
                    <li>Use measurement tools such as rulers, scales, and timers to measure and compare attributes</li>
                    <li>
                      Use simple formulas related to measurement to calculate the perimeter of basic shapes or find the
                      average length of objects
                    </li>
                    <li>Identify the standard units of grams (g) for mass and milliliters (mL) for volume</li>
                    <li>
                      Estimate the volume of liquid in containers using milliliters (mL) as the unit of measurement
                    </li>
                    <li>Estimate the mass of objects using grams (g) as the unit of measurement</li>
                    <li>
                      Compare and order different volumes of liquids and masses of objects using concepts such as more
                      than, less than, and equal to when comparing volumes and masses
                    </li>
                    <li>
                      Use measuring tools, such as graduated cylinders or measuring cups, to measure the volume of
                      liquids accurately in milliliters (mL)
                    </li>
                    <li>Use a balance or scale to measure the mass of objects accurately in grams (g)</li>
                    <li>
                      Record measurements of volumes and masses in appropriate units (grams or milliliters) and write
                      them in numerical form
                    </li>
                    <li>
                      Solve problems involving estimating and measuring volumes and masses using grams and milliliters
                    </li>
                    <li>
                      Create real-life situations, such as measuring ingredients for a recipe or estimating the amount
                      of liquid in a container
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-rose-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-rose-50">
              <CardTitle className="text-rose-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-rose-700">Observations:</strong> Teacher observations during measurement
                  activities, use of measuring tools, and problem-solving tasks
                </li>
                <li>
                  <strong className="text-rose-700">Conversations:</strong> Student explanations of measurement
                  strategies, estimations, and reasoning about measurement relationships
                </li>
                <li>
                  <strong className="text-rose-700">Products:</strong> Student work samples, including measurements,
                  drawings, and solutions to measurement problems
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                <h4 className="font-semibold mb-2 text-rose-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for measuring skills and tool use</li>
                  <li>Rubrics for evaluating student understanding of measurement concepts</li>
                  <li>Performance tasks involving measuring and comparing objects</li>
                  <li>Exit tickets to assess understanding of time, money, or linear measurement</li>
                  <li>Measurement journals for recording observations and strategies</li>
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
                  <AccordionTrigger>Linear Measurement</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Non-Standard Units:</strong> Begin with non-standard units (paperclips, cubes, hand
                        spans) to develop the concept of measurement before introducing standard units.
                      </li>
                      <li>
                        <strong>Measurement Stations:</strong> Set up measurement stations around the classroom where
                        students can practice measuring different objects using various tools.
                      </li>
                      <li>
                        <strong>Estimation Activities:</strong> Engage students in estimation activities before
                        measuring, helping them develop benchmarks for different units.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Time</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Clock Manipulatives:</strong> Use manipulative clocks for students to practice setting
                        and reading times.
                      </li>
                      <li>
                        <strong>Daily Routines:</strong> Incorporate time concepts into daily classroom routines,
                        discussing the time at different points of the day.
                      </li>
                      <li>
                        <strong>Time Games:</strong> Play games that involve reading time, ordering times, or matching
                        digital and analog times.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Money</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Coin Recognition:</strong> Begin with coin recognition activities, helping students
                        identify different coins and their values.
                      </li>
                      <li>
                        <strong>Counting Collections:</strong> Provide opportunities for students to count collections
                        of coins, starting with same-value coins before moving to mixed collections.
                      </li>
                      <li>
                        <strong>Store Simulations:</strong> Set up a classroom store where students can practice using
                        money in a realistic context.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Volume and Mass</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Hands-on Exploration:</strong> Provide opportunities for students to explore volume and
                        mass through hands-on activities with containers, liquids, and objects.
                      </li>
                      <li>
                        <strong>Comparison Activities:</strong> Engage students in comparing volumes and masses of
                        different objects, using appropriate vocabulary.
                      </li>
                      <li>
                        <strong>Real-Life Applications:</strong> Connect volume and mass concepts to real-life
                        situations, such as cooking, science experiments, or shopping.
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
                <li>Rulers, measuring tapes, and meter sticks</li>
                <li>Manipulative clocks and time cards</li>
                <li>Play money and coin sets</li>
                <li>Scales, balances, and graduated cylinders</li>
                <li>OECS Grade 2 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual rulers and measuring tools</li>
                <li>Personal clocks for practice</li>
                <li>Coin sorting mats and money worksheets</li>
                <li>Measurement journals for recording observations</li>
                <li>Visual aids for measurement concepts</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              The measurement strand is mathematically powerful, and it enables the identification and quantification of
              attributes of objects so that they can be compared and ordered. It plays a crucial role in everyday life
              and it provides a link among the different strands of mathematics. It is important for students to
              understand linear measurements and their attributes, how to measure them accurately and use the
              appropriate units and tools of measurement. They will develop the skill to measure objects using units.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
