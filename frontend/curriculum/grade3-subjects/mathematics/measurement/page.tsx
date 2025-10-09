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
      
      <Link href="/curriculum/grade3-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-pink-700 flex items-center">
            <Ruler className="mr-2 h-7 w-7 text-pink-600" />
            Measurement
          </h1>
          <p className="text-gray-700">
            In Grade 3, students develop their understanding of standard units and processes for measuring various
            attributes such as length, mass, capacity, area, perimeter, and time. They learn to select appropriate
            tools, estimate measurements, and solve problems involving measurement.
          </p>
        </div>
      </div>

      <div className="bg-pink-50 p-6 rounded-lg border border-pink-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-pink-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Measurement
        </h3>

        <Tabs defaultValue="length">
          <TabsList className="grid w-full grid-cols-4 bg-pink-100">
            <TabsTrigger value="length" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Length & Area
            </TabsTrigger>
            <TabsTrigger value="mass" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Mass & Capacity
            </TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Time
            </TabsTrigger>
            <TabsTrigger value="temperature" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Temperature
            </TabsTrigger>
          </TabsList>

          <TabsContent value="length" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Understanding Length, Perimeter, and Area
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Estimate, measure, and record length, height, and distance using standard units (cm, m, km)</li>
              <li>Compare and order objects by length, height, or distance</li>
              <li>Estimate, measure, and record the perimeter of regular and irregular shapes</li>
              <li>Estimate, measure, and record area using non-standard and standard square units</li>
              <li>Understand the relationship between perimeter and area</li>
              <li>Select and use appropriate tools for measuring length, perimeter, and area</li>
            </ul>
          </TabsContent>

          <TabsContent value="mass" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Understanding Mass and Capacity</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Estimate, measure, and record mass using standard units (g, kg)</li>
              <li>Compare and order objects by mass</li>
              <li>Estimate, measure, and record capacity using standard units (mL, L)</li>
              <li>Compare and order containers by capacity</li>
              <li>Understand the relationship between mass and capacity for water (1 L = 1 kg)</li>
              <li>Select and use appropriate tools for measuring mass and capacity</li>
            </ul>
          </TabsContent>

          <TabsContent value="time" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 3: Understanding Time</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Tell and write time to the nearest minute using analog and digital clocks</li>
              <li>Solve problems involving elapsed time</li>
              <li>Understand the relationship between hours, minutes, and seconds</li>
              <li>Read and interpret calendars</li>
              <li>Understand the concept of a.m. and p.m.</li>
              <li>Estimate and measure time intervals</li>
            </ul>
          </TabsContent>

          <TabsContent value="temperature" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 4: Understanding Temperature</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Read temperature using Celsius and Fahrenheit scales</li>
              <li>Understand the concept of freezing and boiling points</li>
              <li>Relate temperature to everyday experiences (weather, cooking, body temperature)</li>
              <li>Compare temperatures in different contexts</li>
              <li>Record and track temperature changes over time</li>
              <li>Select and use appropriate tools for measuring temperature</li>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Length, Perimeter, and Area
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Estimate, measure, and compare lengths using centimeters and meters</li>
                    <li>Select appropriate units and tools to measure length (mm, cm, m, km)</li>
                    <li>Calculate the perimeter of regular and irregular shapes</li>
                    <li>Understand that perimeter is the distance around a shape</li>
                    <li>Estimate and measure area using square units (square cm, square m)</li>
                    <li>Understand that area is the amount of surface a shape covers</li>
                    <li>Solve problems involving length, perimeter, and area</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">Mass and Capacity</AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Estimate, measure, and compare masses using grams and kilograms</li>
                    <li>Select appropriate units and tools to measure mass (g, kg)</li>
                    <li>Estimate, measure, and compare capacities using milliliters and liters</li>
                    <li>Select appropriate units and tools to measure capacity (mL, L)</li>
                    <li>Understand the relationship between mass and capacity for water</li>
                    <li>Solve problems involving mass and capacity</li>
                    <li>Convert between related units of mass and capacity</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Time and Temperature
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Tell and write time to the nearest minute on analog and digital clocks</li>
                    <li>Understand the relationship between hours, minutes, and seconds</li>
                    <li>Calculate elapsed time in minutes and hours</li>
                    <li>Use a.m. and p.m. notation correctly</li>
                    <li>Read and interpret calendars</li>
                    <li>Read temperatures on Celsius and Fahrenheit thermometers</li>
                    <li>Understand key temperature benchmarks (freezing, boiling, room temperature)</li>
                    <li>Solve problems involving time and temperature</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-pink-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-pink-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-pink-700">Observations:</strong> Teacher observations during measurement
                  activities, noting students' technique, accuracy, and understanding of measurement concepts
                </li>
                <li>
                  <strong className="text-pink-700">Conversations:</strong> Student explanations of their measurement
                  strategies, estimations, and reasoning
                </li>
                <li>
                  <strong className="text-pink-700">Products:</strong> Student work samples, including recorded
                  measurements, calculations, and problem-solving involving measurement
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-100">
                <h4 className="font-semibold mb-2 text-pink-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for measurement techniques and tool use</li>
                  <li>Rubrics for evaluating student understanding of measurement concepts</li>
                  <li>Performance tasks involving real-world measurement problems</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Measurement journals for recording estimates, measurements, and reflections</li>
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
                  <AccordionTrigger>Length, Perimeter, and Area Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Hands-On Measuring:</strong> Provide numerous opportunities for students to measure
                        objects using a variety of tools (rulers, tape measures, meter sticks).
                      </li>
                      <li>
                        <strong>Estimation Activities:</strong> Have students estimate lengths before measuring to
                        develop their measurement sense.
                      </li>
                      <li>
                        <strong>Perimeter Explorations:</strong> Use geoboards, grid paper, and string to explore the
                        perimeter of various shapes.
                      </li>
                      <li>
                        <strong>Area Investigations:</strong> Use square tiles, grid paper, and other manipulatives to
                        explore area concepts.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Mass and Capacity Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Comparison Activities:</strong> Have students compare and order objects by mass and
                        containers by capacity.
                      </li>
                      <li>
                        <strong>Estimation Challenges:</strong> Engage students in estimating the mass of objects or the
                        capacity of containers before measuring.
                      </li>
                      <li>
                        <strong>Cooking Activities:</strong> Incorporate cooking or science experiments that involve
                        measuring mass and capacity.
                      </li>
                      <li>
                        <strong>Measurement Stations:</strong> Set up stations with different measurement tasks for
                        students to rotate through and practice various skills.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Time and Temperature Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Clock Reading Practice:</strong> Provide regular practice with both analog and digital
                        clocks, focusing on telling time to the nearest minute.
                      </li>
                      <li>
                        <strong>Elapsed Time Activities:</strong> Use timelines, number lines, and clock models to help
                        students understand and calculate elapsed time.
                      </li>
                      <li>
                        <strong>Calendar Activities:</strong> Incorporate daily calendar routines that involve reading
                        and interpreting calendars.
                      </li>
                      <li>
                        <strong>Temperature Tracking:</strong> Have students record and track temperatures over time,
                        such as daily weather temperatures or temperatures during a science experiment.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Differentiation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Visual Supports:</strong> Use visual aids, anchor charts, and reference tools to support
                        students' understanding of measurement concepts and units.
                      </li>
                      <li>
                        <strong>Scaffolded Practice:</strong> Provide scaffolded practice opportunities, gradually
                        increasing the complexity of measurement tasks.
                      </li>
                      <li>
                        <strong>Real-World Connections:</strong> Connect measurement to everyday situations such as
                        cooking, construction, sports, and shopping.
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Incorporate partner and small group activities to
                        support peer learning and discussion of measurement concepts.
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
                <li>Rulers, tape measures, meter sticks, and trundle wheels</li>
                <li>Scales, balances, and weights</li>
                <li>Measuring cups, beakers, and graduated cylinders</li>
                <li>Demonstration clocks and thermometers</li>
                <li>OECS Grade 3 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual rulers and measuring tapes</li>
                <li>Grid paper and square tiles for area activities</li>
                <li>Individual clocks for time practice</li>
                <li>Measurement conversion charts and reference tools</li>
                <li>Measurement journals for recording estimates and measurements</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Measurement in Grade 3 builds upon students' earlier experiences with non-standard units and introduces
              more formal work with standard units. Students develop a deeper understanding of the attributes being
              measured (length, area, mass, capacity, time, temperature) and the units and tools used to measure them.
              They learn to select appropriate units and tools, estimate measurements, and solve problems involving
              measurement. Through hands-on experiences and real-world applications, students develop measurement sense
              and an understanding of the importance of measurement in everyday life.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
