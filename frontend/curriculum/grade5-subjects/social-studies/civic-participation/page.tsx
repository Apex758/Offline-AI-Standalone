import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Users, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CivicParticipationPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <Users className="mr-2 h-7 w-7 text-blue-600" />
            Civic Participation
          </h1>
          <p className="text-gray-700">
            This strand examines government systems across the Caribbean region, explores regional integration through
            organizations like CARICOM and OECS, and develops students' understanding of democratic participation and
            citizenship responsibilities within the broader Caribbean context.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Civic Participation
        </h3>

        <Tabs defaultValue="government">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100">
            <TabsTrigger value="government" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Government Systems
            </TabsTrigger>
            <TabsTrigger value="integration" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Regional Integration
            </TabsTrigger>
            <TabsTrigger
              value="participation"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Democratic Participation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="government" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Caribbean Government Systems</h4>
            <p className="mb-3">
              To understand the various government systems across the Caribbean and how they serve their citizens.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Compare different government systems in the Caribbean region</li>
              <li>Identify independent countries vs dependent territories</li>
              <li>Understand the role of constitutional monarchies and republics</li>
              <li>Explore the relationship between former colonies and metropolitan powers</li>
              <li>Analyze how government systems affect citizens' rights and freedoms</li>
              <li>Examine the role of governors, prime ministers, and presidents</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Questions:</h5>
              <p>What different types of government systems exist in the Caribbean?</p>
              <p>How do independent countries differ from dependent territories?</p>
              <p>What are the advantages and disadvantages of different government systems?</p>
              <p>How do government systems affect people's daily lives?</p>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Regional Integration Organizations</h4>
            <p className="mb-3">
              To understand how Caribbean countries work together through regional organizations like CARICOM and OECS.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the purpose and functions of CARICOM</li>
              <li>Understand the role of the OECS in Eastern Caribbean integration</li>
              <li>Explore other regional organizations and their contributions</li>
              <li>Analyze the benefits of regional cooperation</li>
              <li>Understand the Caribbean Single Market and Economy (CSME)</li>
              <li>Examine challenges facing regional integration</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Questions:</h5>
              <p>What is CARICOM and why was it created?</p>
              <p>How does the OECS help Eastern Caribbean countries?</p>
              <p>What are the benefits of Caribbean countries working together?</p>
              <p>What challenges do regional organizations face?</p>
            </div>
          </TabsContent>

          <TabsContent value="participation" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Democratic Participation and Citizenship</h4>
            <p className="mb-3">
              To develop understanding of democratic processes and civic responsibilities within the Caribbean context.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Understand the principles of democracy and good governance</li>
              <li>Explore voting systems and electoral processes</li>
              <li>Identify ways citizens can participate in democracy</li>
              <li>Understand the importance of civic engagement</li>
              <li>Explore youth participation in democratic processes</li>
              <li>Analyze the role of civil society organizations</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Questions:</h5>
              <p>What makes a government democratic?</p>
              <p>How can young people participate in democracy?</p>
              <p>What responsibilities do citizens have in a democracy?</p>
              <p>How can citizens hold their governments accountable?</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Caribbean Government Systems
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Compare different government systems across the Caribbean region
                    </li>
                    <li>
                      <strong>Skills:</strong> Create comparative charts of government structures
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the diversity of governance approaches in the region
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  CARICOM Understanding
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify the purpose and functions of CARICOM
                    </li>
                    <li>
                      <strong>Skills:</strong> Research and present on CARICOM initiatives
                    </li>
                    <li>
                      <strong>Values:</strong> Value the importance of regional cooperation and unity
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">OECS Integration</AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Understand the role of OECS in Eastern Caribbean integration
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze benefits of regional integration
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate shared identity and common goals among OECS states
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Democratic Participation
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Understand democratic principles and processes
                    </li>
                    <li>
                      <strong>Skills:</strong> Demonstrate civic engagement through simulations
                    </li>
                    <li>
                      <strong>Values:</strong> Value democratic participation and civic responsibility
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Youth Civic Engagement
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify ways young people can participate in democracy
                    </li>
                    <li>
                      <strong>Skills:</strong> Plan and implement civic engagement projects
                    </li>
                    <li>
                      <strong>Values:</strong> Embrace responsibility as future citizens and leaders
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-indigo-700">Observations:</strong> Monitor participation in mock elections,
                  debates, and civic simulations
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Civic discussions, government system
                  comparisons, regional integration debates
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Government comparison charts, CARICOM research
                  projects, civic action plans, democracy portfolios
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Civic knowledge assessment rubrics</li>
                  <li>Participation checklists for democratic simulations</li>
                  <li>Research project evaluation criteria</li>
                  <li>Peer assessment for collaborative activities</li>
                  <li>Self-reflection journals on civic learning</li>
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
                  <AccordionTrigger>Government Systems Exploration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Government Comparison:</strong> Students create charts comparing Caribbean government
                        systems
                      </li>
                      <li>
                        <strong>Virtual Embassy Visits:</strong> Students explore government websites and virtual tours
                      </li>
                      <li>
                        <strong>Leader Profiles:</strong> Students research current Caribbean leaders and their roles
                      </li>
                      <li>
                        <strong>Constitutional Analysis:</strong> Students examine key features of different
                        constitutions
                      </li>
                      <li>
                        <strong>Government Simulations:</strong> Students role-play different government structures
                      </li>
                      <li>
                        <strong>News Analysis:</strong> Students analyze current events affecting Caribbean governments
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Regional Integration Studies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>CARICOM Timeline:</strong> Students create timelines of CARICOM development
                      </li>
                      <li>
                        <strong>Integration Benefits Map:</strong> Students map benefits of regional cooperation
                      </li>
                      <li>
                        <strong>OECS Research Projects:</strong> Students investigate OECS member countries and shared
                        initiatives
                      </li>
                      <li>
                        <strong>Regional Organization Fair:</strong> Students create displays about different Caribbean
                        organizations
                      </li>
                      <li>
                        <strong>Trade Agreement Analysis:</strong> Students examine regional trade relationships
                      </li>
                      <li>
                        <strong>Unity Celebrations:</strong> Students plan events celebrating Caribbean unity
                      </li>
                      <li>
                        <strong>Challenge Solutions:</strong> Students propose solutions to regional integration
                        challenges
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Democratic Participation Activities</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Mock Elections:</strong> Students organize and participate in classroom elections
                      </li>
                      <li>
                        <strong>Youth Parliament:</strong> Students simulate parliamentary debates and procedures
                      </li>
                      <li>
                        <strong>Civic Action Projects:</strong> Students plan community service initiatives
                      </li>
                      <li>
                        <strong>Voting System Comparison:</strong> Students compare electoral systems across the
                        Caribbean
                      </li>
                      <li>
                        <strong>Citizen Rights Charter:</strong> Students create charters of citizen rights and
                        responsibilities
                      </li>
                      <li>
                        <strong>Democracy Timeline:</strong> Students trace the development of democracy in the
                        Caribbean
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
              <h3 className="font-semibold mb-2">Digital Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>CARICOM official website and resources</li>
                <li>OECS educational materials and publications</li>
                <li>Caribbean government websites and virtual tours</li>
                <li>Democracy education videos and simulations</li>
                <li>Regional integration documentaries</li>
                <li>Civic education online games and activities</li>
                <li>Caribbean political history databases</li>
                <li>Youth civic engagement platforms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Caribbean flags and national symbols</li>
                <li>Government structure charts and diagrams</li>
                <li>Mock election materials (ballots, boxes)</li>
                <li>Regional maps and atlases</li>
                <li>Civic education books and pamphlets</li>
                <li>Parliamentary procedure guides</li>
                <li>Constitution copies from different countries</li>
                <li>Presentation materials for student projects</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Caribbean government systems vary significantly across the region. Independent countries like Jamaica and
              Trinidad operate as constitutional monarchies or republics, while territories like the British Virgin
              Islands remain dependent on metropolitan powers. Understanding these differences helps students appreciate
              the complexity of Caribbean political development.
            </p>
            <p className="mb-2">
              CARICOM (Caribbean Community) was established in 1973 to promote economic integration and cooperation
              among Caribbean countries. It includes 15 member states and 5 associate members, working toward goals like
              the Caribbean Single Market and Economy (CSME). The organization addresses challenges in trade, education,
              health, and disaster management.
            </p>
            <p className="mb-2">
              The OECS (Organisation of Eastern Caribbean States) was formed in 1981 to promote unity and solidarity
              among Eastern Caribbean countries. It includes both independent countries and British territories, sharing
              a common currency (Eastern Caribbean Dollar) and coordinating policies in areas like education, health,
              and foreign affairs.
            </p>
            <p>
              Democratic participation in the Caribbean involves understanding Westminster-style parliamentary systems,
              proportional representation, and the role of civil society. Youth engagement is crucial for the region's
              democratic future, with opportunities for participation through student councils, youth parliaments, and
              community organizations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
