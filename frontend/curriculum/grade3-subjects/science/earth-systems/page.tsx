import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Mountain, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EarthSystemsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-pink-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-pink-700 flex items-center">
            <Mountain className="mr-2 h-7 w-7 text-pink-600" />
            Earth's Systems
          </h1>
          <p className="text-gray-700">
            In Grade 3, students investigate the different types of landforms and bodies of water on Earth. They explore
            how Earth's systems interact, examine the distribution of water on Earth, and learn about natural hazards
            and how humans can reduce their impacts. Through these explorations, students develop an understanding of
            Earth's major systems and the processes that shape our planet.
          </p>
        </div>
      </div>

      <div className="bg-pink-50 p-6 rounded-lg border border-pink-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-pink-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Earth's Systems
        </h3>

        <Tabs defaultValue="landforms">
          <TabsList className="grid w-full grid-cols-3 bg-pink-100">
            <TabsTrigger value="landforms" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Landforms & Water
            </TabsTrigger>
            <TabsTrigger value="water" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Water Distribution
            </TabsTrigger>
            <TabsTrigger value="hazards" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Natural Hazards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="landforms" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Represent data in tables and graphical displays to describe typical weather
              conditions expected during a particular season
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify and describe various landforms (mountains, hills, valleys, etc.)</li>
              <li>Identify and describe various bodies of water (oceans, lakes, rivers, etc.)</li>
              <li>Create models to represent different landforms and bodies of water</li>
              <li>Use maps to locate major landforms and bodies of water</li>
              <li>Compare and contrast different types of landforms and bodies of water</li>
              <li>Investigate how landforms and bodies of water change over time</li>
              <li>Explore the relationships between landforms and bodies of water in a region</li>
            </ul>
          </TabsContent>

          <TabsContent value="water" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Obtain and combine information about ways individual communities use science
              ideas to protect the Earth's resources and environment
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe the distribution of water on Earth (oceans, lakes, rivers, groundwater, glaciers)</li>
              <li>Recognize that most of Earth's water is in the oceans</li>
              <li>Investigate the water cycle and how water moves between Earth's systems</li>
              <li>Explore how humans use and depend on water resources</li>
              <li>Research ways communities conserve and protect water resources</li>
              <li>Analyze the importance of freshwater for humans and other organisms</li>
              <li>Create models or diagrams to represent the water cycle and water distribution</li>
            </ul>
          </TabsContent>

          <TabsContent value="hazards" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Make a claim about the merit of a design solution that reduces the impacts
              of a weather-related hazard
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Identify various natural hazards related to Earth's systems (earthquakes, volcanoes, floods, etc.)
              </li>
              <li>Investigate the causes and effects of natural hazards</li>
              <li>Research how humans predict and prepare for natural hazards</li>
              <li>Explore design solutions that reduce the impacts of natural hazards</li>
              <li>Evaluate the effectiveness of different design solutions</li>
              <li>Make evidence-based claims about the merit of specific solutions</li>
              <li>Communicate design solutions and their benefits</li>
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
                  Landforms and Bodies of Water
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and describe various landforms (mountains, hills, valleys, plateaus, plains, etc.)</li>
                    <li>Identify and describe various bodies of water (oceans, lakes, rivers, streams, ponds, etc.)</li>
                    <li>Create models to represent different landforms and bodies of water</li>
                    <li>Use maps to locate major landforms and bodies of water</li>
                    <li>Compare and contrast different types of landforms and bodies of water</li>
                    <li>Investigate how landforms and bodies of water change over time</li>
                    <li>Explore the relationships between landforms and bodies of water in a region</li>
                    <li>Recognize that Earth's surface is made up of land and water in varying proportions</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Water Distribution and the Water Cycle
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Describe the distribution of water on Earth (oceans, lakes, rivers, groundwater, glaciers)</li>
                    <li>Recognize that most of Earth's water is in the oceans</li>
                    <li>Distinguish between freshwater and saltwater resources</li>
                    <li>Investigate the water cycle and how water moves between Earth's systems</li>
                    <li>
                      Identify the processes involved in the water cycle (evaporation, condensation, precipitation,
                      etc.)
                    </li>
                    <li>Explore how humans use and depend on water resources</li>
                    <li>Research ways communities conserve and protect water resources</li>
                    <li>Create models or diagrams to represent the water cycle and water distribution</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Natural Hazards and Human Impacts
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Identify various natural hazards related to Earth's systems (earthquakes, volcanoes, floods, etc.)
                    </li>
                    <li>Investigate the causes and effects of natural hazards</li>
                    <li>Research how humans predict and prepare for natural hazards</li>
                    <li>Explore design solutions that reduce the impacts of natural hazards</li>
                    <li>Evaluate the effectiveness of different design solutions</li>
                    <li>Make evidence-based claims about the merit of specific solutions</li>
                    <li>Communicate design solutions and their benefits</li>
                    <li>Recognize the importance of preparation and planning for natural hazards</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Earth's Systems and Interactions
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify Earth's major systems (geosphere, hydrosphere, atmosphere, biosphere)</li>
                    <li>Investigate how Earth's systems interact with each other</li>
                    <li>Explore how changes in one system can affect other systems</li>
                    <li>Analyze how living things interact with Earth's systems</li>
                    <li>Investigate how humans depend on and affect Earth's systems</li>
                    <li>Research ways to protect and preserve Earth's systems</li>
                    <li>Create models or diagrams to represent interactions between Earth's systems</li>
                    <li>Recognize the importance of maintaining the balance of Earth's systems</li>
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
                  <strong className="text-pink-700">Observations:</strong> Teacher observations during landform
                  modeling, water cycle investigations, and natural hazard research
                </li>
                <li>
                  <strong className="text-pink-700">Conversations:</strong> Student explanations of Earth's systems,
                  water distribution, and natural hazard solutions
                </li>
                <li>
                  <strong className="text-pink-700">Products:</strong> Student work samples, including landform models,
                  water cycle diagrams, and natural hazard solution designs
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100">
                <h4 className="font-semibold mb-2 text-pink-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for modeling and investigation skills</li>
                  <li>Rubrics for evaluating landform models and design solutions</li>
                  <li>Performance tasks involving Earth's systems and water cycle concepts</li>
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
                  <AccordionTrigger>Landform and Water Body Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Landform Modeling:</strong> Guide students in creating models of different landforms and
                        bodies of water using clay, sand, or other materials.
                      </li>
                      <li>
                        <strong>Map Exploration:</strong> Provide opportunities for students to explore maps and
                        identify various landforms and bodies of water.
                      </li>
                      <li>
                        <strong>Virtual Field Trips:</strong> Use videos and virtual tours to explore different
                        landforms and bodies of water around the world.
                      </li>
                      <li>
                        <strong>Comparison Activities:</strong> Engage students in comparing and contrasting different
                        types of landforms and bodies of water using Venn diagrams or other graphic organizers.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Water Distribution Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Water Cycle Demonstrations:</strong> Use demonstrations and models to illustrate the
                        water cycle and how water moves between Earth's systems.
                      </li>
                      <li>
                        <strong>Water Distribution Models:</strong> Create visual representations of water distribution
                        on Earth, showing the proportions of freshwater and saltwater.
                      </li>
                      <li>
                        <strong>Water Conservation Research:</strong> Have students research and present information
                        about water conservation practices in their community.
                      </li>
                      <li>
                        <strong>Water Testing Activities:</strong> Engage students in simple water testing activities to
                        explore water quality and properties.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Natural Hazard Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Hazard Case Studies:</strong> Examine real-world examples of natural hazards and their
                        impacts on communities.
                      </li>
                      <li>
                        <strong>Design Challenges:</strong> Present students with design challenges related to reducing
                        the impacts of specific natural hazards.
                      </li>
                      <li>
                        <strong>Model Testing:</strong> Guide students in building and testing models of their design
                        solutions.
                      </li>
                      <li>
                        <strong>Solution Evaluation:</strong> Engage students in evaluating different solutions based on
                        criteria such as effectiveness, cost, and feasibility.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Earth's Systems Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>System Interaction Models:</strong> Create models or diagrams that illustrate how
                        Earth's systems interact with each other.
                      </li>
                      <li>
                        <strong>Cause and Effect Activities:</strong> Engage students in exploring how changes in one
                        system can affect other systems.
                      </li>
                      <li>
                        <strong>Human Impact Investigations:</strong> Guide students in investigating how human
                        activities affect Earth's systems.
                      </li>
                      <li>
                        <strong>Conservation Projects:</strong> Involve students in projects focused on protecting and
                        preserving Earth's systems.
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
                        students' understanding of Earth's systems concepts.
                      </li>
                      <li>
                        <strong>Tiered Activities:</strong> Adjust the complexity of modeling, investigation, and design
                        activities based on students' readiness levels.
                      </li>
                      <li>
                        <strong>Multiple Representations:</strong> Provide opportunities for students to demonstrate
                        their understanding through various means (drawing, building, explaining, writing).
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Incorporate partner and small group activities to
                        support peer learning and discussion of Earth's systems concepts.
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
                <li>Materials for creating landform and water body models</li>
                <li>Maps and globes showing Earth's features</li>
                <li>Water cycle demonstration materials</li>
                <li>Natural hazard information and case studies</li>
                <li>Videos and images of Earth's systems and features</li>
                <li>OECS Grade 3 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Science journals for recording observations and reflections</li>
                <li>Materials for creating models and diagrams</li>
                <li>Earth's systems vocabulary cards</li>
                <li>Visual aids and reference materials</li>
                <li>Simple maps and mapping tools</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Earth's Systems in Grade 3 builds upon students' earlier experiences with observing and describing Earth's
              features. Students develop a deeper understanding of the different types of landforms and bodies of water
              that make up Earth's surface. They learn about the distribution of water on Earth, with most water being
              in the oceans, and explore the water cycle as a way that water moves between Earth's systems. Students
              also investigate natural hazards related to Earth's systems and design solutions to reduce their impacts.
              Through modeling, investigation, and design activities, students develop an understanding of Earth's major
              systems (geosphere, hydrosphere, atmosphere, biosphere) and how these systems interact with each other and
              with human activities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
