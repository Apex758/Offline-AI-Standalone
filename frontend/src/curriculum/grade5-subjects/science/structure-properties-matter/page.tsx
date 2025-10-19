import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ClipboardCheck, BookOpen, Users, Lightbulb, Target } from "lucide-react"

export default function StructurePropertiesMatterPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-emerald-100 to-green-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-emerald-700 flex items-center">
            <ClipboardCheck className="mr-2 h-7 w-7 text-emerald-600" />
            Structure and Properties of Matter
          </h1>
          <p className="text-gray-700 text-lg">
            Explore the particle theory of matter, states of matter, physical and chemical properties, and conservation
            of mass through hands-on investigations and real-world applications.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Particle Theory</Badge>
            <Badge variant="secondary">States of Matter</Badge>
            <Badge variant="secondary">Conservation of Mass</Badge>
            <Badge variant="secondary">Physical Properties</Badge>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-emerald-700 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Essential Learning Outcomes & Big Ideas
        </h3>

        <Tabs defaultValue="particle-theory">
          <TabsList className="grid w-full grid-cols-3 bg-emerald-100">
            <TabsTrigger
              value="particle-theory"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Particle Theory
            </TabsTrigger>
            <TabsTrigger
              value="conservation"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Conservation of Mass
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Real-World Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="particle-theory" className="p-4 border rounded-md mt-2 bg-emerald-50 border-emerald-200">
            <h4 className="font-semibold mb-3 text-emerald-800">
              Essential Learning Outcome 1: Develop a model to describe that matter is made of particles too small to be
              seen.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-emerald-200">
                <h5 className="font-medium text-emerald-700 mb-2">Key Concepts:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>All matter is composed of tiny particles in constant motion</li>
                  <li>Particle arrangement differs in solids, liquids, and gases</li>
                  <li>Temperature affects particle movement and state changes</li>
                  <li>Particles have spaces between them</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-emerald-200">
                <h5 className="font-medium text-emerald-700 mb-2">Student Learning Objectives:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Create and use models to explain particle behavior in different states</li>
                  <li>Predict how heating and cooling affects particle arrangement</li>
                  <li>Explain observable properties using particle theory</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conservation" className="p-4 border rounded-md mt-2 bg-emerald-50 border-emerald-200">
            <h4 className="font-semibold mb-3 text-emerald-800">
              Essential Learning Outcome 2: Measure and graph quantities to provide evidence that mass is conserved
              during physical and chemical changes.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-emerald-200">
                <h5 className="font-medium text-emerald-700 mb-2">Key Concepts:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Mass is conserved in all physical and chemical changes</li>
                  <li>Apparent mass changes in open systems due to gas exchange</li>
                  <li>Closed systems demonstrate true conservation of mass</li>
                  <li>Measurement accuracy is crucial for demonstrating conservation</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-emerald-200">
                <h5 className="font-medium text-emerald-700 mb-2">Investigation Skills:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Use precise measurement tools (digital scales, graduated cylinders)</li>
                  <li>Create data tables and graphs to track mass changes</li>
                  <li>Design controlled experiments with closed and open systems</li>
                  <li>Analyze data to identify patterns and draw conclusions</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="p-4 border rounded-md mt-2 bg-emerald-50 border-emerald-200">
            <h4 className="font-semibold mb-3 text-emerald-800">Real-World Applications & Caribbean Connections</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-emerald-200">
                <h5 className="font-medium text-emerald-700 mb-2">Local Examples:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Salt production through evaporation in Caribbean salt ponds</li>
                  <li>Sugar crystallization in local sugar processing</li>
                  <li>Water cycle and cloud formation in tropical climates</li>
                  <li>Coral reef formation and calcium carbonate structures</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-emerald-200">
                <h5 className="font-medium text-emerald-700 mb-2">Career Connections:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Food scientist studying preservation methods</li>
                  <li>Environmental scientist monitoring water quality</li>
                  <li>Materials engineer developing new products</li>
                  <li>Pharmacist understanding drug formulations</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Detailed Curriculum Outcomes
              </CardTitle>
              <CardDescription>Comprehensive learning expectations for Grade 5 students</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-emerald-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-emerald-50 px-4 py-2 rounded-md">
                    Particle Theory Understanding
                  </AccordionTrigger>
                  <AccordionContent className="bg-emerald-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Students will be able to:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>
                            Develop and use models to describe that matter is made of particles too small to be seen
                          </li>
                          <li>Compare particle arrangement and movement in solids, liquids, and gases</li>
                          <li>Explain how heating and cooling affects particle behavior and state changes</li>
                          <li>Use particle theory to explain observable properties like expansion and compression</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Key Vocabulary:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            particle
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            molecule
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            kinetic energy
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            state of matter
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            phase change
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-emerald-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-emerald-50 px-4 py-2 rounded-md">
                    Conservation of Mass Investigations
                  </AccordionTrigger>
                  <AccordionContent className="bg-emerald-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Investigation Skills:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Design and conduct controlled experiments to test mass conservation</li>
                          <li>Use precise measurement tools and techniques</li>
                          <li>Create data tables and graphs to analyze results</li>
                          <li>Explain apparent mass changes in open vs. closed systems</li>
                          <li>Calculate and verify mass conservation in chemical reactions</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Sample Investigations:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Dissolving salt in water (closed system)</li>
                          <li>Burning candle (open vs. closed system)</li>
                          <li>Ice melting and water evaporation</li>
                          <li>Mixing baking soda and vinegar</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-emerald-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-emerald-50 px-4 py-2 rounded-md">
                    Physical and Chemical Properties
                  </AccordionTrigger>
                  <AccordionContent className="bg-emerald-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Property Classification:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Distinguish between physical and chemical properties</li>
                          <li>Identify intensive vs. extensive properties</li>
                          <li>Use properties to identify and classify materials</li>
                          <li>Predict behavior based on known properties</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h6 className="font-medium text-xs mb-1">Physical Properties:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Color, odor, texture</li>
                            <li>• Density, melting point</li>
                            <li>• Solubility, conductivity</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-xs mb-1">Chemical Properties:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Flammability, reactivity</li>
                            <li>• pH, oxidation</li>
                            <li>• Decomposition</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-t-4 border-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-emerald-700">Formative Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Exit tickets with particle diagrams</li>
                    <li>Think-pair-share discussions</li>
                    <li>Lab observation checklists</li>
                    <li>Digital concept maps</li>
                    <li>Quick polls and quizzes</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-emerald-700">Summative Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Lab report portfolios</li>
                    <li>Model creation and explanation</li>
                    <li>Data analysis projects</li>
                    <li>Multimedia presentations</li>
                    <li>Performance-based tasks</li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                  <h4 className="font-semibold mb-2 text-emerald-700">Assessment Rubric Focus:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Scientific reasoning and evidence use</li>
                    <li>Model accuracy and explanation</li>
                    <li>Data collection and analysis skills</li>
                    <li>Communication of scientific ideas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="visual">
                  <AccordionTrigger>Visual Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Interactive particle simulations</li>
                      <li>Graphic organizers for properties</li>
                      <li>Color-coded state diagrams</li>
                      <li>Video demonstrations</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="kinesthetic">
                  <AccordionTrigger>Kinesthetic Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Human particle models (role-playing)</li>
                      <li>Hands-on lab investigations</li>
                      <li>Building 3D molecular models</li>
                      <li>Movement activities for states of matter</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="advanced">
                  <AccordionTrigger>Advanced Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Independent research projects</li>
                      <li>Complex multi-step investigations</li>
                      <li>Peer teaching opportunities</li>
                      <li>Real-world problem solving</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="support">
                  <AccordionTrigger>Students Needing Support</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Simplified vocabulary with visuals</li>
                      <li>Step-by-step procedure guides</li>
                      <li>Partner or small group work</li>
                      <li>Modified lab procedures</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Technology Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Digital Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>PhET Interactive Simulations (States of Matter)</li>
                  <li>Digital microscopes for particle observation</li>
                  <li>Data logging sensors for temperature/mass</li>
                  <li>Virtual lab platforms</li>
                  <li>Collaborative digital whiteboards</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Student Creation Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Stop-motion animation for particle movement</li>
                  <li>Digital presentations and infographics</li>
                  <li>Online graphing and data analysis tools</li>
                  <li>Virtual model building platforms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-Curricular Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-blue-600">Mathematics:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Graphing mass vs. time data</li>
                  <li>Calculating density and ratios</li>
                  <li>Measuring volume and area</li>
                  <li>Statistical analysis of results</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-600">Language Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Scientific writing and lab reports</li>
                  <li>Reading comprehension of science texts</li>
                  <li>Vocabulary development</li>
                  <li>Oral presentations of findings</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-purple-600">Social Studies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>History of atomic theory</li>
                  <li>Cultural uses of materials</li>
                  <li>Environmental impact of materials</li>
                  <li>Economic importance of resources</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-emerald-700">Laboratory Equipment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Digital scales (0.1g precision)</li>
                <li>Graduated cylinders and beakers</li>
                <li>Thermometers and hot plates</li>
                <li>Magnifying glasses and microscopes</li>
                <li>Various materials for testing</li>
                <li>Safety equipment (goggles, aprons)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-emerald-700">Digital Resources</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Interactive particle simulations</li>
                <li>Virtual laboratory platforms</li>
                <li>Educational videos and animations</li>
                <li>Online assessment tools</li>
                <li>Digital graphing applications</li>
                <li>Collaborative workspace platforms</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-emerald-700">Professional Development</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Inquiry-based learning strategies</li>
                <li>Safety protocols for investigations</li>
                <li>Assessment rubric development</li>
                <li>Technology integration training</li>
                <li>Differentiation techniques</li>
                <li>Caribbean context integration</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge Requirements</h3>
            <p className="text-sm mb-3">
              Teachers should have a solid understanding of particle theory, conservation laws, and the nature of
              scientific inquiry. Professional development should focus on hands-on investigation techniques and
              connecting abstract concepts to observable phenomena.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Essential Knowledge:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Kinetic molecular theory fundamentals</li>
                  <li>Conservation of mass principles</li>
                  <li>Physical vs. chemical change distinctions</li>
                  <li>Measurement precision and accuracy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pedagogical Skills:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Facilitating student-led investigations</li>
                  <li>Questioning techniques for deeper thinking</li>
                  <li>Managing laboratory safety</li>
                  <li>Supporting diverse learning needs</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
