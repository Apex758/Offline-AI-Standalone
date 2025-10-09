import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function HistoricalCulturalThinkingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <Clock className="mr-2 h-7 w-7 text-amber-600" />
            Historical and Cultural Thinking
          </h1>
          <p className="text-gray-700">
            This strand explores the evolution of communication technology and media literacy, examines the impact of
            European colonization on Caribbean societies, and investigates the experiences of enslaved Africans and
            their resistance movements. Students develop critical thinking skills to analyze historical events and their
            lasting effects on Caribbean culture and identity.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Historical and Cultural Thinking
        </h3>

        <Tabs defaultValue="communication">
          <TabsList className="grid w-full grid-cols-4 bg-amber-100">
            <TabsTrigger
              value="communication"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Communication & Media
            </TabsTrigger>
            <TabsTrigger
              value="colonization"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              European Colonization
            </TabsTrigger>
            <TabsTrigger
              value="enslavement"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Enslavement Experience
            </TabsTrigger>
            <TabsTrigger value="resistance" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Resistance Movements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="communication" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome: Communication Technology & Media Literacy
            </h4>
            <p className="mb-3">
              To evaluate how communication technology has evolved and understand the importance of media literacy in
              the digital age.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Compare and contrast communication methods used in the past with those used today</li>
              <li>Analyze the impact of digital communication on Caribbean societies</li>
              <li>Identify reliable vs unreliable sources of information</li>
              <li>Demonstrate critical thinking when consuming media content</li>
              <li>Understand the role of social media in modern communication</li>
              <li>Recognize bias and propaganda in various media forms</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>How has digital technology changed the way we communicate in the Caribbean?</p>
              <p>What makes a source of information reliable or unreliable?</p>
              <p>How can we identify bias in media messages?</p>
              <p>What role does social media play in Caribbean youth culture?</p>
            </div>
          </TabsContent>

          <TabsContent value="colonization" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Impact of European Colonization</h4>
            <p className="mb-3">
              To analyze how European colonization transformed Caribbean societies and continues to influence the region
              today.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the major European powers that colonized the Caribbean</li>
              <li>Examine the motivations behind European colonization</li>
              <li>Analyze the impact on indigenous populations</li>
              <li>Understand the plantation system and its effects</li>
              <li>Explore cultural exchanges between Europeans, Africans, and indigenous peoples</li>
              <li>Recognize lasting effects of colonization on modern Caribbean societies</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>Why did European powers want to colonize the Caribbean?</p>
              <p>How did colonization affect the indigenous peoples of the Caribbean?</p>
              <p>What was the plantation system and how did it shape Caribbean society?</p>
              <p>How do we still see the effects of colonization in the Caribbean today?</p>
            </div>
          </TabsContent>

          <TabsContent value="enslavement" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Experiences of Enslaved Africans</h4>
            <p className="mb-3">
              To understand the experiences of enslaved Africans in the Caribbean and their contributions to Caribbean
              culture.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe the conditions of the Middle Passage</li>
              <li>Examine daily life for enslaved people on plantations</li>
              <li>Identify African cultural traditions that survived enslavement</li>
              <li>Understand how enslaved people maintained their humanity and dignity</li>
              <li>Explore the role of family and community among enslaved populations</li>
              <li>Recognize African contributions to Caribbean music, food, and traditions</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>What was the Middle Passage and what were conditions like?</p>
              <p>How did enslaved people maintain their cultural traditions?</p>
              <p>What aspects of African culture can we still see in the Caribbean today?</p>
              <p>How did enslaved people create communities and support systems?</p>
            </div>
          </TabsContent>

          <TabsContent value="resistance" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Resistance and Liberation Movements</h4>
            <p className="mb-3">
              To examine various forms of resistance by enslaved people and the path to emancipation in the Caribbean.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify different forms of resistance used by enslaved people</li>
              <li>Study major slave revolts and their leaders</li>
              <li>Understand the role of maroon communities</li>
              <li>Examine the abolition movement and key figures</li>
              <li>Analyze the process of emancipation across different Caribbean territories</li>
              <li>Recognize the ongoing struggle for freedom and equality</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>What different ways did enslaved people resist their oppression?</p>
              <p>Who were some important leaders of slave revolts in the Caribbean?</p>
              <p>What were maroon communities and how did they survive?</p>
              <p>How did the abolition movement lead to emancipation?</p>
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
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Communication Technology Evolution
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Compare and contrast communication methods used in the past with those
                      used today
                    </li>
                    <li>
                      <strong>Skills:</strong> Create a multimedia presentation showing the evolution of communication
                      technology
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate how communication technology has connected Caribbean
                      communities globally
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">Media Literacy</AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify reliable vs unreliable sources of information
                    </li>
                    <li>
                      <strong>Skills:</strong> Demonstrate critical thinking when analyzing media content
                    </li>
                    <li>
                      <strong>Values:</strong> Value the importance of seeking accurate information in the digital age
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  European Colonization Impact
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Analyze how European colonization transformed Caribbean societies
                    </li>
                    <li>
                      <strong>Skills:</strong> Create timelines and maps showing colonization patterns
                    </li>
                    <li>
                      <strong>Values:</strong> Recognize the complex legacy of colonization on Caribbean identity
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Enslaved African Experiences
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Understand the experiences of enslaved Africans in the Caribbean
                    </li>
                    <li>
                      <strong>Skills:</strong> Research and present on African cultural contributions
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the resilience and humanity of enslaved people
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Resistance Movements
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Examine various forms of resistance by enslaved people
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze primary sources about resistance movements
                    </li>
                    <li>
                      <strong>Values:</strong> Value the courage of those who fought for freedom
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
                  <strong className="text-orange-700">Observations:</strong> Monitor students during research
                  activities, discussions, and presentations
                </li>
                <li>
                  <strong className="text-orange-700">Conversations:</strong> Socratic seminars, debates, peer
                  interviews, reflection circles
                </li>
                <li>
                  <strong className="text-orange-700">Products:</strong> Research projects, multimedia presentations,
                  historical narratives, timelines, cultural artifacts
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <h4 className="font-semibold mb-2 text-orange-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Rubrics for evaluating research and presentation quality</li>
                  <li>Checklists for media literacy skills</li>
                  <li>Self-reflection journals on historical learning</li>
                  <li>Peer assessment for collaborative projects</li>
                  <li>Portfolio assessment of historical thinking development</li>
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
                  <AccordionTrigger>Communication Technology & Media Literacy</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Timeline Creation:</strong> Students create interactive timelines of communication
                        evolution
                      </li>
                      <li>
                        <strong>Media Analysis:</strong> Students evaluate news articles for bias and reliability
                      </li>
                      <li>
                        <strong>Digital Storytelling:</strong> Students create videos comparing past and present
                        communication
                      </li>
                      <li>
                        <strong>Fact-Checking Activities:</strong> Students verify information using multiple sources
                      </li>
                      <li>
                        <strong>Social Media Simulation:</strong> Students create responsible social media campaigns
                      </li>
                      <li>
                        <strong>Interview Projects:</strong> Students interview elders about communication changes
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>European Colonization</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Mapping Activities:</strong> Students create maps showing European colonial territories
                      </li>
                      <li>
                        <strong>Role-Playing:</strong> Students simulate colonial encounters from multiple perspectives
                      </li>
                      <li>
                        <strong>Document Analysis:</strong> Students examine primary sources from colonial period
                      </li>
                      <li>
                        <strong>Cause and Effect Charts:</strong> Students analyze impacts of colonization
                      </li>
                      <li>
                        <strong>Cultural Exchange Projects:</strong> Students research blending of cultures
                      </li>
                      <li>
                        <strong>Virtual Museum Tours:</strong> Students explore colonial artifacts online
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Enslaved African Experiences</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Narrative Writing:</strong> Students write first-person accounts of enslaved experiences
                      </li>
                      <li>
                        <strong>Cultural Preservation Projects:</strong> Students research African traditions in
                        Caribbean
                      </li>
                      <li>
                        <strong>Music and Art Analysis:</strong> Students explore African influences in Caribbean
                        culture
                      </li>
                      <li>
                        <strong>Family Tree Activities:</strong> Students trace cultural heritage connections
                      </li>
                      <li>
                        <strong>Oral History Collection:</strong> Students record family stories and traditions
                      </li>
                      <li>
                        <strong>Community Mapping:</strong> Students identify African cultural sites in their community
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Resistance Movements</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Biography Research:</strong> Students study resistance leaders and their strategies
                      </li>
                      <li>
                        <strong>Freedom Songs:</strong> Students learn and perform songs of resistance
                      </li>
                      <li>
                        <strong>Maroon Community Simulation:</strong> Students design sustainable maroon settlements
                      </li>
                      <li>
                        <strong>Timeline of Revolts:</strong> Students create chronologies of major uprisings
                      </li>
                      <li>
                        <strong>Letter Writing:</strong> Students write letters from perspectives of freedom fighters
                      </li>
                      <li>
                        <strong>Monument Design:</strong> Students design memorials to resistance heroes
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
                <li>Virtual museum tours of Caribbean history</li>
                <li>Documentary films on colonization and resistance</li>
                <li>Primary source document collections</li>
                <li>Interactive timelines of Caribbean history</li>
                <li>Media literacy evaluation tools</li>
                <li>Digital archives of enslaved people's narratives</li>
                <li>Online maps of colonial Caribbean</li>
                <li>Audio recordings of traditional Caribbean music</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Historical maps and atlases</li>
                <li>Replica artifacts from colonial period</li>
                <li>Books on Caribbean history and culture</li>
                <li>Art supplies for creative projects</li>
                <li>Musical instruments for cultural exploration</li>
                <li>Timeline materials and templates</li>
                <li>Research materials and note-taking supplies</li>
                <li>Presentation materials for student projects</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Communication technology has evolved from traditional methods like drums, smoke signals, and oral
              traditions to modern digital platforms. In the Caribbean context, this evolution has connected diaspora
              communities and preserved cultural traditions while also creating new challenges around information
              literacy and digital divides.
            </p>
            <p className="mb-2">
              European colonization of the Caribbean began in the late 15th century with Columbus's voyages. Spanish,
              British, French, Dutch, and other European powers established colonies primarily for economic exploitation
              through sugar plantations. This process devastated indigenous populations and led to the forced migration
              of millions of Africans.
            </p>
            <p className="mb-2">
              The experiences of enslaved Africans in the Caribbean were marked by extreme hardship but also remarkable
              resilience. Despite attempts to strip them of their humanity, enslaved people maintained cultural
              traditions, created new forms of expression, and built strong community bonds. African influences can be
              seen today in Caribbean music, food, religion, and social practices.
            </p>
            <p>
              Resistance to enslavement took many forms, from daily acts of defiance to organized revolts. Maroon
              communities, established by escaped enslaved people, created autonomous societies in remote areas. Major
              revolts like those led by Tacky in Jamaica and Bussa in Barbados challenged the plantation system. The
              abolition movement, combined with enslaved people's resistance, eventually led to emancipation across the
              Caribbean in the 19th century.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
