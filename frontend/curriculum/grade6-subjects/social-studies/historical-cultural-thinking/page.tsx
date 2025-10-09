import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, History, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function HistoricalCulturalThinkingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade6-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <History className="mr-2 h-7 w-7 text-amber-600" />
            Historical and Cultural Thinking
          </h1>
          <p className="text-gray-700">
            This strand explores how the diversity of the world's population is its strength. Students examine the
            powerful role of slavery in shaping Caribbean society, East Indian contributions to the region, migration
            patterns, and the rich cultural mosaic that fosters regional interactions through sports, culture, and
            music.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Historical and Cultural Thinking
        </h3>

        <Tabs defaultValue="slavery">
          <TabsList className="grid w-full grid-cols-4 bg-amber-100">
            <TabsTrigger value="slavery" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Slavery & Emancipation
            </TabsTrigger>
            <TabsTrigger value="eastindian" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              East Indian Culture
            </TabsTrigger>
            <TabsTrigger value="arts" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Arts & Sports
            </TabsTrigger>
            <TabsTrigger value="migration" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Migration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="slavery" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Understanding Slavery's End</h4>
            <p className="mb-3">
              To understand the diversity of the world's population is its strength and how slavery came to an end.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the different groups that worked to end slavery</li>
              <li>Understand the major milestones in the struggle for emancipation</li>
              <li>Appreciate the contributions of enslaved people and European abolitionists</li>
              <li>Build timelines of major milestones in the struggle for emancipation</li>
              <li>Value the contribution of enslaved people in resisting slavery</li>
              <li>Understand the significance of Emancipation Day celebrations</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>How did slavery come to an end?</p>
              <p>Who were the key groups that fought against slavery?</p>
              <p>What were the major milestones in achieving emancipation?</p>
            </div>
          </TabsContent>

          <TabsContent value="eastindian" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: East Indian Caribbean Cultures</h4>
            <p className="mb-3">
              To understand how East Indians contributed to Caribbean diversity and cultural richness.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Explain why East Indians were brought to the Caribbean as indentured servants</li>
              <li>Chart the route taken by East Indian indentured servants to the Caribbean</li>
              <li>Appreciate the influences that East Indians have on Caribbean culture</li>
              <li>Understand the concept of indentureship and its differences from slavery</li>
              <li>Explore East Indian festivals, food, music, and religious practices</li>
              <li>Recognize the ongoing contributions of Indo-Caribbean communities</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>Why were East Indians brought to the Caribbean?</p>
              <p>How have East Indians influenced Caribbean culture?</p>
              <p>What is the difference between slavery and indentureship?</p>
            </div>
          </TabsContent>

          <TabsContent value="arts" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Arts and Sports in Regional Identity</h4>
            <p className="mb-3">
              To understand how common sports, culture, and music activities foster regional interactions and pride.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe common sport, culture, and music activities that foster regional interactions</li>
              <li>Investigate how local figures have influence beyond their home state</li>
              <li>Appreciate the value of arts and sports for shaping regional identity</li>
              <li>Explore West Indies Cricket, CARIFTA Games, and regional festivals</li>
              <li>Research influential Caribbean artists, musicians, and athletes</li>
              <li>Understand how cultural exchanges strengthen Caribbean unity</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>How do common sports, culture and music activities foster regional interactions?</p>
              <p>Why is regional interaction important?</p>
              <p>How do Caribbean artists and athletes represent the region globally?</p>
            </div>
          </TabsContent>

          <TabsContent value="migration" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Migration Patterns and Impact</h4>
            <p className="mb-3">
              To understand migration patterns from the Eastern Caribbean and their impact on communities.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify places where people from the Eastern Caribbean have migrated</li>
              <li>Locate migration destinations on world maps</li>
              <li>Appreciate reasons why people migrate and its impact on home countries</li>
              <li>Understand push and pull factors of migration</li>
              <li>Explore the concept of brain drain and its effects</li>
              <li>Analyze how migration affects families and communities</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>Why did Caribbean people migrate to different countries?</p>
              <p>How did migration impact the lives of the people of the Caribbean?</p>
              <p>What are the positive and negative effects of migration?</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-amber-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Six, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Slavery and Emancipation
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify groups that worked to end slavery and major milestones
                    </li>
                    <li>
                      <strong>Skills:</strong> Build timelines of the struggle for emancipation
                    </li>
                    <li>
                      <strong>Values:</strong> Value the contribution of enslaved people in achieving freedom
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  East Indian Heritage
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain why East Indians came to the Caribbean
                    </li>
                    <li>
                      <strong>Skills:</strong> Chart migration routes from India to the Caribbean
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate East Indian cultural influences in the region
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Regional Arts and Sports
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe activities that foster regional interactions
                    </li>
                    <li>
                      <strong>Skills:</strong> Investigate influential regional figures
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate arts and sports in shaping regional identity
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Migration Understanding
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify Caribbean migration destinations
                    </li>
                    <li>
                      <strong>Skills:</strong> Locate migration patterns on world maps
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate migration reasons and community impacts
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-orange-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-orange-700">Observations:</strong> Monitor participation in dramatizations,
                  cultural presentations, and timeline activities
                </li>
                <li>
                  <strong className="text-orange-700">Conversations:</strong> Historical discussions, cultural
                  appreciation dialogues, migration impact debates
                </li>
                <li>
                  <strong className="text-orange-700">Products:</strong> Emancipation timelines, cultural collages,
                  migration maps, research presentations
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <h4 className="font-semibold mb-2 text-orange-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Historical timeline rubrics</li>
                  <li>Cultural presentation checklists</li>
                  <li>Research project evaluation criteria</li>
                  <li>Creative expression assessment guides</li>
                  <li>Peer assessment for collaborative activities</li>
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
                  <AccordionTrigger>Slavery and Emancipation Activities</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Picture Analysis:</strong> Students examine images of Emancipation Day celebrations
                      </li>
                      <li>
                        <strong>Story Mapping:</strong> Students trace how different groups contributed to ending
                        slavery
                      </li>
                      <li>
                        <strong>Timeline Creation:</strong> Students sequence major milestones in emancipation
                      </li>
                      <li>
                        <strong>Role-Play:</strong> Students dramatize scenarios about resistance and freedom
                      </li>
                      <li>
                        <strong>Creative Expression:</strong> Students create songs, dances, or art about emancipation
                      </li>
                      <li>
                        <strong>Panel Discussions:</strong> Students represent different groups in talk show format
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>East Indian Cultural Exploration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Route Mapping:</strong> Students chart sea routes from India to the Caribbean
                      </li>
                      <li>
                        <strong>Cultural Collages:</strong> Students create visual displays of East Indian influences
                      </li>
                      <li>
                        <strong>Festival Research:</strong> Students investigate Diwali, Eid, and other celebrations
                      </li>
                      <li>
                        <strong>Food Exploration:</strong> Students learn about roti, doubles, and curry dishes
                      </li>
                      <li>
                        <strong>Music Discovery:</strong> Students explore chutney music and traditional instruments
                      </li>
                      <li>
                        <strong>Interview Projects:</strong> Students interview community members about traditions
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Regional Arts and Sports Studies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Sports Research:</strong> Students investigate West Indies Cricket and CARIFTA Games
                      </li>
                      <li>
                        <strong>Artist Profiles:</strong> Students research influential Caribbean musicians and artists
                      </li>
                      <li>
                        <strong>Festival Calendar:</strong> Students create calendars of regional cultural events
                      </li>
                      <li>
                        <strong>Community Engagement:</strong> Students organize cultural appreciation activities
                      </li>
                      <li>
                        <strong>Biography Projects:</strong> Students research figures like Bob Marley, Brian Lara
                      </li>
                      <li>
                        <strong>Unity Celebrations:</strong> Students plan events showcasing regional connections
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Migration Pattern Analysis</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Migration Mapping:</strong> Students identify and locate migration destinations
                      </li>
                      <li>
                        <strong>Case Study Analysis:</strong> Students examine family migration stories
                      </li>
                      <li>
                        <strong>Push-Pull Factors:</strong> Students categorize reasons for migration
                      </li>
                      <li>
                        <strong>Impact Assessment:</strong> Students analyze effects on home and host countries
                      </li>
                      <li>
                        <strong>Interview Projects:</strong> Students interview migrants about their experiences
                      </li>
                      <li>
                        <strong>Gratitude Letters:</strong> Students write to overseas family members
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
                <li>Emancipation Day celebration videos</li>
                <li>East Indian cultural documentaries</li>
                <li>Caribbean sports and music archives</li>
                <li>Migration pattern interactive maps</li>
                <li>Historical timeline creation tools</li>
                <li>Cultural festival virtual tours</li>
                <li>Oral history interview platforms</li>
                <li>Creative expression digital tools</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Historical photographs and artifacts</li>
                <li>Cultural clothing and accessories</li>
                <li>Musical instruments from different cultures</li>
                <li>World maps and atlases</li>
                <li>Timeline creation materials</li>
                <li>Art supplies for creative projects</li>
                <li>Cultural food samples for exploration</li>
                <li>Interview recording equipment</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              The end of slavery in the Caribbean resulted from efforts by both enslaved Africans who resisted through
              various means and European abolitionists who campaigned for emancipation. Key milestones include the
              British Abolition Act of 1833 and full emancipation in 1838. Understanding this history helps students
              appreciate the struggle for freedom and human rights.
            </p>
            <p className="mb-2">
              East Indians came to the Caribbean as indentured servants after emancipation to work on sugar plantations.
              They brought rich cultural traditions including Hinduism, Islam, festivals like Diwali, foods like roti
              and curry, and music like chutney. Their contributions significantly enriched Caribbean cultural
              diversity.
            </p>
            <p>
              Migration from the Caribbean has been driven by economic opportunities, education, and family
              reunification. Common destinations include North America, the UK, and other Caribbean islands. While
              migration can lead to brain drain, it also creates diaspora communities that maintain strong cultural and
              economic ties to their home countries.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
