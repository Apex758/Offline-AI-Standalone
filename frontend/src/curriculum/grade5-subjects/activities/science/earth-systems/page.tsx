import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronLeft, Globe, Clock, Users, Target, CheckCircle } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EarthSystemsActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects/activities/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Science Activities
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-sky-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-sky-700 flex items-center">
            <Globe className="mr-2 h-7 w-7 text-sky-600" />
            Earth Systems Activities
          </h1>
          <p className="text-gray-700 text-lg">
            Investigate sphere interactions, water distribution, and environmental solutions through hands-on Earth
            science explorations.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Sphere Interactions</Badge>
            <Badge variant="secondary">Water Cycle</Badge>
            <Badge variant="secondary">Environmental Solutions</Badge>
            <Badge variant="secondary">Systems Thinking</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="activity1" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 bg-sky-100">
          <TabsTrigger value="activity1" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            Activity 3.1
          </TabsTrigger>
          <TabsTrigger value="activity2" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            Activity 3.2
          </TabsTrigger>
          <TabsTrigger value="activity3" className="data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            Activity 3.3
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity1" className="mt-6">
          <Card className="border-t-4 border-sky-500">
            <CardHeader className="bg-sky-50">
              <CardTitle className="text-sky-700 flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Activity 3.1: Sphere Interaction Detective Work
              </CardTitle>
              <CardDescription>
                Students investigate how natural events demonstrate interactions between Earth's four spheres
              </CardDescription>
              <div className="flex gap-4 mt-2">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  2-3 class periods
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  Groups of 4-5
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Target className="mr-1 h-3 w-3" />
                  Sphere Interactions
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="overview">
                  <AccordionTrigger>Activity Overview & Learning Objectives</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Learning Objectives:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Identify Earth's four spheres: atmosphere, hydrosphere, geosphere, biosphere</li>
                          <li>Analyze how natural events affect multiple spheres simultaneously</li>
                          <li>Trace cause-and-effect relationships between sphere interactions</li>
                          <li>Use evidence from real events to support scientific explanations</li>
                          <li>Communicate findings through detective-style presentations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Caribbean Natural Events Focus:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Hurricanes and tropical storms</li>
                          <li>Volcanic activity (where applicable)</li>
                          <li>Coral bleaching events</li>
                          <li>Drought and flooding cycles</li>
                          <li>Coastal erosion and sedimentation</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="materials">
                  <AccordionTrigger>Materials & Case Files</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Research Materials:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>News articles about natural events</li>
                          <li>Scientific reports and data</li>
                          <li>Satellite images and photographs</li>
                          <li>Weather data and maps</li>
                          <li>Internet access for research</li>
                          <li>Local newspaper archives</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Presentation Supplies:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Large poster paper</li>
                          <li>Colored markers and pens</li>
                          <li>String or yarn for connections</li>
                          <li>Index cards for evidence</li>
                          <li>Magnifying glasses (props)</li>
                          <li>Detective badges or hats</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Sample Case Files:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                          <strong>Hurricane Maria (2017):</strong> Impacts across all Caribbean spheres
                        </li>
                        <li>
                          <strong>Soufrière Hills Volcano:</strong> Montserrat's ongoing volcanic activity
                        </li>
                        <li>
                          <strong>Sargassum Blooms:</strong> Massive seaweed events affecting coastlines
                        </li>
                        <li>
                          <strong>Caribbean Drought (2015):</strong> Regional water crisis impacts
                        </li>
                        <li>
                          <strong>Coral Bleaching Events:</strong> Climate change effects on reef systems
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="procedure">
                  <AccordionTrigger>Detective Investigation Procedure</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            1
                          </span>
                          Case Assignment (15 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Each group receives a natural event case file</li>
                          <li>Review initial evidence: photos, news headlines, basic facts</li>
                          <li>
                            Assign detective roles: Lead Investigator, Evidence Collector, Sphere Specialist, Reporter
                          </li>
                          <li>Establish investigation timeline and goals</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            2
                          </span>
                          Evidence Gathering (60 minutes)
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium">Research Phase:</h5>
                            <ul className="list-disc pl-8 space-y-1 text-sm">
                              <li>Find primary sources (news articles, scientific reports)</li>
                              <li>Document impacts on atmosphere (air quality, weather changes)</li>
                              <li>Record hydrosphere effects (water contamination, flooding, drought)</li>
                              <li>Identify geosphere impacts (land changes, erosion, volcanic activity)</li>
                              <li>Note biosphere consequences (wildlife, vegetation, human communities)</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium">Evidence Organization:</h5>
                            <ul className="list-disc pl-8 space-y-1 text-sm">
                              <li>Create timeline of sphere interactions</li>
                              <li>Collect "witness statements" from affected communities</li>
                              <li>Gather photographic evidence of changes</li>
                              <li>Document scientific measurements and data</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            3
                          </span>
                          Detective Report Creation (45 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Create crime-scene style poster showing sphere connections</li>
                          <li>Use string to connect sphere impacts visually</li>
                          <li>Include "evidence photos" and data charts</li>
                          <li>Write case summary with key findings</li>
                          <li>Prepare "witness statements" from affected communities</li>
                          <li>Develop conclusions about sphere interdependence</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            4
                          </span>
                          Case Presentation (30 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Present findings as detective briefings</li>
                          <li>Audience asks investigative questions</li>
                          <li>Vote on most compelling evidence for sphere interactions</li>
                          <li>Discuss common patterns across different events</li>
                          <li>Connect to local environmental concerns</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="assessment">
                  <AccordionTrigger>Assessment & Extensions</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Detective Report Rubric:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-1">Evidence Quality (50%):</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                              <li>Accurate sphere identification</li>
                              <li>Multiple reliable sources</li>
                              <li>Clear cause-effect relationships</li>
                              <li>Comprehensive impact documentation</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium mb-1">Communication (50%):</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                              <li>Clear visual presentation</li>
                              <li>Engaging detective narrative</li>
                              <li>Scientific vocabulary use</li>
                              <li>Effective teamwork</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Extension Activities:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Create a "Cold Case Files" series for historical events</li>
                          <li>Investigate local environmental changes over time</li>
                          <li>Design early warning systems for natural disasters</li>
                          <li>Interview community members about past events</li>
                          <li>Create educational materials for younger students</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Real-World Applications:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Emergency preparedness planning</li>
                          <li>Environmental impact assessments</li>
                          <li>Climate change adaptation strategies</li>
                          <li>Disaster response coordination</li>
                          <li>Community resilience building</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity2" className="mt-6">
          <Card className="border-t-4 border-sky-500">
            <CardHeader className="bg-sky-50">
              <CardTitle className="text-sky-700 flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Activity 3.2: Water Distribution Simulation
              </CardTitle>
              <CardDescription>
                Students model global water distribution to understand freshwater scarcity and conservation needs
              </CardDescription>
              <div className="flex gap-4 mt-2">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />2 class periods
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  Groups of 3-4
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Target className="mr-1 h-3 w-3" />
                  Water Conservation
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="overview">
                  <AccordionTrigger>Activity Overview & Learning Objectives</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Learning Objectives:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Understand the distribution of Earth's water resources</li>
                          <li>Calculate personal and community water usage</li>
                          <li>Analyze water scarcity challenges globally and locally</li>
                          <li>Design practical water conservation strategies</li>
                          <li>Connect water availability to environmental and social issues</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Caribbean Water Context:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Island water security challenges</li>
                          <li>Rainwater harvesting traditions</li>
                          <li>Desalination technology impacts</li>
                          <li>Tourism effects on water resources</li>
                          <li>Climate change and water availability</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="materials">
                  <AccordionTrigger>Materials & Setup</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Water Simulation Materials:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>1000 mL graduated cylinder</li>
                          <li>Blue food coloring</li>
                          <li>Smaller measuring containers (100mL, 50mL, 10mL)</li>
                          <li>Clear containers for separated water</li>
                          <li>Labels for different water types</li>
                          <li>Calculators</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Data Collection Tools:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Water usage tracking sheets</li>
                          <li>Calculators for consumption analysis</li>
                          <li>Graph paper for data visualization</li>
                          <li>Research materials on local water systems</li>
                          <li>Design materials for conservation devices</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Water Distribution Facts:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                          <strong>Total water:</strong> 1000 mL (100%)
                        </li>
                        <li>
                          <strong>Saltwater (oceans):</strong> 970 mL (97%)
                        </li>
                        <li>
                          <strong>Freshwater total:</strong> 30 mL (3%)
                        </li>
                        <li>
                          <strong>Ice caps/glaciers:</strong> 22 mL (2.2%)
                        </li>
                        <li>
                          <strong>Groundwater:</strong> 7.5 mL (0.75%)
                        </li>
                        <li>
                          <strong>Available freshwater:</strong> 0.5 mL (0.05%)
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="procedure">
                  <AccordionTrigger>Simulation Procedure</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            1
                          </span>
                          Global Water Setup (15 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Fill large container with 1000 mL blue water (representing all Earth's water)</li>
                          <li>Students predict how much is freshwater vs. saltwater</li>
                          <li>Record predictions and reasoning</li>
                          <li>Discuss where students think most water is located</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            2
                          </span>
                          Salt Water Separation (10 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Remove 970 mL for saltwater (oceans)</li>
                          <li>Label container "Saltwater - Not drinkable"</li>
                          <li>Discuss student predictions vs. reality</li>
                          <li>Note how little water remains (only 30 mL)</li>
                          <li>Connect to ocean surrounding Caribbean islands</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            3
                          </span>
                          Fresh Water Division (20 minutes)
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium">Sequential Separation:</h5>
                            <ul className="list-disc pl-8 space-y-1 text-sm">
                              <li>From remaining 30 mL, remove 22 mL for ice caps/glaciers</li>
                              <li>Label "Frozen freshwater - Not accessible"</li>
                              <li>Remove 7.5 mL for groundwater</li>
                              <li>Label "Groundwater - Difficult to access"</li>
                              <li>Remaining 0.5 mL represents available freshwater</li>
                              <li>Label "Available freshwater - For all life on Earth"</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium">Reality Check:</h5>
                            <ul className="list-disc pl-8 space-y-1 text-sm">
                              <li>Show students the tiny amount of available water</li>
                              <li>Discuss how this must serve all humans, animals, and plants</li>
                              <li>Connect to local water challenges in Caribbean</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            4
                          </span>
                          Personal Usage Calculation (30 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Calculate each student's daily water usage</li>
                          <li>Include drinking, bathing, cooking, cleaning</li>
                          <li>Compare to available freshwater per person globally</li>
                          <li>Research water usage in different countries</li>
                          <li>Identify areas for personal conservation</li>
                          <li>Create conservation action plans</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            5
                          </span>
                          Design Challenge (45 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Design water conservation devices for school</li>
                          <li>Calculate potential water savings</li>
                          <li>Research rainwater harvesting systems</li>
                          <li>Design greywater recycling systems</li>
                          <li>Create water-efficient garden designs</li>
                          <li>Present solutions to school administration</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="assessment">
                  <AccordionTrigger>Assessment & Action Planning</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Assessment Components:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-medium mb-1">Understanding (40%):</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                              <li>Water distribution comprehension</li>
                              <li>Scarcity concept grasp</li>
                              <li>Local context connections</li>
                              <li>Mathematical calculations</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium mb-1">Analysis (30%):</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                              <li>Usage pattern identification</li>
                              <li>Conservation opportunity recognition</li>
                              <li>Global comparison insights</li>
                              <li>Problem-solution thinking</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium mb-1">Action Planning (30%):</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                              <li>Practical conservation strategies</li>
                              <li>Design innovation</li>
                              <li>Implementation feasibility</li>
                              <li>Community engagement</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Caribbean-Specific Extensions:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Research traditional rainwater harvesting methods</li>
                          <li>Investigate desalination technology and costs</li>
                          <li>Study hurricane impacts on water infrastructure</li>
                          <li>Design drought-resistant landscaping</li>
                          <li>Explore water tourism impacts and solutions</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Community Action Projects:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>School water audit and conservation plan</li>
                          <li>Community education campaign</li>
                          <li>Rain barrel installation project</li>
                          <li>Native plant garden for water conservation</li>
                          <li>Partnership with local water authority</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Technology Integration:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Water usage tracking apps</li>
                          <li>Smart irrigation system designs</li>
                          <li>Data visualization of consumption patterns</li>
                          <li>Virtual field trips to water treatment plants</li>
                          <li>Online collaboration with global classrooms</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity3" className="mt-6">
          <Card className="border-t-4 border-sky-500">
            <CardHeader className="bg-sky-50">
              <CardTitle className="text-sky-700 flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Activity 3.3: Pollution Solution Engineering
              </CardTitle>
              <CardDescription>
                Students design and test water treatment systems to address pollution challenges
              </CardDescription>
              <div className="flex gap-4 mt-2">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  4-5 class periods
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  Teams of 4-5
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Target className="mr-1 h-3 w-3" />
                  Water Treatment
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="overview">
                  <AccordionTrigger>Activity Overview & Learning Objectives</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Learning Objectives:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Design multi-stage water filtration systems</li>
                          <li>Test effectiveness of different treatment methods</li>
                          <li>Understand biological and chemical water treatment processes</li>
                          <li>Apply engineering design process to environmental problems</li>
                          <li>Connect local water quality issues to global challenges</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Caribbean Water Quality Issues:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Agricultural runoff and pesticide contamination</li>
                          <li>Coastal pollution from tourism and development</li>
                          <li>Sewage treatment challenges</li>
                          <li>Industrial pollution in port areas</li>
                          <li>Plastic waste in marine environments</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="materials">
                  <AccordionTrigger>Materials & Pollution Samples</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Pollution Creation Materials:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Cooking oil (for oil spills)</li>
                          <li>Soil and sand (for sediment pollution)</li>
                          <li>Food coloring (for chemical contamination)</li>
                          <li>Liquid soap (for detergent pollution)</li>
                          <li>Coffee grounds (for organic matter)</li>
                          <li>Small plastic pieces (for microplastic simulation)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Filtration Materials:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Sand (fine and coarse)</li>
                          <li>Gravel and small stones</li>
                          <li>Activated charcoal</li>
                          <li>Cotton balls and cloth</li>
                          <li>Coffee filters</li>
                          <li>Plastic bottles (various sizes)</li>
                          <li>Funnels and tubing</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Testing Equipment:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>pH test strips</li>
                          <li>Turbidity measurement tools</li>
                          <li>Microscopes for water quality analysis</li>
                          <li>Measuring cylinders</li>
                          <li>Timers for treatment duration</li>
                          <li>Digital cameras for documentation</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Biological Treatment:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Beneficial bacteria cultures (if available)</li>
                          <li>Aquatic plants for phytoremediation</li>
                          <li>Algae samples</li>
                          <li>Compost for biological filtration</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="procedure">
                  <AccordionTrigger>Engineering Design Process</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            1
                          </span>
                          Pollution Creation (30 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Create different types of "polluted" water samples</li>
                          <li>Add oil, dirt, food coloring, soap to separate containers</li>
                          <li>Test initial pH and turbidity</li>
                          <li>Document starting conditions with photos</li>
                          <li>Discuss real-world sources of each pollution type</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            2
                          </span>
                          Filter Design Challenge (60 minutes)
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium">Design Phase:</h5>
                            <ul className="list-disc pl-8 space-y-1 text-sm">
                              <li>Teams design multi-stage filtration systems</li>
                              <li>Plan different materials for each pollution type</li>
                              <li>Consider physical, chemical, and biological treatment</li>
                              <li>Create technical drawings of filter designs</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium">Construction Phase:</h5>
                            <ul className="list-disc pl-8 space-y-1 text-sm">
                              <li>Build filters using plastic bottles and chosen materials</li>
                              <li>Test different materials (sand, gravel, cloth, charcoal)</li>
                              <li>Create multiple stages for comprehensive treatment</li>
                              <li>Measure effectiveness at each stage</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            3
                          </span>
                          Biological Treatment (45 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Introduce beneficial bacteria cultures (if available)</li>
                          <li>Test aquatic plants for phytoremediation</li>
                          <li>Monitor decomposition processes</li>
                          <li>Test water quality improvements over time</li>
                          <li>Compare biological vs. physical treatment effectiveness</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            4
                          </span>
                          Community Solution Design (60 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Research local water quality issues</li>
                          <li>Design scaled-up treatment solutions</li>
                          <li>Consider cost, maintenance, and sustainability</li>
                          <li>Create proposals for community implementation</li>
                          <li>Present to local water authority (if possible)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <span className="bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                            5
                          </span>
                          Public Awareness Campaign (45 minutes)
                        </h4>
                        <ul className="list-disc pl-8 space-y-1 text-sm">
                          <li>Create pollution prevention materials</li>
                          <li>Design community education programs</li>
                          <li>Develop social media campaigns</li>
                          <li>Create demonstration videos</li>
                          <li>Plan school-wide awareness events</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="assessment">
                  <AccordionTrigger>Assessment & Real-World Impact</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Engineering Portfolio Assessment:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-1">Design Process (50%):</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                              <li>Systematic design approach</li>
                              <li>Multiple solution testing</li>
                              <li>Data-driven improvements</li>
                              <li>Technical documentation</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium mb-1">Solution Effectiveness (50%):</h5>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                              <li>Water quality improvement</li>
                              <li>Treatment efficiency</li>
                              <li>Practical implementation potential</li>
                              <li>Community engagement quality</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Real-World Connections:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Partner with local environmental organizations</li>
                          <li>Visit water treatment facilities</li>
                          <li>Interview environmental engineers</li>
                          <li>Participate in beach or river cleanups</li>
                          <li>Monitor local water quality over time</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Caribbean-Specific Applications:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Design solutions for hurricane-damaged water systems</li>
                          <li>Address coral reef protection through water quality</li>
                          <li>Create tourism-friendly pollution prevention</li>
                          <li>Develop low-cost solutions for rural communities</li>
                          <li>Design systems resilient to climate change</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Extension Challenges:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Design solar-powered water treatment systems</li>
                          <li>Create mobile treatment units for emergencies</li>
                          <li>Develop biological treatment using local organisms</li>
                          <li>Design systems for specific local pollutants</li>
                          <li>Create cost-benefit analyses for different solutions</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            Implementation Support & Safety
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-sky-700">Water Safety Protocols</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Use only safe, non-toxic materials for pollution simulation</li>
                <li>Ensure proper ventilation when using any chemicals</li>
                <li>Have spill cleanup materials readily available</li>
                <li>Supervise all water handling activities</li>
                <li>Provide aprons or old clothes for messy activities</li>
                <li>Establish clear cleanup procedures</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sky-700">Community Partnerships</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Contact local water authority for expert visits</li>
                <li>Arrange field trips to treatment facilities</li>
                <li>Partner with environmental organizations</li>
                <li>Invite community members to share experiences</li>
                <li>Connect with regional water management agencies</li>
                <li>Collaborate with other schools on water projects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sky-700">Assessment Strategies</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Use photo documentation for process assessment</li>
                <li>Create peer evaluation rubrics</li>
                <li>Develop self-reflection questionnaires</li>
                <li>Use before/after water quality comparisons</li>
                <li>Include community feedback in evaluations</li>
                <li>Document learning through video portfolios</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
