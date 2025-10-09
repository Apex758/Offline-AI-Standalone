import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BookOpen, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function HistoricalCulturalThinkingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade3-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <BookOpen className="mr-2 h-7 w-7 text-blue-600" />
            Historical and Cultural Thinking
          </h1>
          <p className="text-gray-700">
            In Grade 3, students build on knowledge gained in earlier levels regarding the different ethnicities and
            cultures that make up Caribbean society. This strand helps students recognize the different cultures and
            ethnic groups in their country, learn about events that led to multiple ethnic groups in the Caribbean
            today, and understand the role each group played in our collective history.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Historical and Cultural Thinking
        </h3>

        <Tabs defaultValue="ancestors">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100">
            <TabsTrigger value="ancestors" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Our Ancestors
            </TabsTrigger>
            <TabsTrigger value="origins" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Origin of Island People
            </TabsTrigger>
            <TabsTrigger value="culture" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Culture & Heritage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ancestors" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Our Ancestors</h4>
            <p className="mb-3">To understand the ways in which our island's peoples nurture respect for diversity.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Name the earliest inhabitants of our island</li>
              <li>Explore evidence of early settlements</li>
              <li>Discuss the Indigenous cultures of our island</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Questions:</h5>
              <p>What evidence is there to show the settlement of the early inhabitants in our islands?</p>
            </div>
          </TabsContent>

          <TabsContent value="origins" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Origin of our Island People</h4>
            <p className="mb-3">To understand the ways in which our island's peoples nurture respect for diversity.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>List the origins of the inhabitants of our island</li>
              <li>Locate the origins of our peoples through map work</li>
              <li>Discuss the positive and negative impact of migration on our region</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Questions:</h5>
              <p>Why did the early inhabitants settle in our islands?</p>
              <p>How did the settlement of our people affect the region?</p>
            </div>
          </TabsContent>

          <TabsContent value="culture" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Culture and Heritage</h4>
            <p className="mb-3">To understand the ways in which our island's peoples nurture respect for diversity.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Discuss key features and aspects of our island's culture and heritage that shape our identity</li>
              <li>
                Present information on special cultural events, activities or practices in which our people participate
              </li>
              <li>Develop interest in practicing aspects of our culture</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Questions:</h5>
              <p>How do the different aspects of culture influence our identity?</p>
              <p>Why do we participate in different cultural events and practices?</p>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">Our Ancestors</AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify the earliest inhabitants of our island
                    </li>
                    <li>
                      <strong>Skills:</strong> Use digital tools to investigate the evidence of early settlements of
                      Indigenous peoples
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate Indigenous cultures and respect their views of the environment
                      and society
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Origin of Island People
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> State the origins of the various peoples of our island/territory and
                      discuss the reasons why they came
                    </li>
                    <li>
                      <strong>Skills:</strong> Locate the geographic origins of our various peoples
                    </li>
                    <li>
                      <strong>Values:</strong> Recognize that migrations to our region had both positive and negative
                      consequences
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Culture and Heritage
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Discuss key features and aspects of our island's culture and heritage
                      that shaped our identity
                    </li>
                    <li>
                      <strong>Skills:</strong> Present information on special cultural events, activities or practices
                      you participate in
                    </li>
                    <li>
                      <strong>Values:</strong> Develop interest in practicing aspects of our culture
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Local Island Dialects
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> State the origins of our local island dialect(s)
                    </li>
                    <li>
                      <strong>Skills:</strong> Communicate with confidence and competence for different purposes with
                      different dialects
                    </li>
                    <li>
                      <strong>Values:</strong> Respect the value of local island dialects in shaping and defining our
                      cultural identity as a people
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Cultural Contributions
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe the cultural contributions of various peoples to our food,
                      religion, dress, arts, language, and economy
                    </li>
                    <li>
                      <strong>Skills:</strong> Gather information from various sources and represent it to show evidence
                      of the origins of ethnic contributions to our cultural heritage and national identity
                    </li>
                    <li>
                      <strong>Values:</strong> Show recognition of the contributions made by various peoples to our
                      cultural heritage and national identity
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Music Changes Over Time
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify ways our island traditional cultural music and dance have
                      evolved over time
                    </li>
                    <li>
                      <strong>Skills:</strong> Explore how traditional cultural music and dance have changed over time
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the contribution of specific individuals to shaping our
                      cultural development over time
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
                  <strong className="text-indigo-700">Observations:</strong> Observe students during KWL activities,
                  role plays, and picture inferencing
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Pre-assessments, guided discussions, oral
                  inquiries, student reflections
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Digital replicas of artifacts, presentations,
                  posters, word art, infographics, journals
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pre-assessment conversations to identify earliest inhabitants</li>
                  <li>Project-based assessments for creating digital replicas of artifacts</li>
                  <li>Observation checklists for role play activities</li>
                  <li>Rubrics for evaluating presentations and posters</li>
                  <li>Crossword puzzles on island culture and heritage</li>
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
                  <AccordionTrigger>Exploring Our Ancestors</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Pre-Assessment:</strong> Students view pictures of different inhabitants and identify
                        the earliest ones (Tainos and Kalinagos).
                      </li>
                      <li>
                        <strong>Digital Tools:</strong> Students use Mentimeter or other digital tools to share what
                        they know about the earliest inhabitants.
                      </li>
                      <li>
                        <strong>Investigation:</strong> Students visit historical sites or engage in virtual field trips
                        to investigate evidence of early settlers.
                      </li>
                      <li>
                        <strong>Journaling:</strong> Students create journals with information, images, and audio about
                        the earliest inhabitants.
                      </li>
                      <li>
                        <strong>Project:</strong> Students create replicas of artifacts using materials from their
                        environment or digital tools.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Origin of Island People</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Think/Share:</strong> Students write, state orally, or draw facts they know about
                        various groups who came to their island.
                      </li>
                      <li>
                        <strong>Video Analysis:</strong> Students view videos about the origin of various immigrants to
                        the Caribbean.
                      </li>
                      <li>
                        <strong>Word Art:</strong> Students create word art depicting the origins of early inhabitants.
                      </li>
                      <li>
                        <strong>Role Play:</strong> Students work together to draw a world map and role play the journey
                        of different ethnic groups.
                      </li>
                      <li>
                        <strong>Map Work:</strong> Students label maps showing origins of different groups who migrated
                        to their island.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Culture and Heritage</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concept Map:</strong> Students complete concept maps highlighting unique aspects of
                        their families.
                      </li>
                      <li>
                        <strong>Picture Inferencing:</strong> Students view pictures of aspects of culture and select
                        those common to their country.
                      </li>
                      <li>
                        <strong>Jigsaw Group Activity:</strong> Groups are assigned topics on culture and heritage to
                        research and present.
                      </li>
                      <li>
                        <strong>Class Survey:</strong> Students question classmates about cultural activities and create
                        graphs of the results.
                      </li>
                      <li>
                        <strong>Interactive Games:</strong> Students play games about different aspects of culture on
                        their island.
                      </li>
                      <li>
                        <strong>Potluck/Show & Tell:</strong> Students research favorite dishes/drinks and their
                        connection to heritage.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Local Island Dialects</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Introduction:</strong> Students are greeted in local island dialect and respond in kind.
                      </li>
                      <li>
                        <strong>Mini-Lecture:</strong> Students learn about the origins and value of local island
                        dialects.
                      </li>
                      <li>
                        <strong>Video Analysis:</strong> Students listen to stories in local dialect and identify
                        dialect phrases/words.
                      </li>
                      <li>
                        <strong>Interpretation Game:</strong> Students interpret the meaning of given expressions in
                        local dialect.
                      </li>
                      <li>
                        <strong>Dialogue/Presentation:</strong> Students create and present dialogues using local
                        dialect.
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
              <h3 className="font-semibold mb-2">Videos and Online Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <a href="https://virtualcarib.com/artefacts?page=1" className="text-blue-600 hover:underline">
                    Virtual Caribbean Artifacts
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.khanacademy.org/humanities/whp-origins/era-5-the-first-global-age/52-old-world-webs-betaa/v/pre-colonial-caribbean"
                    className="text-blue-600 hover:underline"
                  >
                    Khan Academy: Pre-Colonial Caribbean
                  </a>
                </li>
                <li>Science Journal for Kids and Teens</li>
                <li>Understanding Traditions and Cultures for Kids</li>
                <li>Our Caribbean Culture (Primary Social Studies)</li>
                <li>Wa Mek Daag No Laik Pus | Why Dog Don't Like Puss | Jamaican Kids Stories</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Texts and References</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Albertin, M & Brathwaite, M. (2020) Caribbean Primary Social Studies: Our Country Community. (Third
                  edition). Hodder Education, London.
                </li>
                <li>
                  Carman, L. (2018). Primary Social Studies For the Caribbean: Level 3. Macmillan Publishers, London.
                </li>
                <li>Caribbean Educational Publishers (2011). New Primary Level Social Studies Lower Primary Book 2.</li>
                <li>OECS Education Reform Unit Primary Social Studies Grades K-6 Teachers Guide</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              The first two major groups of people to settle in the Caribbean were the Taino People and the Kalinago
              People. The early inhabitants used materials (wood, stones, bones, cotton) from the environment to make
              their tools.
            </p>
            <p className="mb-2">The main groups who came to the Caribbean and their origins include:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Amerindians - South America</li>
              <li>Europeans - Europe</li>
              <li>Africans - West Africa</li>
              <li>Indians and Chinese - Asia</li>
            </ul>
            <p>
              Culture is the way we live. We express our culture through festivals, religions, music, foods, dress,
              language, sports/games, and customs. The Caribbean dialect is also referred to as the Creole Language,
              resulting from the historical influence of various ethnic groups that settled in the region.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
