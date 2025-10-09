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
            <Link href="/curriculum/grade6-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Users className="mr-2 h-7 w-7 text-purple-600" />
            Civic Participation
          </h1>
          <p className="text-gray-700">
            This strand explores how the Eastern Caribbean connects to and participates in international organizations.
            Students develop understanding of national identity, global cooperation, social issues, democratic
            processes, and media literacy while appreciating that complex global problems require international
            cooperation.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Civic Participation
        </h3>

        <Tabs defaultValue="identity">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="identity" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              National Identity & Organizations
            </TabsTrigger>
            <TabsTrigger value="democracy" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Democratic Participation
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Media & Global Issues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome: National Identity and International Cooperation
            </h4>
            <p className="mb-3">
              To appreciate that complex global problems require international cooperation to make choices for the
              future.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Demonstrate understanding of factors which influence national identity</li>
              <li>Research aspects of national identity and their influences</li>
              <li>Recognize that countries belong to different international organizations</li>
              <li>Examine international organizations and their roles</li>
              <li>Identify major social issues in the Eastern Caribbean and nearby world</li>
              <li>Appreciate that cooperation is necessary for country development</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-purple-100">
              <h5 className="font-medium text-purple-700">Focus Questions:</h5>
              <p>What is national identity and what key elements contribute to it?</p>
              <p>What is an international organization and how do countries connect to them?</p>
              <p>What are the major social issues affecting the Eastern Caribbean?</p>
            </div>
          </TabsContent>

          <TabsContent value="democracy" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Democratic Rights and Electoral Process</h4>
            <p className="mb-3">
              To understand democratic participation and the importance of respecting democratic rights.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Examine the role of citizens in the electoral process</li>
              <li>Discuss the importance of participating in electoral processes</li>
              <li>Value the importance of respecting persons' democratic rights</li>
              <li>Understand voting as a fundamental democratic right</li>
              <li>Explore how citizens can hold governments accountable</li>
              <li>Appreciate the role of youth in democratic participation</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-purple-100">
              <h5 className="font-medium text-purple-700">Focus Questions:</h5>
              <p>Why is it important for citizens to vote in an election?</p>
              <p>Why should citizens educate themselves before participating in elections?</p>
              <p>How does voting protect people's democratic rights?</p>
            </div>
          </TabsContent>

          <TabsContent value="media" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome: Media Literacy and International Cooperation
            </h4>
            <p className="mb-3">
              To develop critical media literacy skills and understand international cooperation in addressing global
              issues.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Explain the role of media in shaping views of local and international events</li>
              <li>Compare and analyze media sources from various countries</li>
              <li>Appreciate responsibility to verify media accuracy and engage responsibly</li>
              <li>Discuss how international organizations address social issues</li>
              <li>Categorize advantages and disadvantages of international membership</li>
              <li>Appreciate ways Eastern Caribbean citizens cooperate internationally</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-purple-100">
              <h5 className="font-medium text-purple-700">Focus Questions:</h5>
              <p>What are the different types of media organizations and their roles?</p>
              <p>Do all media organizations cover news in the same way?</p>
              <p>How can different organizations work together to address social issues?</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Six, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  National Identity and Organizations
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Understand factors influencing national identity and international
                      organizations
                    </li>
                    <li>
                      <strong>Skills:</strong> Research national identity aspects and examine organizational roles
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate diverse expressions of national pride and international
                      cooperation
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Social Issues and Cooperation
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify major social issues and international cooperation efforts
                    </li>
                    <li>
                      <strong>Skills:</strong> Examine issue causes, solutions, and organizational responses
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate different perspectives on addressing social issues
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Electoral Process and Rights
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Understand citizen roles in electoral processes and democratic rights
                    </li>
                    <li>
                      <strong>Skills:</strong> Discuss importance of electoral participation and democratic engagement
                    </li>
                    <li>
                      <strong>Values:</strong> Value importance of respecting democratic rights and processes
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Media Literacy and Global Citizenship
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain media roles and compare international sources
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze media sources and verify information accuracy
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate responsibility for critical media consumption
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
                  debates, and media analysis activities
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Democratic discussions, media literacy
                  dialogues, international cooperation debates
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> National identity projects, organization
                  research, media analysis reports, civic action plans
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Civic knowledge assessment rubrics</li>
                  <li>Media analysis evaluation criteria</li>
                  <li>Democratic participation checklists</li>
                  <li>Research project assessment guides</li>
                  <li>Collaborative activity peer assessments</li>
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
                  <AccordionTrigger>National Identity and Organizations</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Identity Research:</strong> Students investigate national symbols, culture, and history
                      </li>
                      <li>
                        <strong>Organization Mapping:</strong> Students research international organizations and
                        memberships
                      </li>
                      <li>
                        <strong>Cultural Celebrations:</strong> Students plan events showcasing national pride
                      </li>
                      <li>
                        <strong>Resource Person Visits:</strong> Students interact with community leaders and officials
                      </li>
                      <li>
                        <strong>Creative Expression:</strong> Students create poems, songs, and art about national
                        identity
                      </li>
                      <li>
                        <strong>International Cooperation Projects:</strong> Students explore organizational benefits
                        and challenges
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Democratic Participation Activities</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Mock Elections:</strong> Students organize and participate in classroom elections
                      </li>
                      <li>
                        <strong>Electoral Process Simulations:</strong> Students role-play different electoral roles
                      </li>
                      <li>
                        <strong>Rights and Responsibilities Charts:</strong> Students create civic engagement guides
                      </li>
                      <li>
                        <strong>Guest Speaker Sessions:</strong> Students interact with election officials and
                        politicians
                      </li>
                      <li>
                        <strong>Democratic Debates:</strong> Students discuss current issues and policy positions
                      </li>
                      <li>
                        <strong>Civic Action Projects:</strong> Students plan community engagement initiatives
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Media Literacy and Analysis</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Media Source Comparison:</strong> Students analyze different news sources and
                        perspectives
                      </li>
                      <li>
                        <strong>Fact-Checking Activities:</strong> Students verify information accuracy and identify
                        bias
                      </li>
                      <li>
                        <strong>News Report Creation:</strong> Students produce their own news segments
                      </li>
                      <li>
                        <strong>Social Media Responsibility:</strong> Students explore responsible digital citizenship
                      </li>
                      <li>
                        <strong>Global News Analysis:</strong> Students examine international events and coverage
                      </li>
                      <li>
                        <strong>Media Literacy Campaigns:</strong> Students create awareness materials about responsible
                        media use
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>International Cooperation Studies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Organization Research:</strong> Students investigate WHO, FAO, IOM, UNICEF roles
                      </li>
                      <li>
                        <strong>Social Issues Mapping:</strong> Students identify and analyze global challenges
                      </li>
                      <li>
                        <strong>Cooperation Benefits Analysis:</strong> Students examine advantages of international
                        membership
                      </li>
                      <li>
                        <strong>Problem-Solution Projects:</strong> Students propose solutions to global issues
                      </li>
                      <li>
                        <strong>Model UN Simulations:</strong> Students role-play international negotiations
                      </li>
                      <li>
                        <strong>Global Citizenship Portfolios:</strong> Students document their understanding of world
                        citizenship
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
                <li>National government websites and virtual tours</li>
                <li>International organization educational materials</li>
                <li>Media literacy training platforms</li>
                <li>Democratic simulation software</li>
                <li>Global news sources and fact-checking sites</li>
                <li>Civic education videos and documentaries</li>
                <li>Social issues databases and case studies</li>
                <li>International cooperation project showcases</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>National symbols and flags</li>
                <li>Mock election materials (ballots, boxes)</li>
                <li>International organization publications</li>
                <li>Media analysis worksheets and guides</li>
                <li>Democratic process charts and diagrams</li>
                <li>Global maps and atlases</li>
                <li>Civic education books and pamphlets</li>
                <li>Presentation materials for student projects</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              National identity is shaped by cultural heritage, geography, political systems, historical context, and
              globalization. In the Caribbean, national identity includes shared experiences of colonization,
              independence movements, cultural diversity, and regional cooperation. Understanding these factors helps
              students appreciate their place in both national and global contexts.
            </p>
            <p className="mb-2">
              Democratic participation involves understanding electoral processes, citizen rights and responsibilities,
              and the importance of informed voting. In Caribbean democracies, citizens participate through voting,
              civic engagement, community involvement, and holding governments accountable. Youth participation is
              crucial for democratic sustainability and can include student councils, youth parliaments, and community
              service.
            </p>
            <p>
              Media literacy is essential in today's digital age, where information comes from multiple sources with
              varying perspectives and accuracy. Students must learn to identify reliable sources, recognize bias,
              fact-check information, and understand how media shapes public opinion. International organizations like
              WHO, FAO, IOM, and UNICEF work together to address global challenges, demonstrating the importance of
              cooperation in solving complex problems that affect all nations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
