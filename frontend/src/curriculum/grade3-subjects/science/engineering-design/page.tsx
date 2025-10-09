import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Waves, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EngineeringDesignPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-indigo-700 flex items-center">
            <Waves className="mr-2 h-7 w-7 text-indigo-600" />
            Engineering Design
          </h1>
          <p className="text-gray-700">
            In Grade 3, students learn to define simple design problems, develop possible solutions, and evaluate their
            effectiveness. They apply scientific ideas to design, test, and refine devices that solve specific problems,
            developing skills in planning, testing, and improving their designs. Through these activities, students
            build an understanding of the engineering design process and how it can be used to solve real-world
            problems.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Engineering Design
        </h3>

        <Tabs defaultValue="define">
          <TabsList className="grid w-full grid-cols-3 bg-indigo-100">
            <TabsTrigger value="define" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Define Problems
            </TabsTrigger>
            <TabsTrigger value="develop" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Develop Solutions
            </TabsTrigger>
            <TabsTrigger value="optimize" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Optimize Solutions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="define" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Define a simple design problem reflecting a need or a want that includes
              specified criteria for success and constraints on materials, time, or cost
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify problems that can be solved through the design process</li>
              <li>Distinguish between needs and wants in the context of design problems</li>
              <li>Define criteria for successful solutions</li>
              <li>Identify constraints on materials, time, or cost</li>
              <li>Formulate clear problem statements</li>
              <li>Research and gather information about the design problem</li>
              <li>Communicate design problems effectively</li>
            </ul>
          </TabsContent>

          <TabsContent value="develop" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Generate and compare multiple possible solutions to a problem based on how
              well each is likely to meet the criteria and constraints of the problem
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Brainstorm multiple solutions to design problems</li>
              <li>Create sketches, drawings, or physical models of possible solutions</li>
              <li>Apply scientific ideas and principles to design solutions</li>
              <li>Compare different solutions based on criteria and constraints</li>
              <li>Evaluate the strengths and weaknesses of different solutions</li>
              <li>Select the most promising solution for testing</li>
              <li>Communicate design ideas effectively</li>
            </ul>
          </TabsContent>

          <TabsContent value="optimize" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Plan and carry out fair tests in which variables are controlled and failure
              points are considered to identify aspects of a model or prototype that can be improved
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Plan and conduct fair tests of design solutions</li>
              <li>Identify and control variables in tests</li>
              <li>Collect and record data during testing</li>
              <li>Analyze test results to identify failure points</li>
              <li>Use test results to improve designs</li>
              <li>Iterate through the design process to refine solutions</li>
              <li>Communicate the results of testing and improvements</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-indigo-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Defining Engineering Problems
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify problems in everyday life that can be solved through the design process</li>
                    <li>Distinguish between needs and wants in the context of design problems</li>
                    <li>Define criteria for successful solutions (what the design must accomplish)</li>
                    <li>Identify constraints on materials, time, or cost</li>
                    <li>Formulate clear problem statements that describe what needs to be solved</li>
                    <li>Research and gather information about the design problem</li>
                    <li>Communicate design problems effectively using words, drawings, or models</li>
                    <li>
                      Recognize that defining a problem clearly is the first step in the engineering design process
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Developing Possible Solutions
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Brainstorm multiple solutions to design problems</li>
                    <li>Create sketches, drawings, or physical models of possible solutions</li>
                    <li>Apply scientific ideas and principles to design solutions</li>
                    <li>Compare different solutions based on criteria and constraints</li>
                    <li>Evaluate the strengths and weaknesses of different solutions</li>
                    <li>Select the most promising solution for testing</li>
                    <li>Communicate design ideas effectively using words, drawings, or models</li>
                    <li>Recognize that generating multiple solutions leads to better designs</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Testing and Optimizing Solutions
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Plan and conduct fair tests of design solutions</li>
                    <li>Identify and control variables in tests</li>
                    <li>Collect and record data during testing</li>
                    <li>Analyze test results to identify failure points</li>
                    <li>Use test results to improve designs</li>
                    <li>Iterate through the design process to refine solutions</li>
                    <li>Communicate the results of testing and improvements</li>
                    <li>
                      Recognize that failure is a natural part of the design process and leads to better solutions
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Engineering Design Process
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Understand the steps of the engineering design process</li>
                    <li>Apply the engineering design process to solve problems</li>
                    <li>Recognize that the design process is iterative and involves multiple cycles of improvement</li>
                    <li>
                      Document the design process, including problem definition, solution development, testing, and
                      improvements
                    </li>
                    <li>Reflect on the design process and identify lessons learned</li>
                    <li>Communicate about the design process and solutions</li>
                    <li>Collaborate with others during the design process</li>
                    <li>Recognize the value of the engineering design process for solving real-world problems</li>
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
                  <strong className="text-indigo-700">Observations:</strong> Teacher observations during problem
                  definition, solution development, and testing activities
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Student explanations of design problems,
                  solutions, and test results
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Student work samples, including problem
                  statements, design sketches, prototypes, and test results
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for engineering design process skills</li>
                  <li>Rubrics for evaluating design solutions and prototypes</li>
                  <li>Performance tasks involving engineering design challenges</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Engineering design journals for documenting the design process</li>
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
                  <AccordionTrigger>Problem Definition Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Problem Identification Activities:</strong> Engage students in identifying problems in
                        their school, home, or community that could be solved through engineering design.
                      </li>
                      <li>
                        <strong>Criteria and Constraints Exploration:</strong> Guide students in defining clear criteria
                        for successful solutions and identifying relevant constraints.
                      </li>
                      <li>
                        <strong>Problem Statement Templates:</strong> Provide templates or sentence frames to help
                        students formulate clear problem statements.
                      </li>
                      <li>
                        <strong>Research Strategies:</strong> Teach students how to gather information about design
                        problems through observation, interviews, or other research methods.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Solution Development Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Brainstorming Techniques:</strong> Teach students various brainstorming techniques to
                        generate multiple solution ideas.
                      </li>
                      <li>
                        <strong>Sketching and Modeling Activities:</strong> Provide opportunities for students to create
                        sketches, drawings, or physical models of their design ideas.
                      </li>
                      <li>
                        <strong>Solution Comparison Tools:</strong> Use graphic organizers or decision matrices to help
                        students compare different solutions based on criteria and constraints.
                      </li>
                      <li>
                        <strong>Science Connection Activities:</strong> Guide students in applying scientific ideas and
                        principles to their design solutions.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Testing and Optimization Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Fair Test Planning:</strong> Guide students in planning fair tests of their design
                        solutions, including identifying variables to control.
                      </li>
                      <li>
                        <strong>Data Collection Tools:</strong> Provide templates or tools for students to collect and
                        record data during testing.
                      </li>
                      <li>
                        <strong>Failure Analysis Activities:</strong> Engage students in analyzing test results to
                        identify failure points and areas for improvement.
                      </li>
                      <li>
                        <strong>Iterative Design Opportunities:</strong> Provide time and materials for students to
                        improve their designs based on test results.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Design Process Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Process Visualization:</strong> Use visual aids or graphic organizers to help students
                        understand and follow the steps of the engineering design process.
                      </li>
                      <li>
                        <strong>Design Journals:</strong> Have students maintain engineering design journals to document
                        their progress through the design process.
                      </li>
                      <li>
                        <strong>Reflection Activities:</strong> Engage students in reflecting on their design process,
                        including challenges faced and lessons learned.
                      </li>
                      <li>
                        <strong>Collaborative Design Projects:</strong> Provide opportunities for students to work
                        collaboratively on design challenges, sharing ideas and feedback.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-5">
                  <AccordionTrigger>Differentiation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Visual Supports:</strong> Use visual aids, diagrams, and graphic organizers to support
                        students' understanding of the engineering design process.
                      </li>
                      <li>
                        <strong>Tiered Design Challenges:</strong> Adjust the complexity of design challenges based on
                        students' readiness levels.
                      </li>
                      <li>
                        <strong>Multiple Representations:</strong> Provide opportunities for students to demonstrate
                        their understanding through various means (drawing, building, explaining, writing).
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Incorporate partner and small group activities to
                        support peer learning and discussion during the design process.
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
                <li>Materials for building and testing prototypes</li>
                <li>Engineering design process posters and visual aids</li>
                <li>Sample design challenges and problem scenarios</li>
                <li>Books and articles about engineering and design for children</li>
                <li>Videos and images of engineering design in action</li>
                <li>OECS Grade 3 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Engineering design journals for documenting the design process</li>
                <li>Materials for creating sketches and models</li>
                <li>Testing materials and tools</li>
                <li>Engineering and design vocabulary cards</li>
                <li>Visual aids and reference materials</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Engineering Design in Grade 3 builds upon students' earlier experiences with solving problems and creating
              solutions. Students develop a deeper understanding of the engineering design process, including defining
              problems, developing solutions, and optimizing designs through testing and improvement. They learn to
              define problems in terms of criteria (what the design must accomplish) and constraints (limitations on
              materials, time, or cost). Students practice generating multiple solutions, comparing them based on how
              well they meet the criteria and constraints, and selecting the most promising solutions for testing. They
              also learn to plan and conduct fair tests, analyze results, and use the information to improve their
              designs. Through these activities, students develop important skills in critical thinking,
              problem-solving, and communication, while also learning to apply scientific knowledge to real-world
              problems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
