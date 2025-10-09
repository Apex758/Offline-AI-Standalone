"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Wrench, ClipboardCheck } from "lucide-react"

export default function EngineeringDesignPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade2-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Wrench className="mr-2 h-7 w-7 text-purple-600" />
            Engineering Design
          </h1>
          <p className="text-gray-700">
            The study of engineering design encompasses knowledge about how to solve problems through the development of
            new or improved objects or tools. Students will investigate the engineering design process, from defining
            problems to testing solutions. Through hands-on activities and collaboration, students will develop skills
            in creative problem-solving and critical thinking.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Engineering Design
        </h3>

        <Tabs defaultValue="elo1">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="elo1" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              ELO-1: Defining Problems
            </TabsTrigger>
            <TabsTrigger value="elo2" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              ELO-2: Shape and Function
            </TabsTrigger>
            <TabsTrigger value="elo3" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              ELO-3: Testing Designs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="elo1" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Ask questions, make observations, and gather information about a situation
              people want to change to define a simple problem that can be solved through the development of a new or
              improved object or tool.
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify problems in everyday situations that could be solved through engineering</li>
              <li>Ask questions to clarify problems and gather information</li>
              <li>Make observations to better understand problems</li>
              <li>Define problems in a way that can be addressed through engineering</li>
              <li>Communicate problem definitions clearly</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo2" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Develop a simple sketch, drawing, or physical model to illustrate how the
              shape of an object helps it function as needed to solve a given problem.
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe how the shape of objects relates to their function</li>
              <li>Create sketches, drawings, or physical models of objects</li>
              <li>Explain how specific shapes help objects function effectively</li>
              <li>Revise designs based on feedback and testing</li>
              <li>Communicate design ideas clearly through various media</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo3" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Analyze data from tests of at least two objects designed to solve the same
              problem to compare the strengths and weaknesses of how each performs.
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Test objects designed to solve the same problem</li>
              <li>Collect and record data from tests</li>
              <li>Analyze data to identify strengths and weaknesses of designs</li>
              <li>Compare the performance of different designs</li>
              <li>Draw conclusions based on evidence from tests</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Knowledge Outcomes
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Define key terms related to engineering and design</li>
                    <li>
                      Distinguish technology as a problem-solving human adaptation and engineering as the tangible
                      products (solutions) to that process
                    </li>
                    <li>
                      Demonstrate an understanding that engineers plan and design objects and tools that are designed to
                      solve problems faced by people
                    </li>
                    <li>
                      Show how people are affected by natural and human-made problems or situations which they want to
                      be changed or solved
                    </li>
                    <li>
                      Identify natural or human-made problems or situations to be changed or solved, in the home, school
                      and community
                    </li>
                    <li>
                      Identify possible solutions to the problems based on observation and research (what others have
                      done to solve similar problems)
                    </li>
                    <li>
                      Describe the features of the tool or object that would solve a problem based on scientific
                      information, materials used, and how it would be of benefit to people and the environment
                    </li>
                    <li>Explain in their own words, the interrelationship between Science and Technology</li>
                    <li>Realise that some things are natural and some are human-made</li>
                    <li>Match simple gadgets to the use to which they were put</li>
                    <li>
                      Identify and appreciate that the gadgets, tools and structures used in their homes and community
                      are made by humans
                    </li>
                    <li>
                      Demonstrate they understand that we can make comparisons and determinations by collecting data in
                      experiments
                    </li>
                    <li>Compare the strengths of different folds of paper</li>
                    <li>Show that there are inventions all around us</li>
                    <li>Distinguish different shapes of columns</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">Skill Outcomes</AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Demonstrate an understanding of a design approach by using the design loop or design steps in a
                      real design challenge
                    </li>
                    <li>Make predictions about how to solve a real design challenge</li>
                    <li>Make drawings of proposed solutions to real design challenges</li>
                    <li>Hypothesize why problem solutions worked or didn't satisfy the design challenge</li>
                    <li>Develop manual dexterity in building a solution to a real design challenge</li>
                    <li>Making measurements and preparing a scaled drawing</li>
                    <li>Predicting a materials list for a project</li>
                    <li>
                      Observe and record natural or human made problems or situations that are affecting people, in the
                      home, school and community
                    </li>
                    <li>Construct a device or tool, based on the plan, to solve the problem</li>
                    <li>Predict the possible outcomes/results or benefits of the designed tool</li>
                    <li>Demonstrate the ability to explain to people the why/how and benefit of their model design</li>
                    <li>Given problems, be able to design and construct simple gadgets</li>
                    <li>Evaluate two different gadgets using named criteria</li>
                    <li>Share information with peers on the nature of technology</li>
                    <li>
                      Formulate problems and do research in development of technological devices (construct models and
                      gadgets)
                    </li>
                    <li>Observe the results of experiments and make a hypothesis</li>
                    <li>Infer that the number of folds has an impact on paper strength</li>
                    <li>Measure number of folds and numbers of paper clips</li>
                    <li>Communicate community inventions</li>
                    <li>Construct columns with paper</li>
                    <li>Investigate information about inventors</li>
                    <li>Analyse experimental data</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Attitudes and Values
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Appreciate the importance of finding solutions to everyday problems and of objects and tools
                      created/ used to solve problems
                    </li>
                    <li>Understanding the importance of problem-solving as a life skill</li>
                    <li>Becoming aware of the viability and importance of careers in engineering and technology</li>
                    <li>Participate actively in classroom discussions, contributing design ideas</li>
                    <li>
                      Collaborating productively in team preparation of design planning and construction of solutions
                    </li>
                    <li>
                      Express the desire to find solutions to the problem identified by asking many questions during the
                      survey to understand the problems faced by people
                    </li>
                    <li>
                      Demonstrate an awareness of the need to care for the environment by recycling materials to
                      construct a tool or object to solve the problem identified
                    </li>
                    <li>
                      Show sensitivity and assist their peers who may have learning and physical challenges as they are
                      engaged in the engineering design process
                    </li>
                    <li>
                      Appreciate the advantages and disadvantages of using devices, tools and structures made by humans
                    </li>
                    <li>
                      Scientific and technological activities are usually influenced by the values and beliefs of humans
                      and their societies
                    </li>
                    <li>
                      Appreciate that humans adapt through problem solving (technology) and engineer new inventions to
                      make life easier
                    </li>
                    <li>Demonstrate respect for evidence as they make conclusions based on collected data</li>
                    <li>Collaborate & cooperate as they conduct experiments</li>
                    <li>
                      Display sensitivity and offer assistance to peers who may have physical or learning challenges
                      especially when conducting practical and group work
                    </li>
                    <li>Participate actively in classroom discussions</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-violet-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-violet-50">
              <CardTitle className="text-violet-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-violet-700">Observations:</strong> Teacher observations during design
                  challenges, problem-solving activities, and testing of solutions
                </li>
                <li>
                  <strong className="text-violet-700">Conversations:</strong> Student explanations, questions, and
                  discussions about engineering problems and solutions
                </li>
                <li>
                  <strong className="text-violet-700">Products:</strong> Student sketches, drawings, models, and written
                  responses
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
                <h4 className="font-semibold mb-2 text-violet-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for design process activities</li>
                  <li>Rubrics for evaluating design solutions and models</li>
                  <li>Engineering journals with prompts for recording design ideas and test results</li>
                  <li>Performance tasks that require application of engineering design process</li>
                  <li>Self-assessment tools for group work and collaboration</li>
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
                  <AccordionTrigger>Defining Problems</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Problem Identification:</strong> Guide students in identifying problems in their school,
                        home, or community that could be solved through engineering.
                      </li>
                      <li>
                        <strong>Question Generation:</strong> Practice asking questions to clarify problems and gather
                        information about potential solutions.
                      </li>
                      <li>
                        <strong>Problem Definition:</strong> Use graphic organizers to help students define problems in
                        a way that can be addressed through engineering.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Shape and Function</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Shape Exploration:</strong> Examine everyday objects to observe how their shapes relate
                        to their functions.
                      </li>
                      <li>
                        <strong>Design Sketching:</strong> Practice creating sketches and drawings to illustrate design
                        ideas, focusing on how shapes contribute to function.
                      </li>
                      <li>
                        <strong>Model Building:</strong> Create physical models using simple materials to demonstrate
                        how shape affects function.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Testing Designs</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Design Testing:</strong> Conduct tests of objects designed to solve the same problem,
                        collecting data on their performance.
                      </li>
                      <li>
                        <strong>Data Analysis:</strong> Analyze test results to identify strengths and weaknesses of
                        different designs.
                      </li>
                      <li>
                        <strong>Design Comparison:</strong> Compare multiple designs based on test results, discussing
                        which features contribute to better performance.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Engineering Design Process</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Design Loop Introduction:</strong> Introduce the engineering design process (ask,
                        imagine, plan, create, improve) through simple, hands-on activities.
                      </li>
                      <li>
                        <strong>Design Challenges:</strong> Engage students in design challenges that require them to
                        apply the engineering design process to solve problems.
                      </li>
                      <li>
                        <strong>Reflection and Improvement:</strong> Guide students in reflecting on their designs and
                        identifying ways to improve them based on testing and feedback.
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
                <li>OECS Grade 2 Science Curriculum Guide</li>
                <li>Engineering design process posters and charts</li>
                <li>Examples of everyday objects with different shapes and functions</li>
                <li>Design challenge activity guides</li>
                <li>Testing and data collection templates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Simple materials for creating models (paper, cardboard, clay, etc.)</li>
                <li>Drawing and sketching supplies</li>
                <li>Engineering journals for recording design ideas and test results</li>
                <li>Testing materials (rulers, timers, weights, etc.)</li>
                <li>Examples of engineering solutions to everyday problems</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Engineering is the process of designing solutions to problems using science, mathematics, and creativity.
              The engineering design process is a series of steps that engineers follow to solve problems: ask (define
              the problem), imagine (brainstorm solutions), plan (select a solution and draw it), create (build a
              prototype), and improve (test and refine the design). The shape of an object is closely related to its
              function. For example, aerodynamic shapes reduce air resistance, while strong shapes like triangles
              provide stability in structures. Testing is an essential part of the engineering process. By testing
              multiple designs and analyzing the results, engineers can identify strengths and weaknesses and make
              improvements. Engineers work in many different fields, including mechanical, electrical, civil, and
              biomedical engineering, to solve a wide range of problems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
