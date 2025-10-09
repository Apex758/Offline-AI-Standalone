import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ClipboardCheck, BookOpen, Users, Lightbulb, Target, Atom } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function StructurePropertiesMatterPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade6-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Atom className="mr-2 h-7 w-7 text-purple-600" />
            Structure and Properties of Matter
          </h1>
          <p className="text-gray-700 text-lg">
            Investigate the atomic structure of matter, explore chemical and physical properties, and understand how
            molecular motion relates to temperature and state changes.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Atomic Structure</Badge>
            <Badge variant="secondary">Chemical Properties</Badge>
            <Badge variant="secondary">Physical Properties</Badge>
            <Badge variant="secondary">Molecular Motion</Badge>
            <Badge variant="secondary">States of Matter</Badge>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Essential Learning Outcomes & Atomic Understanding
        </h3>

        <Tabs defaultValue="atomic-structure">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger
              value="atomic-structure"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Atomic Structure
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Material Properties
            </TabsTrigger>
            <TabsTrigger
              value="molecular-motion"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Molecular Motion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="atomic-structure" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-3 text-purple-800">
              Essential Learning Outcome 1: Develop models to describe the atomic composition of simple molecules and
              extended structures.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Atomic Structure Concepts:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Atoms as building blocks of all matter</li>
                  <li>Protons, neutrons, and electrons in atomic structure</li>
                  <li>How atoms combine to form molecules</li>
                  <li>Simple molecular structures (water, carbon dioxide, salt)</li>
                  <li>Extended structures in crystals and polymers</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Modeling Skills:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Create 3D models of simple molecules</li>
                  <li>Use ball-and-stick representations</li>
                  <li>Draw atomic diagrams with electron shells</li>
                  <li>Build crystal lattice structures</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-3 text-purple-800">
              Essential Learning Outcome 2: Analyze and interpret data on properties of materials to determine which
              materials have the properties best suited for an intended purpose.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Physical Properties:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Density, hardness, and flexibility</li>
                  <li>Melting and boiling points</li>
                  <li>Electrical and thermal conductivity</li>
                  <li>Magnetic properties</li>
                  <li>Solubility in different solvents</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Chemical Properties:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Reactivity with acids and bases</li>
                  <li>Flammability and combustion</li>
                  <li>Oxidation and corrosion resistance</li>
                  <li>pH levels and acidity</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="molecular-motion" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-3 text-purple-800">
              Essential Learning Outcome 3: Develop a model to predict the effect of heat energy on states of matter and
              molecular motion.
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">States of Matter:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Solid: tightly packed, vibrating particles</li>
                  <li>Liquid: loosely packed, flowing particles</li>
                  <li>Gas: widely spaced, rapidly moving particles</li>
                  <li>Plasma: ionized gas at very high temperatures</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Energy and Phase Changes:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Melting: solid to liquid (heat added)</li>
                  <li>Freezing: liquid to solid (heat removed)</li>
                  <li>Evaporation: liquid to gas (heat added)</li>
                  <li>Condensation: gas to liquid (heat removed)</li>
                  <li>Sublimation: solid directly to gas</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Detailed Curriculum Outcomes
              </CardTitle>
              <CardDescription>Comprehensive matter and atomic structure learning expectations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                    Atomic Composition and Molecular Structure
                  </AccordionTrigger>
                  <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Students will understand:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>All matter is composed of atoms</li>
                          <li>Atoms combine in specific ratios to form compounds</li>
                          <li>Molecular formulas represent atomic composition</li>
                          <li>Crystal structures show repeating atomic patterns</li>
                          <li>Polymers are long chains of repeating units</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Investigation Examples:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Build models of water, carbon dioxide, and methane</li>
                          <li>Examine salt crystals under magnification</li>
                          <li>Create polymer chains using molecular models</li>
                          <li>Compare structures of diamond and graphite</li>
                          <li>Investigate DNA double helix structure</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Key Vocabulary:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            atom
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            molecule
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            compound
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            element
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            crystal
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            polymer
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                    Material Properties and Applications
                  </AccordionTrigger>
                  <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Property Testing Methods:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Density measurements using mass and volume</li>
                          <li>Hardness testing with scratch tests</li>
                          <li>Conductivity testing with simple circuits</li>
                          <li>Solubility experiments with various solvents</li>
                          <li>pH testing with indicators and meters</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Material Selection Criteria:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Strength requirements for construction materials</li>
                          <li>Flexibility needs for packaging materials</li>
                          <li>Conductivity for electrical applications</li>
                          <li>Chemical resistance for storage containers</li>
                          <li>Cost-effectiveness and availability</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h6 className="font-medium text-xs mb-1">Physical Properties:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Color and appearance</li>
                            <li>• Density and mass</li>
                            <li>• Melting/boiling points</li>
                            <li>• Conductivity</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-xs mb-1">Chemical Properties:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Reactivity with acids</li>
                            <li>• Flammability</li>
                            <li>• Corrosion resistance</li>
                            <li>• pH characteristics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                    Heat Energy and States of Matter
                  </AccordionTrigger>
                  <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Kinetic Molecular Theory:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>All matter consists of moving particles</li>
                          <li>Temperature measures average kinetic energy</li>
                          <li>Higher temperature = faster particle motion</li>
                          <li>Phase changes occur at specific temperatures</li>
                          <li>Energy is required for phase transitions</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Caribbean Climate Applications:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Water evaporation in tropical heat</li>
                          <li>Condensation during cool nights</li>
                          <li>Salt crystallization from seawater</li>
                          <li>Ice formation in high-altitude areas</li>
                          <li>Sublimation of dry ice in demonstrations</li>
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
          <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-purple-700">Performance-Based Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Molecular model construction projects</li>
                    <li>Material property testing labs</li>
                    <li>Phase change demonstration experiments</li>
                    <li>Material selection design challenges</li>
                    <li>Atomic structure drawing portfolios</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-purple-700">Formative Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Daily observation journals</li>
                    <li>Quick molecular sketches</li>
                    <li>Property prediction activities</li>
                    <li>Temperature and state change graphs</li>
                    <li>Peer explanation sessions</li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <h4 className="font-semibold mb-2 text-purple-700">Real-World Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Kitchen chemistry investigations</li>
                    <li>Building material analysis</li>
                    <li>Weather and phase change connections</li>
                    <li>Local mineral identification</li>
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
                      <li>3D molecular model kits</li>
                      <li>Atomic structure diagrams</li>
                      <li>Phase change animations</li>
                      <li>Property comparison charts</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hands-on">
                  <AccordionTrigger>Kinesthetic Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Physical molecular building activities</li>
                      <li>Material testing experiments</li>
                      <li>Temperature and phase change labs</li>
                      <li>Crystal growing investigations</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="analytical">
                  <AccordionTrigger>Analytical Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Data analysis of material properties</li>
                      <li>Mathematical calculations of density</li>
                      <li>Graph interpretation of phase changes</li>
                      <li>Research-based material comparisons</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="collaborative">
                  <AccordionTrigger>Social Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Group molecular modeling projects</li>
                      <li>Team material testing challenges</li>
                      <li>Peer teaching of atomic concepts</li>
                      <li>Collaborative lab investigations</li>
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
                <h4 className="font-semibold mb-2">Digital Modeling Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>PhET Interactive Simulations for atoms</li>
                  <li>ChemSketch for molecular drawing</li>
                  <li>Virtual molecular model builders</li>
                  <li>3D printing of molecular structures</li>
                  <li>Augmented reality chemistry apps</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Collection Technology:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Digital scales for mass measurements</li>
                  <li>Temperature probes and data loggers</li>
                  <li>pH meters and conductivity sensors</li>
                  <li>Digital microscopes for crystal observation</li>
                  <li>Tablet apps for data recording</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Visualization Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Molecular visualization software</li>
                  <li>Phase change simulation programs</li>
                  <li>Interactive periodic table apps</li>
                  <li>Virtual laboratory environments</li>
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
                  <li>Density calculations (mass ÷ volume)</li>
                  <li>Ratio and proportion in molecular formulas</li>
                  <li>Graphing temperature vs. time data</li>
                  <li>Geometric shapes in crystal structures</li>
                  <li>Statistical analysis of property data</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-600">Language Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Scientific vocabulary development</li>
                  <li>Lab report writing and documentation</li>
                  <li>Research skills for material properties</li>
                  <li>Presentation of experimental findings</li>
                  <li>Reading scientific articles and texts</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-purple-600">Social Studies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Historical development of atomic theory</li>
                  <li>Cultural uses of materials and minerals</li>
                  <li>Economic importance of material properties</li>
                  <li>Environmental impact of material choices</li>
                  <li>Traditional Caribbean material knowledge</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-red-600">Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Artistic representation of molecular structures</li>
                  <li>Crystal pattern designs and symmetry</li>
                  <li>Color theory and material properties</li>
                  <li>Sculpture using different materials</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Resources and Laboratory Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-purple-700">Laboratory Equipment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Molecular model kits (ball-and-stick)</li>
                <li>Digital scales and balances</li>
                <li>Thermometers and temperature probes</li>
                <li>pH meters and test strips</li>
                <li>Conductivity meters</li>
                <li>Magnifying glasses and microscopes</li>
                <li>Graduated cylinders and beakers</li>
                <li>Hot plates and heating equipment</li>
                <li>Safety equipment (goggles, aprons)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-purple-700">Material Samples</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Various metals (aluminum, copper, iron)</li>
                <li>Different plastics and polymers</li>
                <li>Natural materials (wood, stone, shells)</li>
                <li>Crystals and minerals collection</li>
                <li>Fabric samples with different properties</li>
                <li>Ceramic and glass materials</li>
                <li>Local Caribbean materials and minerals</li>
                <li>Everyday household materials</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-purple-700">Professional Development</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Chemistry content knowledge updates</li>
                <li>Laboratory safety protocols and training</li>
                <li>Molecular modeling software training</li>
                <li>Inquiry-based investigation techniques</li>
                <li>Assessment strategies for science learning</li>
                <li>Technology integration in chemistry</li>
                <li>Differentiated instruction methods</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge and Preparation</h3>
            <p className="text-sm mb-3">
              Teachers should develop understanding of atomic theory, molecular structure, and material properties.
              Emphasis should be placed on connecting abstract atomic concepts to observable material behaviors and
              real-world applications in Caribbean contexts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Essential Chemistry Knowledge:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Basic atomic structure and electron arrangement</li>
                  <li>Chemical bonding and molecular formation</li>
                  <li>Physical vs. chemical properties distinction</li>
                  <li>Kinetic molecular theory and phase changes</li>
                  <li>Material science and engineering applications</li>
                  <li>Laboratory safety and chemical handling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pedagogical Strategies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Concrete-to-abstract concept development</li>
                  <li>Hands-on molecular modeling techniques</li>
                  <li>Data collection and analysis skills</li>
                  <li>Safety management in laboratory settings</li>
                  <li>Technology integration for visualization</li>
                  <li>Real-world application connections</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
