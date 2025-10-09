"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, FlaskRoundIcon as Flask, ClipboardCheck } from "lucide-react"

export default function StructurePropertiesMatterPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade2-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-lime-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <Flask className="mr-2 h-7 w-7 text-green-600" />
            Structure and Properties of Matter
          </h1>
          <p className="text-gray-700">
            The study of matter encompasses knowledge about the structure and behavior of the physical world. Students
            will investigate different materials, their properties, and how they can change. Through observation and
            experimentation, students will develop an understanding of the building blocks of our world and how they
            interact.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Structure and Properties of Matter
        </h3>

        <Tabs defaultValue="elo1">
          <TabsList className="grid w-full grid-cols-4 bg-green-100">
            <TabsTrigger value="elo1" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              ELO-1: Classifying Materials
            </TabsTrigger>
            <TabsTrigger value="elo2" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              ELO-2: Testing Materials
            </TabsTrigger>
            <TabsTrigger value="elo3" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              ELO-3: Disassembling Objects
            </TabsTrigger>
            <TabsTrigger value="elo4" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              ELO-4: Reversible Changes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="elo1" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Plan and conduct an investigation to describe and classify different kinds
              of materials by their observable properties.
            </h4>
            <p className="mb-2 text-sm italic">
              [Clarification Statement: Observations could include color, texture, hardness, and flexibility. Patterns
              could include the similar properties that different materials share.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe and describe the physical properties of different materials</li>
              <li>Group materials based on similar properties</li>
              <li>Identify patterns in how materials with similar properties behave</li>
              <li>Use scientific vocabulary to describe material properties</li>
              <li>Plan and conduct simple investigations to test material properties</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo2" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Analyze data obtained from testing different materials to determine which
              materials have the properties that are best suited for an intended purpose.
            </h4>
            <p className="mb-2 text-sm italic">
              [Clarification Statement: Examples of properties could include strength, flexibility, hardness, texture,
              and absorbency.] [Assessment Boundary: Assessment of quantitative measurements is limited to length.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Test materials to determine their specific properties</li>
              <li>Collect and record data from material testing</li>
              <li>Analyze data to identify patterns and relationships</li>
              <li>Match material properties to specific purposes or uses</li>
              <li>Make evidence-based decisions about which materials are best for a given purpose</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo3" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Make observations to construct an evidence-based account of how an object
              made of a small set of pieces can be disassembled and made into a new object.
            </h4>
            <p className="mb-2 text-sm italic">
              [Clarification Statement: Examples of pieces could include building blocks, bricks or other assorted small
              objects.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe how objects can be taken apart and reassembled</li>
              <li>Recognize that the same set of pieces can create different objects</li>
              <li>Document the process of disassembling and reassembling objects</li>
              <li>Compare and contrast original and new objects made from the same pieces</li>
              <li>Construct evidence-based explanations about object transformation</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo4" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 4: Construct an argument with evidence that some changes caused by heating or
              cooling can be reversed and some cannot.
            </h4>
            <p className="mb-2 text-sm italic">
              [Clarification Statement: Examples of reversible changes could include materials such as water and butter
              at different temperatures. Examples of irreversible changes could include cooking an egg, freezing a plant
              leaf, and heating paper.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe changes in materials when they are heated or cooled</li>
              <li>Classify changes as reversible or irreversible</li>
              <li>Collect evidence to support classifications</li>
              <li>Construct arguments based on evidence</li>
              <li>Communicate findings using scientific vocabulary</li>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Knowledge Outcomes
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Define key terms related to matter and its properties</li>
                    <li>Demonstrate understanding of the difference between fast and slow earth events</li>
                    <li>Compare substances before and after adding and/or removing heat</li>
                    <li>Account for why some processes are reversible and some are not</li>
                    <li>Explain the effect of heating and cooling on substances</li>
                    <li>Distinguish between a reversible and an irreversible change</li>
                    <li>State that water can change from solid to liquid and from liquid to solid</li>
                    <li>Describe the conditions for state change of water</li>
                    <li>Identify with examples, physical change in everyday life</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Skill Outcomes</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Observe the three states of matter</li>
                    <li>Identify the three states of matter and give examples of each</li>
                    <li>Observe different types of materials</li>
                    <li>Identify the properties of different materials</li>
                    <li>Compare different types of materials based on their observable properties</li>
                    <li>Compare solids, liquids and gases based on their properties</li>
                    <li>Classify matter as solids, liquids and gases</li>
                    <li>Classify materials based on observable properties</li>
                    <li>Classify objects based on the materials they are made from</li>
                    <li>Communicate the results from the various investigations to the class and teacher</li>
                    <li>Plan investigations to describe and classify different kinds of materials</li>
                    <li>Conduct investigations to classify materials by their observable properties</li>
                    <li>Collect and analyse data gathered after observing different materials</li>
                    <li>Collect and analyse data gathered after observing each state of matter</li>
                    <li>
                      Analyze and interpret data obtained from their observations to classify matter and materials
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Attitudes and Values
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Develop curiosity by finding out about objects and materials around them</li>
                    <li>Appreciate that materials have similar and different properties</li>
                    <li>Develop inquiry through investigating materials and their properties</li>
                    <li>
                      Show respect for evidence by using the results from the investigations to make classifications
                    </li>
                    <li>
                      Safety when conducting practical and group work, display sensitivity and offer assistance to peers
                      who may have physical or learning challenges
                    </li>
                    <li>Participate actively in classroom discussions</li>
                    <li>
                      Show persistence in completing practical activities, especially those that may be challenging
                    </li>
                    <li>
                      Work collaboratively, cooperatively and respectfully with other members of their group in
                      exploring and investigating different materials
                    </li>
                    <li>
                      Show sensitivity and demonstrate helpfulness when working with peers that may have learning or
                      physical challenges as you undertake experimental work together
                    </li>
                    <li>
                      Stewardship/Respect for Living Things:
                      <ul className="list-disc pl-5 mt-1">
                        <li>
                          Take care not to damage objects (living and non-living things) when they are making
                          observations about materials in the environment
                        </li>
                        <li>Use materials wisely</li>
                      </ul>
                    </li>
                    <li>
                      Safety:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Wear safety goggles when conducting certain experiments</li>
                        <li>Be careful not to taste materials unless told to do so by the teacher</li>
                        <li>Use safety protocols for collecting objects</li>
                        <li>
                          Wash hands after conducting certain activities, especially when playing with soil or materials
                          collected outside the classroom
                        </li>
                      </ul>
                    </li>
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
                  activities, group work, and discussions
                </li>
                <li>
                  <strong className="text-lime-700">Conversations:</strong> Student explanations, questions, and
                  discussions about materials and their properties
                </li>
                <li>
                  <strong className="text-lime-700">Products:</strong> Student drawings, charts, tables, and written
                  responses
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-lime-50 to-green-50 rounded-lg border border-lime-100">
                <h4 className="font-semibold mb-2 text-lime-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for material classification activities</li>
                  <li>Rubrics for evaluating student investigations and experiments</li>
                  <li>Science journals with prompts for reflection and self-assessment</li>
                  <li>Concept maps to assess understanding of material properties</li>
                  <li>Performance tasks that require application of knowledge about materials</li>
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
                  <AccordionTrigger>Classifying Materials by Properties</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Material Exploration Centers:</strong> Set up stations with various materials for
                        students to observe, touch, and describe using scientific vocabulary.
                      </li>
                      <li>
                        <strong>Property Detectives:</strong> Students work in small groups to investigate and classify
                        materials based on observable properties like texture, hardness, and flexibility.
                      </li>
                      <li>
                        <strong>Sensory Sorting:</strong> Provide materials with different properties for students to
                        sort based on how they look, feel, sound, and behave.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Testing Materials for Intended Purpose</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Material Testing Lab:</strong> Students design and conduct tests to determine which
                        materials are best suited for specific purposes.
                      </li>
                      <li>
                        <strong>Engineering Challenges:</strong> Present students with real-world problems that require
                        selecting appropriate materials based on their properties.
                      </li>
                      <li>
                        <strong>Data Collection and Analysis:</strong> Guide students in collecting, recording, and
                        analyzing data from material tests using simple charts and graphs.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Disassembling and Reassembling Objects</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Building Block Challenges:</strong> Provide students with building blocks or other small
                        pieces to create objects, then disassemble and create new objects.
                      </li>
                      <li>
                        <strong>Documentation Station:</strong> Students document the process of disassembling and
                        reassembling objects through drawings, photographs, or simple written descriptions.
                      </li>
                      <li>
                        <strong>Compare and Contrast:</strong> Guide students in comparing original and new objects made
                        from the same set of pieces, focusing on similarities and differences.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Reversible and Irreversible Changes</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Heating and Cooling Investigations:</strong> Conduct simple experiments to observe how
                        materials change when heated or cooled, and whether these changes can be reversed.
                      </li>
                      <li>
                        <strong>Change Detectives:</strong> Students observe and classify changes as reversible or
                        irreversible, collecting evidence to support their classifications.
                      </li>
                      <li>
                        <strong>Argument Construction:</strong> Guide students in constructing arguments with evidence
                        about whether specific changes can be reversed.
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
                <li>"Change it: Solids, Liquids & Gases" by Adrienne Mason</li>
                <li>"It does Matter: Different States of Matter" (digital resource)</li>
                <li>OECS Grade 2 Science Curriculum Guide</li>
                <li>Material property classification charts</li>
                <li>Safety guidelines for classroom experiments</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Collection of materials with different properties</li>
                <li>Building blocks and construction sets</li>
                <li>Simple testing equipment (magnifiers, balance scales, rulers)</li>
                <li>Science journals for recording observations and data</li>
                <li>Visual aids showing states of matter and material properties</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Matter is anything that has mass and takes up space. All matter is made up of particles that are too small
              to see with the naked eye. The three states of matter are solid, liquid, and gas. The state of matter
              depends on how close together the particles are and how they move. In solids, particles are packed closely
              together and vibrate in place. In liquids, particles are close but can move around each other. In gases,
              particles are far apart and move freely. Matter can change from one state to another through heating or
              cooling. Some changes in matter are reversible (like melting ice), while others are irreversible (like
              cooking an egg).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
