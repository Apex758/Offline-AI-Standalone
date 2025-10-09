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
      
      <Link href="/curriculum/grade3-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <DollarSign className="mr-2 h-7 w-7 text-amber-600" />
            Economic Decision Making
          </h1>
          <p className="text-gray-700">
            Students learn about the correlation between the use of our human and natural resources and how these
            resources impact the growth of our economy. Economic concepts taught at this early age equip young citizens
            with decision-making skills about how to effectively and sustainably use resources to benefit all. Students
            explore major economic activities, culture and economy, population, and migration.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Economic Decision Making
        </h3>

        <Tabs defaultValue="activities">
          <TabsList className="grid w-full grid-cols-2 bg-amber-100">
            <TabsTrigger value="activities" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Economic Activities
            </TabsTrigger>
            <TabsTrigger value="population" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Culture & Population
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Economic Activities</h4>
            <p className="mb-3">To understand how our natural and human resources shape our island identity.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the major economic activities on our island and their link to natural resources</li>
              <li>Assess the direct and in-direct impact of these economic activities on your family well being</li>
              <li>
                Appreciate that major economic activities of agriculture and tourism are linked to the natural resources
                of our island
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>What are economic activities?</p>
              <p>What is the importance of import and export in driving our island's economy?</p>
              <p>Who are consumers and producers?</p>
              <p>What is the importance of agriculture to the development of our island?</p>
              <p>How does tourism impact our economy?</p>
            </div>
          </TabsContent>

          <TabsContent value="population" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Culture, Population, and Migration</h4>
            <p className="mb-3">To understand how our natural and human resources shape our island identity.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Explain the relationship between the environment and our culture</li>
              <li>Explore the ways in which our people can earn a living through culture</li>
              <li>Appreciate how culture shapes our identity and economy</li>
              <li>Define the term population and understand its significance in the context of our region</li>
              <li>Explain how changes in population can affect our region's resources and services</li>
              <li>
                Evaluate the potential consequences of a growing or declining population on our region's economy,
                infrastructure, and community
              </li>
              <li>Distinguish between immigration and emigration</li>
              <li>Analyze the effects of migration on the region (positive and negative)</li>
              <li>
                Recognize the importance of respecting and accepting individuals from diverse backgrounds, understanding
                their contributions to the community
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>How do the different aspects of culture influence our economy?</p>
              <p>How does population growth or decline affect our resources and services?</p>
              <p>What is the difference between immigration and emigration?</p>
              <p>How does migration affect our region?</p>
              <p>Why is it important to respect and accept individuals from diverse backgrounds?</p>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Economic Activities
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify the major economic activities on our island and their link to
                      natural resources
                    </li>
                    <li>
                      <strong>Skills:</strong> Assess the direct and in-direct impact of these economic activities on
                      your family well being
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that major economic activities of agriculture and tourism are
                      linked to the natural resources of our island
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Culture and Economy
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain the relationship between the environment and our culture
                    </li>
                    <li>
                      <strong>Skills:</strong> Explore the ways in which our people can earn a living through culture
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate how culture shapes our identity and economy
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">Population</AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Define the term population and understand its significance in the
                      context of our region
                    </li>
                    <li>
                      <strong>Skills:</strong> Explain how changes in population can affect our region's resources and
                      services
                    </li>
                    <li>
                      <strong>Values:</strong> Evaluate the potential consequences of a growing or declining population
                      on our region's economy, infrastructure, and community
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Impact of Migration
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Distinguish between immigration and emigration
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze the effects of migration on the region (positive and negative)
                    </li>
                    <li>
                      <strong>Values:</strong> Recognize the importance of respecting and accepting individuals from
                      diverse backgrounds, understanding their contributions to the community
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
                  <strong className="text-orange-700">Observations:</strong> Observe students during picture
                  inferencing, role plays, and group activities
                </li>
                <li>
                  <strong className="text-orange-700">Conversations:</strong> Class discussions, think-pair-share
                  activities, guided discussions
                </li>
                <li>
                  <strong className="text-orange-700">Products:</strong> Maps, charts, posters, word art, infographics,
                  presentations
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <h4 className="font-semibold mb-2 text-orange-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Checklists for show-and-tell presentations</li>
                  <li>Rubrics for evaluating posters and infographics</li>
                  <li>Self-assessment forms for group work</li>
                  <li>Peer assessment for role plays</li>
                  <li>Graphic organizers for concept understanding</li>
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
                  <AccordionTrigger>Economic Activities</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Picture Inferencing:</strong> Students identify economic activities from pictures and
                        develop a working definition of economy.
                      </li>
                      <li>
                        <strong>Building Blocks:</strong> Students identify economic activities in their immediate
                        surroundings, from personal to community level.
                      </li>
                      <li>
                        <strong>Map Symbols:</strong> Students create maps showing major resources of their island and
                        the jobs generated by these resources.
                      </li>
                      <li>
                        <strong>Targeted Questioning:</strong> Students discuss how they contribute to their home
                        economy through chores and responsibilities.
                      </li>
                      <li>
                        <strong>Scenario Cards:</strong> Students identify economic concepts from market day scenarios.
                      </li>
                      <li>
                        <strong>Show and Tell:</strong> Students categorize local and imported products and display them
                        on a bulletin board.
                      </li>
                      <li>
                        <strong>Field Trips:</strong> Students visit farms and natural sites to see the connection
                        between natural resources and economic activities.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Culture and Economy</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Class Discussion:</strong> Students discuss culture and traditions, creating tree charts
                        of different aspects of their culture.
                      </li>
                      <li>
                        <strong>Cultural Corner:</strong> Students gather data, photos, videos, and items representing
                        traditional activities in their community.
                      </li>
                      <li>
                        <strong>Crossword Puzzles:</strong> Students complete puzzles on cultural activities in their
                        country.
                      </li>
                      <li>
                        <strong>News Reporting Role Play:</strong> Students present feasts and festivals as news
                        reporters.
                      </li>
                      <li>
                        <strong>Journaling/Scrapbooking:</strong> Students document independence events and their
                        economic benefits.
                      </li>
                      <li>
                        <strong>Cultural Demonstrations:</strong> Students showcase traditional dance, dress, food,
                        language, and music.
                      </li>
                      <li>
                        <strong>Activity Sheets:</strong> Students match cultural activities with related economic
                        activities.
                      </li>
                      <li>
                        <strong>Program Design:</strong> Students create activity programs for visitors and recipe
                        brochures of local dishes.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Population and Migration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concept Mapping:</strong> Students create concept maps showing how families grow by
                        adding members.
                      </li>
                      <li>
                        <strong>Classroom Demonstrations:</strong> Students create "cities" in the classroom and observe
                        population changes.
                      </li>
                      <li>
                        <strong>Educational Apps:</strong> Students explore population concepts using apps like "Stack
                        the Countries."
                      </li>
                      <li>
                        <strong>Map Activities:</strong> Students place cutouts on Caribbean maps to represent
                        population distribution.
                      </li>
                      <li>
                        <strong>Resource Distribution:</strong> Students share items in groups of different sizes to
                        understand resource constraints.
                      </li>
                      <li>
                        <strong>Storytelling and Mapping:</strong> Students create stories about families moving to new
                        places (immigration) or leaving (emigration).
                      </li>
                      <li>
                        <strong>Venn Diagrams:</strong> Students compare positive and negative effects of migration.
                      </li>
                      <li>
                        <strong>Group Work:</strong> Students represent different perspectives on migration through
                        visual presentations.
                      </li>
                      <li>
                        <strong>Song Activities:</strong> Students learn and create verses for songs about migration and
                        welcoming diverse people.
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
              <h3 className="font-semibold mb-2">Online Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <a
                    href="https://jamboard.google.com/d/1z3gKVUj5fSvQ5D6YnLiclEbkhZaG3BOxLs4SoilMIkY/edit?usp=sharing"
                    className="text-amber-600 hover:underline"
                  >
                    Jamboard for Economic Activities
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.education.com/worksheet-generator/reading/crossword-puzzle/"
                    className="text-amber-600 hover:underline"
                  >
                    Crossword Puzzle Generator
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.liveworksheets.com/w/en/english-second-language-esl/992829"
                    className="text-amber-600 hover:underline"
                  >
                    Immigration Forms Worksheet
                  </a>
                </li>
                <li>
                  <a
                    href="https://diversebookfinder.org/book/coqui-in-the-city/"
                    className="text-amber-600 hover:underline"
                  >
                    Coqui in the City (Caribbean Migration Story)
                  </a>
                </li>
                <li>Educational apps: Powtoon, Animaker, Loom, Renderforest</li>
                <li>Google Maps and other mapping tools</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Teaching Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pictures of economic activities, cultural events, and migration</li>
                <li>Labels and packaging from local and imported products</li>
                <li>Maps of the Caribbean region</li>
                <li>Art supplies for creating posters, collages, and models</li>
                <li>Scenario cards for economic concepts</li>
                <li>Children's books about culture, population, and migration</li>
                <li>Videos about economic activities, culture, and migration</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Economy refers to the use and management of resources, the way in which we make and spend money, and how
              our island generates cash flow and creates employment. Some households and countries have larger economies
              than others.
            </p>
            <p className="mb-2">
              Consumers are people who buy or use goods and services to satisfy their wants. Producers are people,
              companies, or countries that make, grow, or supply goods and provide services for sale.
            </p>
            <p className="mb-2">
              Culture is the way we live, expressed through festivals, religions, music, foods, dress, language,
              sports/games, and customs. Cultural activities can generate economic opportunities through tourism,
              crafts, performances, and food production.
            </p>
            <p className="mb-2">
              Population refers to the number of people living in a certain place. Population size, density, and
              distribution affect resource allocation, infrastructure needs, and economic development.
            </p>
            <p>
              Immigration is the movement of people into a country to settle, while emigration is the movement of people
              out of a country to settle elsewhere. Migration can have both positive effects (cultural diversity,
              economic growth, innovation) and negative effects (strain on resources, social challenges) on a region.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
