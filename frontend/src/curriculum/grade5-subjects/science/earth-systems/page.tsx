import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ClipboardCheck, BookOpen, Users, Lightbulb, Target, Globe } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EarthSystemsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-sky-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-sky-700 flex items-center">
            <Globe className="mr-2 h-7 w-7 text-sky-600" />
            Earth Systems: Interactions and Water Distribution
          </h1>
          <p className="text-gray-700 text-lg">
            Explore the dynamic interactions between Earth's spheres, investigate water distribution patterns, and
            understand how Caribbean geography influences these systems.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Geosphere</Badge>
            <Badge variant="secondary">Hydrosphere</Badge>
            <Badge variant="secondary">Atmosphere</Badge>
            <Badge variant="secondary">Biosphere</Badge>
            <Badge variant="secondary">Water Cycle</Badge>
          </div>
        </div>
      </div>

      <div className="bg-sky-50 p-6 rounded-lg border border-sky-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-sky-700 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Essential Learning Outcomes & System Thinking
        </h3>

        <Tabs defaultValue="interactions">
          <TabsList className="grid w-full grid-cols-3 bg-sky-100">
            <TabsTrigger value="interactions" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
              Sphere Interactions
            </TabsTrigger>
            <TabsTrigger
              value="water-distribution"
              className="data-[state=active]:bg-sky-600 data-[state=active]:text-white"
            >
              Water Distribution
            </TabsTrigger>
            <TabsTrigger
              value="caribbean-systems"
              className="data-[state=active]:bg-sky-600 data-[state=active]:text-white"
            >
              Caribbean Systems
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interactions" className="p-4 border rounded-md mt-2 bg-sky-50 border-sky-200">
            <h4 className="font-semibold mb-3 text-sky-800">
              Essential Learning Outcome 1: Develop models to describe ways the geosphere, biosphere, hydrosphere, and
              atmosphere interact.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-sky-200">
                <h5 className="font-medium text-sky-700 mb-2">Earth System Interactions:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Weathering and erosion processes (geosphere ↔ atmosphere)</li>
                  <li>Ocean currents and climate regulation (hydrosphere ↔ atmosphere)</li>
                  <li>Plant root systems and soil formation (biosphere ↔ geosphere)</li>
                  <li>Evapotranspiration and precipitation (biosphere ↔ hydrosphere)</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-sky-200">
                <h5 className="font-medium text-sky-700 mb-2">System Modeling Skills:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Create diagrams showing sphere interactions</li>
                  <li>Use arrows to show energy and matter flow</li>
                  <li>Identify feedback loops in Earth systems</li>
                  <li>Predict changes when one sphere is altered</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="water-distribution" className="p-4 border rounded-md mt-2 bg-sky-50 border-sky-200">
            <h4 className="font-semibold mb-3 text-sky-800">
              Essential Learning Outcome 2: Describe and graph water distribution to provide evidence about Earth's
              water resources.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-sky-200">
                <h5 className="font-medium text-sky-700 mb-2">Water Distribution Facts:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>97.5% saltwater in oceans and seas</li>
                  <li>2.5% freshwater (mostly frozen in ice caps)</li>
                  <li>Less than 1% accessible freshwater for human use</li>
                  <li>Groundwater represents largest freshwater reservoir</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-sky-200">
                <h5 className="font-medium text-sky-700 mb-2">Data Analysis Skills:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Create pie charts of water distribution</li>
                  <li>Compare regional water availability</li>
                  <li>Analyze water quality data</li>
                  <li>Graph seasonal precipitation patterns</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="caribbean-systems" className="p-4 border rounded-md mt-2 bg-sky-50 border-sky-200">
            <h4 className="font-semibold mb-3 text-sky-800">Caribbean Earth Systems & Regional Characteristics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-sky-200">
                <h5 className="font-medium text-sky-700 mb-2">Tropical Climate Systems:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Trade wind patterns and weather</li>
                  <li>Hurricane formation and impacts</li>
                  <li>Monsoon and dry season cycles</li>
                  <li>El Niño and La Niña effects on rainfall</li>
                  <li>Coral bleaching and ocean temperature</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-sky-200">
                <h5 className="font-medium text-sky-700 mb-2">Island Geography Effects:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Orographic rainfall on mountainous islands</li>
                  <li>Coastal erosion and sediment transport</li>
                  <li>Freshwater lens formation in coral islands</li>
                  <li>Volcanic activity and landscape formation</li>
                  <li>Sea level rise impacts on low-lying areas</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-sky-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-sky-50">
              <CardTitle className="text-sky-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Detailed Curriculum Outcomes
              </CardTitle>
              <CardDescription>Comprehensive Earth systems learning expectations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-sky-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-sky-50 px-4 py-2 rounded-md">
                    Earth Sphere Interactions
                  </AccordionTrigger>
                  <AccordionContent className="bg-sky-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Students will understand:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Earth consists of four interconnected spheres</li>
                          <li>Energy and matter flow between spheres</li>
                          <li>Changes in one sphere affect others</li>
                          <li>Human activities impact all Earth systems</li>
                          <li>Feedback mechanisms maintain system balance</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Investigation Examples:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Model volcanic eruption effects on atmosphere</li>
                          <li>Investigate plant transpiration and water cycle</li>
                          <li>Study weathering of local rock samples</li>
                          <li>Observe cloud formation and precipitation</li>
                          <li>Track sediment movement in streams</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Key Vocabulary:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            geosphere
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            hydrosphere
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            atmosphere
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            biosphere
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            system
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            interaction
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-sky-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-sky-50 px-4 py-2 rounded-md">
                    Water Distribution and Availability
                  </AccordionTrigger>
                  <AccordionContent className="bg-sky-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Water Reservoir Analysis:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Quantify water in oceans, ice caps, and groundwater</li>
                          <li>Calculate percentages of saltwater vs. freshwater</li>
                          <li>Compare water availability across regions</li>
                          <li>Analyze factors affecting water quality</li>
                          <li>Investigate water conservation strategies</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Data Collection and Graphing:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Measure local precipitation and temperature</li>
                          <li>Test water samples for pH and dissolved solids</li>
                          <li>Create bar graphs and pie charts</li>
                          <li>Analyze trends in climate data</li>
                          <li>Compare water usage patterns</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h6 className="font-medium text-xs mb-1">Saltwater Sources:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Oceans (96.5%)</li>
                            <li>• Salt lakes (1%)</li>
                            <li>• Saline groundwater</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-xs mb-1">Freshwater Sources:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Ice caps and glaciers (68.7%)</li>
                            <li>• Groundwater (30.1%)</li>
                            <li>• Surface water (1.2%)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-sky-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-sky-50 px-4 py-2 rounded-md">
                    Climate and Weather Systems
                  </AccordionTrigger>
                  <AccordionContent className="bg-sky-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Weather Pattern Analysis:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Track daily weather changes and patterns</li>
                          <li>Understand pressure systems and wind patterns</li>
                          <li>Investigate cloud formation and types</li>
                          <li>Study precipitation patterns and causes</li>
                          <li>Analyze seasonal climate variations</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Caribbean Climate Features:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Trade wind influence on weather</li>
                          <li>Hurricane season patterns and preparation</li>
                          <li>Dry and wet season characteristics</li>
                          <li>Mountain effects on local climate</li>
                          <li>Ocean temperature and coral health</li>
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
          <Card className="border-t-4 border-sky-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-sky-50">
              <CardTitle className="text-sky-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sky-700">Performance-Based Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Earth system interaction models</li>
                    <li>Water cycle demonstration projects</li>
                    <li>Local weather station data analysis</li>
                    <li>Climate change impact presentations</li>
                    <li>Water conservation action plans</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sky-700">Formative Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Daily weather observation logs</li>
                    <li>Sphere interaction quick sketches</li>
                    <li>Water distribution pie chart creation</li>
                    <li>Think-pair-share discussions</li>
                    <li>Digital concept mapping</li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-100">
                  <h4 className="font-semibold mb-2 text-sky-700">Real-World Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Local watershed health evaluation</li>
                    <li>Hurricane preparedness planning</li>
                    <li>School water usage audit</li>
                    <li>Community climate adaptation strategies</li>
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
                      <li>3D Earth system models</li>
                      <li>Interactive digital globes</li>
                      <li>Infographic creation projects</li>
                      <li>Satellite imagery analysis</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hands-on">
                  <AccordionTrigger>Kinesthetic Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Physical water cycle demonstrations</li>
                      <li>Rock and mineral identification labs</li>
                      <li>Weather instrument construction</li>
                      <li>Erosion and deposition experiments</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="analytical">
                  <AccordionTrigger>Analytical Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Climate data trend analysis</li>
                      <li>Water quality testing protocols</li>
                      <li>System feedback loop modeling</li>
                      <li>Research-based investigations</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="collaborative">
                  <AccordionTrigger>Social Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Group weather monitoring projects</li>
                      <li>Community water survey teams</li>
                      <li>Peer teaching of concepts</li>
                      <li>Collaborative model building</li>
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
                  <li>Google Earth for geographic exploration</li>
                  <li>NASA Climate Kids interactive activities</li>
                  <li>NOAA Weather and Climate simulations</li>
                  <li>Water cycle animation software</li>
                  <li>Virtual field trip platforms</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Collection Technology:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Digital weather stations</li>
                  <li>pH meters and conductivity sensors</li>
                  <li>GPS units for mapping activities</li>
                  <li>Digital cameras for documentation</li>
                  <li>Tablet apps for field data collection</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Communication Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Video conferencing with meteorologists</li>
                  <li>Collaborative online whiteboards</li>
                  <li>Digital presentation platforms</li>
                  <li>Social media for weather sharing</li>
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
                  <li>Percentage calculations for water distribution</li>
                  <li>Graphing temperature and precipitation data</li>
                  <li>Scale and proportion in mapping</li>
                  <li>Statistical analysis of weather patterns</li>
                  <li>Geometric shapes in crystal formation</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-600">Language Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Weather report writing and presentation</li>
                  <li>Research skills for climate topics</li>
                  <li>Vocabulary development (meteorology terms)</li>
                  <li>Reading weather maps and symbols</li>
                  <li>Persuasive writing about conservation</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-purple-600">Social Studies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Climate impact on human settlements</li>
                  <li>Water rights and resource management</li>
                  <li>Natural disasters and community response</li>
                  <li>Cultural adaptations to climate</li>
                  <li>Economic impacts of weather events</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-red-600">Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Weather photography and composition</li>
                  <li>Cloud formation artistic interpretation</li>
                  <li>Music inspired by natural sounds</li>
                  <li>Drama depicting natural processes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Resources and Community Partnerships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-sky-700">Field Study Equipment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Weather monitoring instruments</li>
                <li>Water testing kits and pH meters</li>
                <li>Rock and mineral identification sets</li>
                <li>Magnifying glasses and hand lenses</li>
                <li>Measuring tools (rulers, scales)</li>
                <li>Collection containers and labels</li>
                <li>Digital cameras and tablets</li>
                <li>Safety equipment for outdoor work</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sky-700">Community Resources</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>National meteorological services</li>
                <li>Local water treatment facilities</li>
                <li>Environmental monitoring agencies</li>
                <li>University earth science departments</li>
                <li>Geological survey organizations</li>
                <li>Marine research institutions</li>
                <li>Emergency management offices</li>
                <li>Traditional weather knowledge keepers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sky-700">Professional Development</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Earth science content knowledge updates</li>
                <li>Weather monitoring and safety protocols</li>
                <li>Technology integration for data collection</li>
                <li>Inquiry-based investigation techniques</li>
                <li>Climate change education strategies</li>
                <li>Local environmental issue awareness</li>
                <li>Community partnership development</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge and Preparation</h3>
            <p className="text-sm mb-3">
              Teachers should develop understanding of Earth system interactions, local climate patterns, and water
              resource management. Emphasis should be placed on connecting global processes to local Caribbean
              environmental conditions and challenges.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Essential Earth Science Knowledge:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Plate tectonics and Caribbean geology</li>
                  <li>Atmospheric circulation and trade winds</li>
                  <li>Ocean currents and temperature patterns</li>
                  <li>Water cycle processes and variations</li>
                  <li>Climate vs. weather distinctions</li>
                  <li>Natural hazards and risk assessment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pedagogical Strategies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Systems thinking development</li>
                  <li>Data interpretation and graphing skills</li>
                  <li>Model construction and evaluation</li>
                  <li>Outdoor education safety management</li>
                  <li>Technology integration for monitoring</li>
                  <li>Community engagement and partnerships</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
