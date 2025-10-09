import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Zap, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ForcesInteractionsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <Zap className="mr-2 h-7 w-7 text-green-600" />
            Forces and Interactions
          </h1>
          <p className="text-gray-700">
            In Grade 3, students explore how balanced and unbalanced forces affect the motion of objects. They
            investigate magnetic and electrical interactions between objects, learn to predict patterns of motion, and
            design solutions to problems involving forces. Through hands-on investigations, students develop an
            understanding of the fundamental principles of forces and motion.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Forces and Interactions
        </h3>

        <Tabs defaultValue="forces">
          <TabsList className="grid w-full grid-cols-4 bg-green-100">
            <TabsTrigger value="forces" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Balanced & Unbalanced Forces
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Patterns of Motion
            </TabsTrigger>
            <TabsTrigger value="electric" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Electric & Magnetic Forces
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Design Solutions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forces" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Plan and conduct an investigation to provide evidence of the effects of
              balanced and unbalanced forces on the motion of an object
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Define force as a push or pull that can cause an object to move, stop, or change direction</li>
              <li>
                Identify balanced forces as equal forces acting in opposite directions, resulting in no change in motion
              </li>
              <li>Identify unbalanced forces as unequal forces that cause a change in motion</li>
              <li>Investigate how the strength and direction of forces affect the motion of objects</li>
              <li>Recognize gravity as a force that pulls objects toward Earth</li>
              <li>Conduct investigations to observe and measure the effects of balanced and unbalanced forces</li>
              <li>Collect and analyze data to provide evidence of the effects of forces on objects</li>
            </ul>
          </TabsContent>

          <TabsContent value="patterns" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Make observations and/or measurements of an object's motion to provide
              evidence that a pattern can be used to predict future motion
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe and describe patterns of motion (e.g., straight line, back and forth, circular, zigzag)</li>
              <li>Measure and record the position and motion of objects over time</li>
              <li>Identify and describe patterns in the motion of objects</li>
              <li>Use patterns of motion to make predictions about future positions</li>
              <li>Investigate how changing the force applied to an object affects its motion</li>
              <li>Collect and analyze data to identify patterns in motion</li>
              <li>Use evidence to explain how patterns can be used to predict future motion</li>
            </ul>
          </TabsContent>

          <TabsContent value="electric" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Ask questions to determine cause and effect relationships of electric or
              magnetic interactions between two objects not in contact with each other
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Recognize that objects can exert forces on each other even when not touching</li>
              <li>Investigate how magnets interact with other magnets and with magnetic materials</li>
              <li>
                Observe that magnets have two poles (north and south) and that like poles repel while unlike poles
                attract
              </li>
              <li>Explore how the strength of magnetic forces changes with distance</li>
              <li>Investigate static electricity and observe how charged objects interact</li>
              <li>Identify cause and effect relationships in electric and magnetic interactions</li>
              <li>Ask questions to determine factors that affect the strength of electric and magnetic forces</li>
            </ul>
          </TabsContent>

          <TabsContent value="design" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 4: Define a simple design problem that can be solved by applying scientific
              ideas about magnets
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify problems that could be solved using magnets</li>
              <li>Apply knowledge of magnetic properties to design solutions to problems</li>
              <li>Define criteria for successful solutions to problems involving magnets</li>
              <li>Design and build devices that use magnetic forces to solve a problem</li>
              <li>Test and evaluate designs based on defined criteria</li>
              <li>Refine designs based on test results</li>
              <li>Communicate design solutions and explain how they apply scientific ideas about magnets</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Forces and Motion
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Define force as a push or pull that can cause an object to move, stop, or change direction</li>
                    <li>Identify and describe different types of forces (e.g., gravity, friction, magnetic force)</li>
                    <li>Distinguish between balanced and unbalanced forces</li>
                    <li>Investigate how the strength and direction of forces affect the motion of objects</li>
                    <li>Observe and describe how friction affects the motion of objects</li>
                    <li>Recognize gravity as a force that pulls objects toward Earth</li>
                    <li>Conduct investigations to observe and measure the effects of balanced and unbalanced forces</li>
                    <li>Collect and analyze data to provide evidence of the effects of forces on objects</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Patterns of Motion
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Observe and describe different patterns of motion (e.g., straight line, back and forth, circular,
                      zigzag)
                    </li>
                    <li>Measure and record the position and motion of objects over time</li>
                    <li>Identify and describe patterns in the motion of objects</li>
                    <li>Use patterns of motion to make predictions about future positions</li>
                    <li>Investigate how changing the force applied to an object affects its motion</li>
                    <li>Collect and analyze data to identify patterns in motion</li>
                    <li>Use evidence to explain how patterns can be used to predict future motion</li>
                    <li>Design and conduct investigations to explore patterns of motion</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Magnetic and Electric Forces
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Recognize that objects can exert forces on each other even when not touching</li>
                    <li>Investigate how magnets interact with other magnets and with magnetic materials</li>
                    <li>Identify materials that are attracted to magnets and those that are not</li>
                    <li>
                      Observe that magnets have two poles (north and south) and that like poles repel while unlike poles
                      attract
                    </li>
                    <li>Explore how the strength of magnetic forces changes with distance</li>
                    <li>Investigate static electricity and observe how charged objects interact</li>
                    <li>Identify cause and effect relationships in electric and magnetic interactions</li>
                    <li>Ask questions to determine factors that affect the strength of electric and magnetic forces</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Engineering Design with Magnets
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify problems that could be solved using magnets</li>
                    <li>Apply knowledge of magnetic properties to design solutions to problems</li>
                    <li>Define criteria for successful solutions to problems involving magnets</li>
                    <li>Design and build devices that use magnetic forces to solve a problem</li>
                    <li>Test and evaluate designs based on defined criteria</li>
                    <li>Refine designs based on test results</li>
                    <li>Communicate design solutions and explain how they apply scientific ideas about magnets</li>
                    <li>Identify real-world applications of magnets and magnetic forces</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-green-700">Observations:</strong> Teacher observations during investigations,
                  experiments, and design activities
                </li>
                <li>
                  <strong className="text-green-700">Conversations:</strong> Student explanations of force and motion
                  concepts, predictions, and design solutions
                </li>
                <li>
                  <strong className="text-green-700">Products:</strong> Student work samples, including investigation
                  reports, data records, diagrams, and design solutions
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                <h4 className="font-semibold mb-2 text-green-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for investigation and design skills</li>
                  <li>Rubrics for evaluating student investigations and design solutions</li>
                  <li>Performance tasks involving forces, motion, and magnetic interactions</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Science journals for recording observations, data, and reflections</li>
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
                  <AccordionTrigger>Forces and Motion Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Hands-on Investigations:</strong> Provide opportunities for students to explore balanced
                        and unbalanced forces through hands-on activities, such as pushing and pulling objects,
                        tug-of-war games, and observing objects in motion.
                      </li>
                      <li>
                        <strong>Force Stations:</strong> Set up stations where students can explore different types of
                        forces (e.g., gravity, friction, magnetic force) and their effects on objects.
                      </li>
                      <li>
                        <strong>Visual Demonstrations:</strong> Use demonstrations and visual aids to help students
                        understand the concepts of balanced and unbalanced forces.
                      </li>
                      <li>
                        <strong>Real-World Connections:</strong> Connect force and motion concepts to real-world
                        examples and experiences, such as playground activities, sports, and transportation.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Patterns of Motion Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Motion Tracking:</strong> Have students track and record the motion of objects using
                        tools such as timers, measuring tapes, and grid paper.
                      </li>
                      <li>
                        <strong>Pattern Recognition Activities:</strong> Engage students in activities that help them
                        identify and describe patterns in motion, such as pendulums, rolling objects, and bouncing
                        balls.
                      </li>
                      <li>
                        <strong>Prediction Challenges:</strong> Challenge students to make predictions about the future
                        motion of objects based on observed patterns.
                      </li>
                      <li>
                        <strong>Data Collection and Analysis:</strong> Guide students in collecting and analyzing data
                        about object motion, using tables, graphs, and other visual representations.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Magnetic and Electric Forces Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Magnet Exploration:</strong> Provide a variety of magnets and materials for students to
                        explore magnetic interactions, including attraction, repulsion, and the effects of distance.
                      </li>
                      <li>
                        <strong>Static Electricity Investigations:</strong> Engage students in activities that
                        demonstrate static electricity, such as rubbing balloons on hair or clothing and observing the
                        effects.
                      </li>
                      <li>
                        <strong>Cause and Effect Analysis:</strong> Guide students in identifying cause and effect
                        relationships in magnetic and electric interactions.
                      </li>
                      <li>
                        <strong>Question Generation:</strong> Encourage students to generate their own questions about
                        magnetic and electric forces and design investigations to answer them.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Engineering Design Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Problem-Based Learning:</strong> Present students with real-world problems that can be
                        solved using magnets, such as designing a door latch or a method to separate materials.
                      </li>
                      <li>
                        <strong>Design Challenges:</strong> Engage students in design challenges that require them to
                        apply their knowledge of magnetic forces to create solutions.
                      </li>
                      <li>
                        <strong>Iterative Design Process:</strong> Guide students through the engineering design
                        process, including defining problems, designing solutions, testing, and refining designs.
                      </li>
                      <li>
                        <strong>Collaborative Problem Solving:</strong> Encourage students to work collaboratively to
                        design, test, and improve solutions to problems involving magnets.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-5">
                  <AccordionTrigger>Differentiation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Visual Supports:</strong> Use visual aids, anchor charts, and graphic organizers to
                        support students' understanding of force and motion concepts.
                      </li>
                      <li>
                        <strong>Tiered Activities:</strong> Adjust the complexity of investigations and design
                        challenges based on students' readiness levels.
                      </li>
                      <li>
                        <strong>Multiple Representations:</strong> Provide opportunities for students to demonstrate
                        their understanding through various means (drawing, building, explaining, writing).
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Incorporate partner and small group activities to
                        support peer learning and discussion of force and motion concepts.
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
                <li>Variety of magnets (bar, horseshoe, ring, disc)</li>
                <li>Materials for testing magnetic properties</li>
                <li>Ramps, balls, and other objects for motion investigations</li>
                <li>Materials for static electricity demonstrations</li>
                <li>Measurement tools (rulers, timers, spring scales)</li>
                <li>OECS Grade 3 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Science journals for recording observations and data</li>
                <li>Materials for building and testing designs</li>
                <li>Data collection sheets and investigation guides</li>
                <li>Force and motion vocabulary cards</li>
                <li>Visual aids and reference materials</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Forces and Interactions in Grade 3 builds upon students' earlier experiences with pushing, pulling, and
              the motion of objects. Students develop a deeper understanding of forces as pushes or pulls that can cause
              objects to move, stop, or change direction. They learn to distinguish between balanced forces (which
              result in no change in motion) and unbalanced forces (which cause a change in motion). Students also
              explore magnetic and electric forces, recognizing that these forces can act at a distance without objects
              touching. Through hands-on investigations and design challenges, students develop an understanding of the
              fundamental principles of forces and motion and how these principles can be applied to solve problems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
