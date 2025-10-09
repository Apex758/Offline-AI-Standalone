import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ClipboardCheck, BookOpen, Users, Lightbulb, Target, Cog } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EngineeringDesignPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <Cog className="mr-2 h-7 w-7 text-amber-600" />
            Engineering Design Process
          </h1>
          <p className="text-gray-700 text-lg">
            Apply the engineering design process to solve real-world problems, test prototypes, and understand how
            technology impacts Caribbean communities and environments.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Design Process</Badge>
            <Badge variant="secondary">Prototyping</Badge>
            <Badge variant="secondary">Testing</Badge>
            <Badge variant="secondary">Problem Solving</Badge>
            <Badge variant="secondary">Innovation</Badge>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Essential Learning Outcomes & Design Thinking
        </h3>

        <Tabs defaultValue="design-process">
          <TabsList className="grid w-full grid-cols-3 bg-amber-100">
            <TabsTrigger
              value="design-process"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Design Process
            </TabsTrigger>
            <TabsTrigger
              value="testing-optimization"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Testing & Optimization
            </TabsTrigger>
            <TabsTrigger
              value="caribbean-solutions"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Caribbean Solutions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design-process" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-3 text-amber-800">
              Essential Learning Outcome 1: Plan and carry out fair tests to identify aspects of a model or prototype
              that can be improved.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-amber-200">
                <h5 className="font-medium text-amber-700 mb-2">Engineering Design Steps:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Define the problem and identify constraints</li>
                  <li>Research existing solutions and gather information</li>
                  <li>Brainstorm multiple solution ideas</li>
                  <li>Select the best solution and create a plan</li>
                  <li>Build and test a prototype</li>
                  <li>Evaluate results and redesign as needed</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-amber-200">
                <h5 className="font-medium text-amber-700 mb-2">Fair Testing Principles:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Control variables to ensure valid results</li>
                  <li>Use consistent measurement techniques</li>
                  <li>Conduct multiple trials for reliability</li>
                  <li>Document procedures and observations</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testing-optimization" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-3 text-amber-800">
              Essential Learning Outcome 2: Obtain and combine information about ways communities use science ideas to
              protect Earth's resources.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-amber-200">
                <h5 className="font-medium text-amber-700 mb-2">Optimization Strategies:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Identify failure points and weaknesses</li>
                  <li>Analyze data to find improvement opportunities</li>
                  <li>Consider cost, efficiency, and sustainability</li>
                  <li>Test modifications systematically</li>
                  <li>Balance competing design requirements</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-amber-200">
                <h5 className="font-medium text-amber-700 mb-2">Environmental Protection Technologies:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Renewable energy systems (solar, wind)</li>
                  <li>Water purification and conservation methods</li>
                  <li>Waste reduction and recycling technologies</li>
                  <li>Sustainable building materials and designs</li>
                  <li>Pollution monitoring and control systems</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="caribbean-solutions" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-3 text-amber-800">Caribbean Engineering Challenges & Solutions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-amber-200">
                <h5 className="font-medium text-amber-700 mb-2">Local Challenges:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Hurricane-resistant building design</li>
                  <li>Freshwater collection and storage</li>
                  <li>Coastal erosion protection</li>
                  <li>Renewable energy for islands</li>
                  <li>Sustainable tourism infrastructure</li>
                  <li>Coral reef protection systems</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-amber-200">
                <h5 className="font-medium text-amber-700 mb-2">Innovation Opportunities:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Traditional knowledge integration</li>
                  <li>Low-cost, locally-sourced materials</li>
                  <li>Climate-adapted technologies</li>
                  <li>Community-based solutions</li>
                  <li>Disaster preparedness systems</li>
                  <li>Marine conservation tools</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-amber-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Detailed Curriculum Outcomes
              </CardTitle>
              <CardDescription>Comprehensive engineering design learning expectations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                    Engineering Design Process Mastery
                  </AccordionTrigger>
                  <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Students will be able to:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Define engineering problems with clear criteria and constraints</li>
                          <li>Generate multiple solutions through brainstorming</li>
                          <li>Select optimal solutions based on evidence</li>
                          <li>Create detailed plans and prototypes</li>
                          <li>Test prototypes using fair testing principles</li>
                          <li>Analyze results and iterate designs</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Design Challenge Examples:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Build a hurricane-resistant shelter model</li>
                          <li>Design a rainwater collection system</li>
                          <li>Create a solar oven for cooking</li>
                          <li>Construct a bridge with limited materials</li>
                          <li>Develop a water filtration device</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Key Vocabulary:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            prototype
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            constraint
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            criteria
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            optimization
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            iteration
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                    Testing and Optimization Skills
                  </AccordionTrigger>
                  <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Fair Testing Procedures:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Identify and control variables in experiments</li>
                          <li>Use appropriate measurement tools and techniques</li>
                          <li>Conduct multiple trials for reliability</li>
                          <li>Record data systematically and accurately</li>
                          <li>Analyze patterns and trends in results</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Failure Analysis and Improvement:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Identify specific failure points in designs</li>
                          <li>Hypothesize causes of failure</li>
                          <li>Propose evidence-based improvements</li>
                          <li>Test modifications systematically</li>
                          <li>Document the iterative design process</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h6 className="font-medium text-xs mb-1">Testing Variables:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Strength and durability</li>
                            <li>• Efficiency and performance</li>
                            <li>• Cost and materials</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-xs mb-1">Improvement Criteria:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Function and reliability</li>
                            <li>• Safety and usability</li>
                            <li>• Environmental impact</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                    Technology and Society Connections
                  </AccordionTrigger>
                  <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Community Problem Solving:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Research local environmental and social challenges</li>
                          <li>Interview community members about needs</li>
                          <li>Investigate existing technological solutions</li>
                          <li>Propose improvements or new approaches</li>
                          <li>Consider cultural and economic factors</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Environmental Protection Technologies:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Renewable energy systems and efficiency</li>
                          <li>Water conservation and purification methods</li>
                          <li>Waste reduction and recycling innovations</li>
                          <li>Sustainable agriculture and food systems</li>
                          <li>Green building and transportation solutions</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Ethical Considerations:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Environmental impact assessment</li>
                          <li>Social equity and accessibility</li>
                          <li>Cultural sensitivity and appropriateness</li>
                          <li>Long-term sustainability</li>
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
          <Card className="border-t-4 border-amber-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-amber-700">Design Portfolio Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Engineering design process documentation</li>
                    <li>Prototype construction and testing records</li>
                    <li>Failure analysis and improvement plans</li>
                    <li>Reflection on design decisions</li>
                    <li>Peer feedback and collaboration evidence</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-amber-700">Performance-Based Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Design challenge competitions</li>
                    <li>Prototype functionality testing</li>
                    <li>Oral presentations of solutions</li>
                    <li>Problem-solving process demonstration</li>
                    <li>Community solution proposals</li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
                  <h4 className="font-semibold mb-2 text-amber-700">Authentic Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Real community problem solutions</li>
                    <li>School improvement design projects</li>
                    <li>Environmental challenge responses</li>
                    <li>Innovation fair presentations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Collaborative Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="team-roles">
                  <AccordionTrigger>Engineering Team Roles</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Project manager (coordinates team)</li>
                      <li>Designer (creates plans and sketches)</li>
                      <li>Builder (constructs prototypes)</li>
                      <li>Tester (conducts experiments)</li>
                      <li>Recorder (documents process)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="peer-review">
                  <AccordionTrigger>Peer Review Process</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Design critique sessions</li>
                      <li>Testing protocol peer review</li>
                      <li>Solution sharing and feedback</li>
                      <li>Collaborative problem-solving</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="community-engagement">
                  <AccordionTrigger>Community Engagement</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Expert interviews and consultations</li>
                      <li>Community problem identification</li>
                      <li>Solution presentation to stakeholders</li>
                      <li>Feedback incorporation from users</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="inclusive-design">
                  <AccordionTrigger>Inclusive Design Practices</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Universal design principles</li>
                      <li>Accessibility considerations</li>
                      <li>Cultural sensitivity in solutions</li>
                      <li>Multi-language documentation</li>
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
              Technology and Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Design and Modeling Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Computer-aided design (CAD) software</li>
                  <li>3D modeling and printing capabilities</li>
                  <li>Engineering drawing and sketching tools</li>
                  <li>Virtual prototyping platforms</li>
                  <li>Simulation software for testing</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Construction Materials:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Recyclable and sustainable materials</li>
                  <li>Basic construction supplies (cardboard, tape, etc.)</li>
                  <li>Electronic components and circuits</li>
                  <li>Simple machines and mechanical parts</li>
                  <li>Local and traditional materials</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Testing Equipment:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Measuring tools (rulers, scales, timers)</li>
                  <li>Force and motion sensors</li>
                  <li>Digital cameras for documentation</li>
                  <li>Data logging and analysis software</li>
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
                  <li>Measurement and calculation skills</li>
                  <li>Geometric design and spatial reasoning</li>
                  <li>Data analysis and graphing</li>
                  <li>Ratio and proportion in scaling</li>
                  <li>Cost-benefit analysis calculations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-600">Language Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Technical writing and documentation</li>
                  <li>Research and information literacy</li>
                  <li>Presentation and communication skills</li>
                  <li>Vocabulary development (engineering terms)</li>
                  <li>Persuasive writing for design proposals</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-purple-600">Social Studies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Technology's impact on society</li>
                  <li>Economic factors in design decisions</li>
                  <li>Cultural considerations in engineering</li>
                  <li>Historical development of technologies</li>
                  <li>Global challenges and solutions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-red-600">Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Aesthetic design principles</li>
                  <li>Creative problem-solving approaches</li>
                  <li>Visual communication and sketching</li>
                  <li>Innovation and artistic thinking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Resources and Industry Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-amber-700">Maker Space Equipment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Basic hand tools and safety equipment</li>
                <li>Construction materials and fasteners</li>
                <li>Electronic components and breadboards</li>
                <li>Measuring and testing instruments</li>
                <li>Computer access for design software</li>
                <li>3D printer (if available)</li>
                <li>Recyclable materials collection</li>
                <li>Documentation cameras and tablets</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-amber-700">Industry Partnerships</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Local engineering firms and consultants</li>
                <li>Construction and architecture companies</li>
                <li>Renewable energy organizations</li>
                <li>Technology and innovation hubs</li>
                <li>Manufacturing and fabrication shops</li>
                <li>Environmental consulting groups</li>
                <li>University engineering departments</li>
                <li>Government infrastructure agencies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-amber-700">Professional Development</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Engineering design process training</li>
                <li>Maker space setup and management</li>
                <li>Safety protocols for construction activities</li>
                <li>Technology integration in STEM</li>
                <li>Project-based learning facilitation</li>
                <li>Assessment of design thinking</li>
                <li>Community partnership development</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Preparation and Engineering Mindset</h3>
            <p className="text-sm mb-3">
              Teachers should develop familiarity with the engineering design process, basic construction techniques,
              and safety protocols. Emphasis should be placed on fostering creativity, persistence, and systematic
              problem-solving approaches.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Essential Engineering Knowledge:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Design thinking and iterative processes</li>
                  <li>Basic principles of structures and materials</li>
                  <li>Simple machines and mechanical advantage</li>
                  <li>Electrical circuits and energy systems</li>
                  <li>Safety protocols and risk assessment</li>
                  <li>Sustainability and environmental impact</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Facilitation Strategies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Encouraging creative problem-solving</li>
                  <li>Managing open-ended design challenges</li>
                  <li>Facilitating productive failure and learning</li>
                  <li>Supporting collaborative team dynamics</li>
                  <li>Connecting learning to real-world applications</li>
                  <li>Integrating community voices and needs</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
