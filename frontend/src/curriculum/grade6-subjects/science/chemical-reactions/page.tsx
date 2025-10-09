import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ClipboardCheck, BookOpen, Users, Target, Zap } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ChemicalReactionsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade6-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-orange-700 flex items-center">
            <Zap className="mr-2 h-7 w-7 text-orange-600" />
            Chemical Reactions and Conservation of Mass
          </h1>
          <p className="text-gray-700 text-lg">
            Investigate chemical changes, analyze evidence of reactions, and understand the fundamental principle of
            mass conservation in chemical processes.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Chemical Changes</Badge>
            <Badge variant="secondary">Conservation of Mass</Badge>
            <Badge variant="secondary">Reaction Evidence</Badge>
            <Badge variant="secondary">Energy Transfer</Badge>
            <Badge variant="secondary">Catalysts</Badge>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-orange-700 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Essential Learning Outcomes & Chemical Understanding
        </h3>

        <Tabs defaultValue="evidence">
          <TabsList className="grid w-full grid-cols-3 bg-orange-100">
            <TabsTrigger value="evidence" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              Reaction Evidence
            </TabsTrigger>
            <TabsTrigger
              value="conservation"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              Mass Conservation
            </TabsTrigger>
            <TabsTrigger
              value="energy-catalysts"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              Energy & Catalysts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evidence" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-3 text-orange-800">
              Essential Learning Outcome 1: Analyze and interpret data on chemical reactions to provide evidence that
              atoms are conserved during chemical reactions.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Observable Evidence of Chemical Reactions:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Color changes in reactants and products</li>
                  <li>Gas production (bubbling or effervescence)</li>
                  <li>Temperature changes (heat release or absorption)</li>
                  <li>Precipitate formation (solid from liquid solutions)</li>
                  <li>Light emission or changes in luminescence</li>
                  <li>Odor changes or new smell production</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Data Collection Methods:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Before and after mass measurements</li>
                  <li>Temperature monitoring during reactions</li>
                  <li>pH changes using indicators</li>
                  <li>Visual observation and documentation</li>
                  <li>Gas volume measurements</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conservation" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-3 text-orange-800">
              Essential Learning Outcome 2: Develop and use a model to describe how the total number of atoms does not
              change in a chemical reaction.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Conservation Principles:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Atoms are neither created nor destroyed in reactions</li>
                  <li>Total mass of reactants equals total mass of products</li>
                  <li>Atoms are rearranged to form new compounds</li>
                  <li>Chemical equations must be balanced</li>
                  <li>Closed systems show perfect mass conservation</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Modeling Techniques:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Molecular models showing before and after</li>
                  <li>Balanced chemical equation writing</li>
                  <li>Atom counting in reactants and products</li>
                  <li>Visual representations of rearrangement</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="energy-catalysts" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-3 text-orange-800">
              Essential Learning Outcome 3: Undertake a design project to construct, test and modify a device that
              either releases or absorbs thermal energy by chemical processes.
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Energy in Reactions:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Exothermic reactions release heat energy</li>
                  <li>Endothermic reactions absorb heat energy</li>
                  <li>Activation energy needed to start reactions</li>
                  <li>Catalysts lower activation energy</li>
                  <li>Energy diagrams show reaction pathways</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Design Project Examples:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Hand warmers using iron oxidation</li>
                  <li>Cold packs with ammonium nitrate</li>
                  <li>Simple heat engines with chemical fuel</li>
                  <li>Catalytic converters for pollution control</li>
                  <li>Solar ovens with chemical heat storage</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-orange-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Detailed Curriculum Outcomes
              </CardTitle>
              <CardDescription>Comprehensive chemical reaction learning expectations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-orange-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                    Chemical Reaction Evidence and Analysis
                  </AccordionTrigger>
                  <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Students will understand:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Chemical reactions produce observable changes</li>
                          <li>Evidence can distinguish chemical from physical changes</li>
                          <li>Quantitative data supports reaction analysis</li>
                          <li>Multiple forms of evidence strengthen conclusions</li>
                          <li>Safety protocols are essential in chemical investigations</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Investigation Examples:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Baking soda and vinegar reaction analysis</li>
                          <li>Rusting of iron in different conditions</li>
                          <li>Burning candle mass change investigation</li>
                          <li>Antacid tablet reaction with acid</li>
                          <li>Elephant toothpaste demonstration</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Key Vocabulary:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            reactant
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            product
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            chemical change
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            precipitate
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            catalyst
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            indicator
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-orange-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                    Conservation of Mass in Chemical Reactions
                  </AccordionTrigger>
                  <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Mass Conservation Investigations:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Closed system reactions with mass measurements</li>
                          <li>Open system reactions accounting for gas escape</li>
                          <li>Precipitation reactions in sealed containers</li>
                          <li>Combustion reactions with gas collection</li>
                          <li>Decomposition reactions with product analysis</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Mathematical Connections:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Mass before reaction = Mass after reaction</li>
                          <li>Percentage calculations for mass changes</li>
                          <li>Ratio and proportion in chemical equations</li>
                          <li>Graphing mass vs. time data</li>
                          <li>Error analysis in experimental measurements</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h6 className="font-medium text-xs mb-1">Closed System Examples:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Sealed flask reactions</li>
                            <li>• Balloon-covered beakers</li>
                            <li>• Zip-lock bag experiments</li>
                            <li>• Stoppered test tubes</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-xs mb-1">Open System Considerations:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Gas escape to atmosphere</li>
                            <li>• Water vapor evaporation</li>
                            <li>• Oxygen absorption from air</li>
                            <li>• Apparent mass changes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-orange-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                    Energy Transfer and Thermal Devices
                  </AccordionTrigger>
                  <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Design Engineering Process:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Identify thermal energy needs and constraints</li>
                          <li>Research chemical reactions for energy transfer</li>
                          <li>Design and build prototype devices</li>
                          <li>Test device performance and efficiency</li>
                          <li>Modify design based on test results</li>
                          <li>Communicate design solutions and improvements</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Caribbean Applications:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Solar cooking with chemical heat storage</li>
                          <li>Hurricane emergency heating devices</li>
                          <li>Cooling systems for tropical climates</li>
                          <li>Water purification using chemical reactions</li>
                          <li>Sustainable energy from local materials</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-t-4 border-orange-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">Performance-Based Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Chemical reaction investigation labs</li>
                    <li>Mass conservation experiment reports</li>
                    <li>Thermal device design projects</li>
                    <li>Balanced equation portfolios</li>
                    <li>Safety protocol demonstrations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">Formative Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Daily reaction observation logs</li>
                    <li>Quick equation balancing exercises</li>
                    <li>Mass prediction and verification</li>
                    <li>Energy transfer concept maps</li>
                    <li>Peer explanation sessions</li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                  <h4 className="font-semibold mb-2 text-orange-700">Real-World Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Kitchen chemistry investigations</li>
                    <li>Environmental reaction analysis</li>
                    <li>Industrial process understanding</li>
                    <li>Energy efficiency evaluations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Differentiated Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="visual-spatial">
                  <AccordionTrigger>Visual-Spatial Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Reaction diagrams and flowcharts</li>
                      <li>Before/after molecular models</li>
                      <li>Energy level diagrams</li>
                      <li>Color-coded equation balancing</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hands-on">
                  <AccordionTrigger>Kinesthetic Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Hands-on reaction experiments</li>
                      <li>Physical equation balancing activities</li>
                      <li>Device construction projects</li>
                      <li>Mass measurement investigations</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="analytical">
                  <AccordionTrigger>Analytical Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Quantitative mass analysis</li>
                      <li>Mathematical equation balancing</li>
                      <li>Energy efficiency calculations</li>
                      <li>Data trend analysis and graphing</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="collaborative">
                  <AccordionTrigger>Social Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Group reaction investigations</li>
                      <li>Team device design challenges</li>
                      <li>Peer teaching of concepts</li>
                      <li>Collaborative lab safety protocols</li>
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
          <CardTitle>Comprehensive Resources and Safety Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-orange-700">Laboratory Equipment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Digital scales and analytical balances</li>
                <li>Thermometers and temperature probes</li>
                <li>pH meters and indicator solutions</li>
                <li>Graduated cylinders and pipettes</li>
                <li>Beakers, flasks, and test tubes</li>
                <li>Bunsen burners and hot plates</li>
                <li>Fume hoods for gas reactions</li>
                <li>Safety equipment (goggles, gloves, aprons)</li>
                <li>Fire extinguishers and safety showers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-orange-700">Chemical Supplies</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Household chemicals (baking soda, vinegar)</li>
                <li>Safe acids and bases for pH testing</li>
                <li>Metal samples for oxidation studies</li>
                <li>Indicator solutions and test strips</li>
                <li>Catalysts (hydrogen peroxide, enzymes)</li>
                <li>Precipitation reaction chemicals</li>
                <li>Combustion materials (candles, alcohol)</li>
                <li>Local materials for Caribbean contexts</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-orange-700">Safety Protocols</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Pre-lab safety briefings and agreements</li>
                <li>Proper chemical storage and labeling</li>
                <li>Emergency response procedures</li>
                <li>Waste disposal protocols</li>
                <li>Personal protective equipment use</li>
                <li>Ventilation requirements for reactions</li>
                <li>First aid procedures for chemical exposure</li>
                <li>Regular safety equipment inspections</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge and Preparation</h3>
            <p className="text-sm mb-3">
              Teachers should develop understanding of chemical reaction principles, safety protocols, and conservation
              laws. Emphasis should be placed on connecting abstract chemical concepts to observable phenomena and
              practical applications in Caribbean environments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Essential Chemistry Knowledge:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Chemical vs. physical change identification</li>
                  <li>Conservation of mass principles and applications</li>
                  <li>Energy transfer in chemical reactions</li>
                  <li>Balancing chemical equations</li>
                  <li>Catalyst function and mechanisms</li>
                  <li>Laboratory safety and chemical handling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pedagogical Strategies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Inquiry-based investigation design</li>
                  <li>Safety-first laboratory management</li>
                  <li>Data collection and analysis techniques</li>
                  <li>Engineering design process implementation</li>
                  <li>Real-world application connections</li>
                  <li>Differentiated instruction for diverse learners</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
