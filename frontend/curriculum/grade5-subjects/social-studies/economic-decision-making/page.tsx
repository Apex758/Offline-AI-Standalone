import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, DollarSign, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EconomicDecisionMakingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <DollarSign className="mr-2 h-7 w-7 text-green-600" />
            Economic Decision Making
          </h1>
          <p className="text-gray-700">
            This strand examines trade relationships within the Caribbean and with external partners, analyzes changes
            in agriculture since 1900, explores transportation and communication networks, and investigates the movement
            of people, goods, and services throughout the region.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Economic Decision Making
        </h3>

        <Tabs defaultValue="trade">
          <TabsList className="grid w-full grid-cols-4 bg-green-100">
            <TabsTrigger value="trade" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Trade Relationships
            </TabsTrigger>
            <TabsTrigger
              value="agriculture"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Agricultural Changes
            </TabsTrigger>
            <TabsTrigger value="networks" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Transport & Communication
            </TabsTrigger>
            <TabsTrigger value="movement" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Movement of Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trade" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Caribbean Trade Relationships</h4>
            <p className="mb-3">
              To understand how the Caribbean trades with regional and international partners and the impact of these
              relationships.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify major trading partners of Caribbean countries</li>
              <li>Understand the concept of imports and exports</li>
              <li>Explore regional trade through CARICOM and other agreements</li>
              <li>Analyze the benefits and challenges of international trade</li>
              <li>Understand the role of ports and trade infrastructure</li>
              <li>Examine how trade affects local economies and employment</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>Who are the Caribbean's main trading partners?</p>
              <p>What products does the Caribbean export and import?</p>
              <p>How does regional trade benefit Caribbean countries?</p>
              <p>What challenges do small island economies face in international trade?</p>
            </div>
          </TabsContent>

          <TabsContent value="agriculture" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Agricultural Transformation Since 1900</h4>
            <p className="mb-3">
              To analyze how Caribbean agriculture has changed over the past century and its economic implications.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Compare agricultural practices from 1900 to present</li>
              <li>Understand the decline of sugar plantations</li>
              <li>Explore diversification into new crops and farming methods</li>
              <li>Analyze the impact of technology on agriculture</li>
              <li>Understand challenges facing modern Caribbean farmers</li>
              <li>Explore sustainable agriculture and food security</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>How has Caribbean agriculture changed since 1900?</p>
              <p>Why did sugar production decline in many Caribbean countries?</p>
              <p>What new crops and farming methods have been introduced?</p>
              <p>How can the Caribbean achieve food security?</p>
            </div>
          </TabsContent>

          <TabsContent value="networks" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome: Transportation and Communication Networks
            </h4>
            <p className="mb-3">
              To understand how transportation and communication systems connect Caribbean countries and facilitate
              economic activity.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Map major transportation routes in the Caribbean</li>
              <li>Understand the importance of airports and seaports</li>
              <li>Explore inter-island transportation challenges</li>
              <li>Analyze communication networks and digital connectivity</li>
              <li>Understand how infrastructure affects economic development</li>
              <li>Explore the role of tourism in transportation development</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>How are Caribbean islands connected by transportation?</p>
              <p>What challenges exist in inter-island travel and shipping?</p>
              <p>How do communication networks support Caribbean economies?</p>
              <p>What role does infrastructure play in economic development?</p>
            </div>
          </TabsContent>

          <TabsContent value="movement" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Movement of People, Goods, and Services</h4>
            <p className="mb-3">
              To analyze how people, goods, and services move within and beyond the Caribbean region.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Understand migration patterns within the Caribbean</li>
              <li>Explore the Caribbean diaspora and remittances</li>
              <li>Analyze the flow of goods between islands</li>
              <li>Understand the service economy and tourism</li>
              <li>Explore labor mobility and regional employment</li>
              <li>Understand the impact of globalization on the Caribbean</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>Why do people migrate within and from the Caribbean?</p>
              <p>How do remittances affect Caribbean economies?</p>
              <p>What goods and services move between Caribbean countries?</p>
              <p>How has globalization affected the Caribbean?</p>
            </div>
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
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Trade Relationships Analysis
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify major trading partners and trade relationships of Caribbean
                      countries
                    </li>
                    <li>
                      <strong>Skills:</strong> Create trade flow maps and analyze import/export data
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the importance of fair trade and economic cooperation
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Agricultural Transformation
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Analyze changes in Caribbean agriculture since 1900
                    </li>
                    <li>
                      <strong>Skills:</strong> Compare historical and modern farming practices
                    </li>
                    <li>
                      <strong>Values:</strong> Value sustainable agriculture and food security
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Transportation Networks
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Understand transportation and communication networks in the Caribbean
                    </li>
                    <li>
                      <strong>Skills:</strong> Map transportation routes and analyze connectivity
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the importance of infrastructure for development
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Movement of Resources
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Analyze movement of people, goods, and services in the Caribbean
                    </li>
                    <li>
                      <strong>Skills:</strong> Research migration patterns and economic flows
                    </li>
                    <li>
                      <strong>Values:</strong> Understand the benefits and challenges of globalization
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Economic Development
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Understand factors affecting Caribbean economic development
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze economic data and development indicators
                    </li>
                    <li>
                      <strong>Values:</strong> Value sustainable and inclusive economic growth
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-emerald-700">Observations:</strong> Monitor economic analysis skills, data
                  interpretation, and collaborative research
                </li>
                <li>
                  <strong className="text-emerald-700">Conversations:</strong> Economic discussions, trade debates,
                  agricultural interviews, development planning
                </li>
                <li>
                  <strong className="text-emerald-700">Products:</strong> Trade maps, agricultural timelines, economic
                  reports, development proposals, business plans
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                <h4 className="font-semibold mb-2 text-emerald-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Economic analysis rubrics</li>
                  <li>Data interpretation checklists</li>
                  <li>Research project evaluation guides</li>
                  <li>Presentation assessment criteria</li>
                  <li>Problem-solving skill assessments</li>
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
                  <AccordionTrigger>Trade Relationship Studies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Trade Flow Mapping:</strong> Students create visual maps of Caribbean trade
                        relationships
                      </li>
                      <li>
                        <strong>Import/Export Analysis:</strong> Students research and compare trade data
                      </li>
                      <li>
                        <strong>Port Investigations:</strong> Students study major Caribbean ports and their functions
                      </li>
                      <li>
                        <strong>Trade Agreement Research:</strong> Students examine regional and international trade
                        deals
                      </li>
                      <li>
                        <strong>Business Simulations:</strong> Students simulate international trade negotiations
                      </li>
                      <li>
                        <strong>Economic Impact Studies:</strong> Students analyze how trade affects local communities
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Agricultural Transformation Analysis</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Then and Now Comparisons:</strong> Students compare 1900s agriculture with today
                      </li>
                      <li>
                        <strong>Crop Diversification Studies:</strong> Students research new crops and farming methods
                      </li>
                      <li>
                        <strong>Farmer Interviews:</strong> Students interview local farmers about changes
                      </li>
                      <li>
                        <strong>Technology Impact Analysis:</strong> Students examine how technology changed farming
                      </li>
                      <li>
                        <strong>Sustainable Agriculture Projects:</strong> Students design eco-friendly farming
                        solutions
                      </li>
                      <li>
                        <strong>Food Security Planning:</strong> Students develop food security strategies
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Transportation and Communication Networks</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Route Mapping:</strong> Students map transportation routes between islands
                      </li>
                      <li>
                        <strong>Infrastructure Analysis:</strong> Students evaluate transportation infrastructure
                      </li>
                      <li>
                        <strong>Connectivity Studies:</strong> Students research digital communication networks
                      </li>
                      <li>
                        <strong>Tourism Impact Research:</strong> Students analyze tourism's effect on transportation
                      </li>
                      <li>
                        <strong>Challenge Identification:</strong> Students identify transportation barriers
                      </li>
                      <li>
                        <strong>Solution Proposals:</strong> Students propose infrastructure improvements
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Movement of People, Goods, and Services</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Migration Pattern Studies:</strong> Students research Caribbean migration trends
                      </li>
                      <li>
                        <strong>Diaspora Connections:</strong> Students explore Caribbean communities worldwide
                      </li>
                      <li>
                        <strong>Remittance Analysis:</strong> Students study the impact of money sent home
                      </li>
                      <li>
                        <strong>Service Economy Research:</strong> Students investigate tourism and service industries
                      </li>
                      <li>
                        <strong>Globalization Impact Studies:</strong> Students analyze global connections
                      </li>
                      <li>
                        <strong>Economic Flow Diagrams:</strong> Students create diagrams showing resource movement
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
                <li>Caribbean trade statistics databases</li>
                <li>Agricultural development documentaries</li>
                <li>Transportation network mapping tools</li>
                <li>Economic development case studies</li>
                <li>Migration pattern visualization tools</li>
                <li>Business simulation software</li>
                <li>Economic indicator tracking websites</li>
                <li>Virtual port and airport tours</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Economic maps and charts</li>
                <li>Agricultural samples and tools</li>
                <li>Trade flow diagrams</li>
                <li>Transportation models and maps</li>
                <li>Economic data collection sheets</li>
                <li>Business planning templates</li>
                <li>Calculator and graphing materials</li>
                <li>Presentation supplies for projects</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Caribbean trade relationships have evolved from colonial patterns focused on raw material exports to more
              diversified economies. Major trading partners include the United States, European Union, Canada, and
              increasingly, Latin American countries. Regional trade through CARICOM has grown, though challenges remain
              in achieving full economic integration.
            </p>
            <p className="mb-2">
              Caribbean agriculture has undergone significant transformation since 1900. The decline of sugar
              plantations led to diversification into crops like bananas, citrus, cocoa, and spices. Modern challenges
              include climate change, competition from larger producers, and the need for sustainable farming practices
              to ensure food security.
            </p>
            <p className="mb-2">
              Transportation and communication networks are crucial for Caribbean economic development. Inter-island
              connectivity remains challenging due to geography and costs. Major airports and seaports serve as economic
              hubs, while digital communication has opened new opportunities for service exports and remote work.
            </p>
            <p>
              The movement of people, goods, and services reflects the Caribbean's integration with global markets.
              Migration has created a significant diaspora that contributes through remittances and knowledge transfer.
              Tourism represents a major service export, while the region increasingly participates in global value
              chains for manufacturing and services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
