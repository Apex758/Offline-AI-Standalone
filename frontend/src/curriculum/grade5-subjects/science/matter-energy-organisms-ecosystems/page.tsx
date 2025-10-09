import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ClipboardCheck, BookOpen, Users, Lightbulb, Target, Leaf } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function MatterEnergyOrganismsEcosystemsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-orange-700 flex items-center">
            <Leaf className="mr-2 h-7 w-7 text-orange-600" />
            Matter and Energy in Organisms and Ecosystems
          </h1>
          <p className="text-gray-700 text-lg">
            Investigate energy flow from the sun through ecosystems, understand food webs and chains, and explore the
            cycling of matter in Caribbean environments.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Energy Flow</Badge>
            <Badge variant="secondary">Food Webs</Badge>
            <Badge variant="secondary">Photosynthesis</Badge>
            <Badge variant="secondary">Decomposition</Badge>
            <Badge variant="secondary">Caribbean Ecosystems</Badge>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-orange-700 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Essential Learning Outcomes & Ecosystem Connections
        </h3>

        <Tabs defaultValue="energy-transfer">
          <TabsList className="grid w-full grid-cols-3 bg-orange-100">
            <TabsTrigger
              value="energy-transfer"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              Energy Transfer
            </TabsTrigger>
            <TabsTrigger value="food-webs" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              Food Webs & Chains
            </TabsTrigger>
            <TabsTrigger
              value="caribbean-focus"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              Caribbean Ecosystems
            </TabsTrigger>
          </TabsList>

          <TabsContent value="energy-transfer" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-3 text-orange-800">
              Essential Learning Outcome 1: Use models to describe that energy in animals' food was once energy from the
              sun.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Energy Transformation Process:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Solar energy → Chemical energy (photosynthesis)</li>
                  <li>Chemical energy transfer through food chains</li>
                  <li>Energy loss at each trophic level (10% rule)</li>
                  <li>Role of decomposers in energy cycling</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Student Investigations:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Track energy flow through local food chains</li>
                  <li>Model photosynthesis using aquatic plants</li>
                  <li>Investigate factors affecting plant growth</li>
                  <li>Analyze energy pyramids and biomass</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="food-webs" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-3 text-orange-800">
              Essential Learning Outcome 2: Develop models to describe the movement of matter among plants, animals,
              decomposers, and the environment.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Matter Cycling Concepts:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Carbon cycle through photosynthesis and respiration</li>
                  <li>Nitrogen cycle and soil fertility</li>
                  <li>Water cycle and ecosystem hydration</li>
                  <li>Decomposition and nutrient recycling</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Food Web Complexity:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Multiple feeding relationships in ecosystems</li>
                  <li>Predator-prey dynamics and population control</li>
                  <li>Impact of keystone species</li>
                  <li>Human effects on food web stability</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="caribbean-focus" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-3 text-orange-800">Caribbean Ecosystem Focus & Local Applications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Marine Ecosystems:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Coral reef food webs and energy flow</li>
                  <li>Mangrove nursery ecosystems</li>
                  <li>Seagrass bed productivity</li>
                  <li>Deep ocean food chains</li>
                  <li>Impact of overfishing on marine food webs</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-orange-200">
                <h5 className="font-medium text-orange-700 mb-2">Terrestrial Ecosystems:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Rainforest canopy energy capture</li>
                  <li>Dry forest adaptations</li>
                  <li>Agricultural ecosystem management</li>
                  <li>Urban ecosystem food webs</li>
                  <li>Endemic species and their roles</li>
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
              <CardDescription>Comprehensive ecosystem and energy learning expectations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-orange-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                    Energy Flow and Photosynthesis
                  </AccordionTrigger>
                  <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Students will understand:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Photosynthesis converts solar energy to chemical energy</li>
                          <li>Plants are primary producers in most ecosystems</li>
                          <li>Energy flows in one direction through food chains</li>
                          <li>Energy is lost as heat at each trophic level</li>
                          <li>Decomposers recycle nutrients but not energy</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Investigation Skills:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Design experiments to test photosynthesis factors</li>
                          <li>Measure oxygen production in aquatic plants</li>
                          <li>Create energy flow diagrams</li>
                          <li>Calculate energy transfer efficiency</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Key Vocabulary:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            photosynthesis
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            producer
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            consumer
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            trophic level
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            energy pyramid
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-orange-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                    Food Webs and Matter Cycling
                  </AccordionTrigger>
                  <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Food Web Analysis:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Construct complex food webs from local ecosystems</li>
                          <li>Identify feeding relationships and energy pathways</li>
                          <li>Predict effects of species removal or addition</li>
                          <li>Analyze population dynamics and carrying capacity</li>
                          <li>Understand omnivore roles in ecosystem stability</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Matter Cycling Processes:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Track carbon movement through ecosystems</li>
                          <li>Investigate nitrogen fixation and soil health</li>
                          <li>Model water cycle impacts on ecosystems</li>
                          <li>Study decomposer roles in nutrient cycling</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h6 className="font-medium text-xs mb-1">Primary Consumers:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Herbivores</li>
                            <li>• Filter feeders</li>
                            <li>• Grazers</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-xs mb-1">Secondary Consumers:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Carnivores</li>
                            <li>• Omnivores</li>
                            <li>• Predators</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-orange-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                    Human Impact and Conservation
                  </AccordionTrigger>
                  <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Human Effects on Ecosystems:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Habitat destruction and fragmentation</li>
                          <li>Pollution effects on food webs</li>
                          <li>Invasive species introduction</li>
                          <li>Climate change impacts on energy flow</li>
                          <li>Overharvesting and population decline</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Conservation Strategies:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Protected area establishment</li>
                          <li>Sustainable fishing and farming practices</li>
                          <li>Restoration ecology projects</li>
                          <li>Community-based conservation</li>
                          <li>Education and awareness programs</li>
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
                    <li>Ecosystem model construction and explanation</li>
                    <li>Food web mapping of local environments</li>
                    <li>Energy flow diagram creation</li>
                    <li>Field study data collection and analysis</li>
                    <li>Conservation proposal presentations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">Formative Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Daily observation journals</li>
                    <li>Peer discussions and explanations</li>
                    <li>Quick sketches of energy flow</li>
                    <li>Digital exit tickets</li>
                    <li>Concept mapping activities</li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                  <h4 className="font-semibold mb-2 text-orange-700">Authentic Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Local ecosystem health evaluation</li>
                    <li>Community garden energy analysis</li>
                    <li>Marine protected area design</li>
                    <li>School composting system setup</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Inclusive Learning Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="outdoor">
                  <AccordionTrigger>Outdoor Learning</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>School ground ecosystem surveys</li>
                      <li>Local beach or forest field trips</li>
                      <li>Community garden investigations</li>
                      <li>Bird watching and behavior studies</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="technology">
                  <AccordionTrigger>Technology Integration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Virtual ecosystem simulations</li>
                      <li>Digital food web creation tools</li>
                      <li>Time-lapse photography of decomposition</li>
                      <li>Online species identification apps</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="collaborative">
                  <AccordionTrigger>Collaborative Learning</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Ecosystem role-playing activities</li>
                      <li>Group research projects</li>
                      <li>Peer teaching of concepts</li>
                      <li>Community expert interviews</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="multilingual">
                  <AccordionTrigger>Multilingual Support</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Local language species names</li>
                      <li>Traditional ecological knowledge</li>
                      <li>Visual vocabulary cards</li>
                      <li>Bilingual field guides</li>
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
              Technology & Digital Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Simulation Software:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>EcoSim ecosystem modeling platform</li>
                  <li>Food Web Builder interactive tool</li>
                  <li>Energy Flow Simulator</li>
                  <li>Population Dynamics Modeler</li>
                  <li>Virtual Microscope for decomposers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Collection Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Digital cameras for species documentation</li>
                  <li>pH meters and water quality sensors</li>
                  <li>Light meters for photosynthesis studies</li>
                  <li>Temperature data loggers</li>
                  <li>GPS units for mapping studies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Creative Expression:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Digital storytelling about ecosystems</li>
                  <li>Animation of energy flow processes</li>
                  <li>Podcast creation about conservation</li>
                  <li>Interactive presentation tools</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-Curricular Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-blue-600">Mathematics:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Population growth calculations</li>
                  <li>Energy transfer percentages</li>
                  <li>Graphing population data</li>
                  <li>Statistical analysis of biodiversity</li>
                  <li>Geometric patterns in nature</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-600">Language Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Scientific report writing</li>
                  <li>Research skills development</li>
                  <li>Persuasive writing for conservation</li>
                  <li>Reading scientific literature</li>
                  <li>Vocabulary development</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-purple-600">Social Studies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Indigenous knowledge systems</li>
                  <li>Environmental policy analysis</li>
                  <li>Economic value of ecosystems</li>
                  <li>Cultural relationships with nature</li>
                  <li>Global environmental challenges</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-red-600">Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Nature photography and composition</li>
                  <li>Scientific illustration techniques</li>
                  <li>Environmental art projects</li>
                  <li>Music inspired by nature sounds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Resources and Community Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-orange-700">Field Study Equipment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Magnifying glasses and field microscopes</li>
                <li>Collection containers and sampling tools</li>
                <li>Field guides for local species</li>
                <li>Measuring tapes and quadrats</li>
                <li>Water testing kits</li>
                <li>Digital cameras and tablets</li>
                <li>First aid and safety equipment</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-orange-700">Community Partners</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Local environmental organizations</li>
                <li>Marine biology research stations</li>
                <li>Botanical gardens and nature centers</li>
                <li>Fishermen and farmers</li>
                <li>Park rangers and conservationists</li>
                <li>University extension programs</li>
                <li>Traditional knowledge keepers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-orange-700">Professional Development</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Outdoor education safety training</li>
                <li>Local ecosystem identification workshops</li>
                <li>Inquiry-based learning strategies</li>
                <li>Technology integration for field studies</li>
                <li>Assessment in outdoor settings</li>
                <li>Cultural sensitivity in environmental education</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Preparation and Content Knowledge</h3>
            <p className="text-sm mb-3">
              Teachers should develop familiarity with local ecosystems and species, understand energy flow principles,
              and be prepared to facilitate outdoor learning experiences safely and effectively.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Essential Ecological Knowledge:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Local species identification and ecology</li>
                  <li>Energy flow and nutrient cycling principles</li>
                  <li>Ecosystem services and human dependencies</li>
                  <li>Conservation biology fundamentals</li>
                  <li>Climate change impacts on ecosystems</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pedagogical Approaches:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Place-based education strategies</li>
                  <li>Outdoor classroom management</li>
                  <li>Student-led investigation facilitation</li>
                  <li>Community partnership development</li>
                  <li>Environmental justice integration</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
