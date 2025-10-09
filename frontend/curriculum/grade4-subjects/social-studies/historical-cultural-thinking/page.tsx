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
            <Link href="/curriculum/grade4-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <BookOpen className="mr-2 h-7 w-7 text-blue-600" />
            Historical and Cultural Thinking
          </h1>
          <p className="text-gray-700">
            This strand explores the Indigenous peoples of the Caribbean and European colonization. Students will learn
            about the Taíno and Kalinago people, their way of life, contributions to the region, and how European
            colonization affected their societies. Students will also explore the evolution of communication and
            transportation technology over time, developing a deeper understanding of the historical and cultural
            factors that have shaped the Caribbean region.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Historical and Cultural Thinking
        </h3>

        <Tabs defaultValue="indigenous">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100">
            <TabsTrigger value="indigenous" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Indigenous Peoples
            </TabsTrigger>
            <TabsTrigger
              value="colonization"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              European Colonization
            </TabsTrigger>
            <TabsTrigger value="present" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Indigenous Culture Today
            </TabsTrigger>
          </TabsList>

          <TabsContent value="indigenous" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Indigenous Peoples</h4>
            <p className="mb-3">
              To recognize that contact with Europeans brought significant changes for Indigenous peoples.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the places in the Caribbean where the Indigenous people settled</li>
              <li>Describe the way of life of the Indigenous people before contact with Europeans</li>
              <li>
                Recognize that the Indigenous peoples had flourishing societies before the arrival of the Europeans
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Question:</h5>
              <p>What was life like for Indigenous peoples before contact with Europeans?</p>
            </div>
          </TabsContent>

          <TabsContent value="colonization" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: European Colonization</h4>
            <p className="mb-3">
              To recognize that the arrival of Europeans brought significant changes for Indigenous peoples.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Understand the impact that European arrival had on the Indigenous people and on the Europeans</li>
              <li>State a simple definition of the terms 'colonization' and 'resistance'</li>
              <li>Identify the various forms of resistance used by the Indigenous people against colonization</li>
              <li>Recognize the impact of the active resistance of Indigenous people against the Europeans</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Questions:</h5>
              <p>Why did the Europeans come to the Caribbean in the 15th and 16th centuries?</p>
              <p>How did contact with the Indigenous people impact the Europeans?</p>
              <p>How did contact with Europeans impact the Indigenous peoples?</p>
              <p>Why did the Indigenous people resist European colonization?</p>
              <p>How did they resist colonization?</p>
            </div>
          </TabsContent>

          <TabsContent value="present" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Indigenous Culture Today</h4>
            <p className="mb-3">
              To recognize that contact with Europeans brought significant changes for Indigenous peoples.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify three aspects of Indigenous lifestyle still being practiced in the Caribbean today</li>
              <li>Locate places in the Caribbean where Indigenous settlements can still be found today</li>
              <li>Respect the Indigenous people's unique and vibrant lifestyle</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-700">Focus Question:</h5>
              <p>Why are aspects of Indigenous people's culture still practiced today in Caribbean communities?</p>
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
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Indigenous Life Before Europeans
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe the basic economic and social life of the Indigenous people
                      of the Caribbean before contact with Europeans
                    </li>
                    <li>
                      <strong>Skills:</strong> Chart the location where Indigenous people of the Caribbean were living
                      before contact with Europeans
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that the Indigenous people of the Caribbean had flourishing
                      societies and economies before contact with Europeans
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  European Colonization
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify the European groups that came to the Caribbean in the
                      15th-16th centuries and state reasons why they came
                    </li>
                    <li>
                      <strong>Skills:</strong> Categorize the impact of Europeans' colonization on the lifestyle of
                      Indigenous people and Europeans in the Caribbean
                    </li>
                    <li>
                      <strong>Values:</strong> Develop an awareness that colonization had many lasting negative
                      consequences for the Indigenous people of the Caribbean
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Indigenous Resistance
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify ways in which Indigenous people resisted European
                      colonization
                    </li>
                    <li>
                      <strong>Skills:</strong> Explain the reasons why Indigenous peoples resisted colonization
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that Indigenous people actively resisted colonization
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Indigenous Culture Today
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe aspects of Indigenous people's lifestyle practiced in the
                      Caribbean today
                    </li>
                    <li>
                      <strong>Skills:</strong> Locate where the Indigenous people of the Lesser Antilles are living
                      today
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that the Indigenous people of the Caribbean continue to have
                      unique and vibrant lifestyles
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
                  <strong className="text-indigo-700">Observations:</strong> Observe students during role plays, video
                  viewing, picture inferencing, and hands-on demonstrations
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Class discussions, brainstorming sessions,
                  KWL activities, critical thinking exercises
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> KWL charts, maps, journal entries, data disks,
                  comic strips, posters, field trip reports
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for role plays and demonstrations</li>
                  <li>Rubrics for evaluating map work and journal entries</li>
                  <li>Self-assessment forms for group participation</li>
                  <li>Peer assessment for collaborative activities</li>
                  <li>Fact-finding corners for assessing understanding of Indigenous societies</li>
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
                  <AccordionTrigger>Indigenous Life Before Europeans</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Circle Time:</strong> Students share what they remember about Indigenous peoples using
                        "I remember/learnt" statements
                      </li>
                      <li>
                        <strong>Think-Pair-Share:</strong> Students select statements about aspects of Indigenous
                        culture and discuss with peers
                      </li>
                      <li>
                        <strong>KWL Chart:</strong> Students complete a KWL chart about Indigenous peoples before
                        European contact
                      </li>
                      <li>
                        <strong>Video Inferencing:</strong> Students view videos on the economic and social life of
                        Indigenous peoples
                      </li>
                      <li>
                        <strong>Hands-on Demonstrations:</strong> Students engage in traditional practices like
                        preparing dishes, creating crafts, or role-playing bartering
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students visit museums or cultural centers with Indigenous
                        artifacts
                      </li>
                      <li>
                        <strong>Mapwork:</strong> Students identify and label locations where Indigenous peoples lived
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>European Colonization</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Guessing Game:</strong> Students identify European countries from cultural clues
                      </li>
                      <li>
                        <strong>Guided Research:</strong> Students research reasons Europeans came to the Caribbean
                      </li>
                      <li>
                        <strong>Jigsaw Activity:</strong> Groups research different European groups and share findings
                      </li>
                      <li>
                        <strong>Creative Expression:</strong> Students write stories or create comics about early
                        European sailors
                      </li>
                      <li>
                        <strong>PowerPoint Presentation:</strong> Students view presentations on colonization's impact
                      </li>
                      <li>
                        <strong>Market Scene:</strong> Students create a market scene showcasing products exchanged
                        between Europeans and Indigenous peoples
                      </li>
                      <li>
                        <strong>Discussion:</strong> Students discuss whether each group benefited equally from
                        exchanges
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Indigenous Resistance</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Roleplay:</strong> Students act out scenarios of resistance to colonization
                      </li>
                      <li>
                        <strong>Picture Inferencing:</strong> Students analyze images depicting Indigenous resistance
                      </li>
                      <li>
                        <strong>Think-Pair-Share:</strong> Students brainstorm reasons for resistance
                      </li>
                      <li>
                        <strong>Video/Reading:</strong> Students engage with materials about Indigenous resistance
                      </li>
                      <li>
                        <strong>Comic Strip:</strong> Students create comic strips depicting reasons for resistance
                      </li>
                      <li>
                        <strong>Court Trial:</strong> Students role-play a court case between Indigenous peoples and
                        Europeans
                      </li>
                      <li>
                        <strong>Indigenous Day Poster:</strong> Students create posters about Indigenous weapons and
                        resistance methods
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Indigenous Culture Today</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Hot Seat:</strong> Students share knowledge of Indigenous culture
                      </li>
                      <li>
                        <strong>Visual Presentation:</strong> Students explore different aspects of culture from various
                        groups
                      </li>
                      <li>
                        <strong>Group Research:</strong> Students research aspects of Indigenous Caribbean culture still
                        practiced today
                      </li>
                      <li>
                        <strong>Discussion:</strong> Students discuss examples of Indigenous culture in their country
                      </li>
                      <li>
                        <strong>Mapwork:</strong> Students locate Indigenous settlements on maps
                      </li>
                      <li>
                        <strong>Community Collaboration:</strong> Students design a display wall highlighting Indigenous
                        cultures
                      </li>
                      <li>
                        <strong>Journal Entry:</strong> Students reflect on what they've learned about Indigenous
                        cultures
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
              <h3 className="font-semibold mb-2">Multimedia Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Videos on Taíno and Kalinago history and traditions</li>
                <li>Documentaries on Caribbean Indigenous peoples</li>
                <li>Videos about Christopher Columbus and the Taíno people</li>
                <li>Presentations on the 3Gs of Exploration (Gold, God, Glory)</li>
                <li>
                  <a
                    href="https://youtu.be/lxnDJybshOc?feature=shared"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Indigenous Caribbean People
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=crDTk83kbQQ"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    The Kalinago Tribe | Caribs | Dominica
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=MA-7mzq17D4"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Storyboard Creator Tutorial
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Text Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>'Lament of an Arawak Child' by Pamela Mordecai</li>
                <li>Information on Kalinago culture and traditions</li>
                <li>Maps of the Caribbean showing Indigenous settlements</li>
                <li>Historical accounts of European colonization</li>
                <li>Stories and legends from Indigenous Caribbean cultures</li>
                <li>Articles on contemporary Indigenous communities</li>
                <li>Resources on traditional Indigenous crafts and practices</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              The Indigenous people were the first inhabitants of the Caribbean. Taínos settled in the Greater Antilles
              (Cuba, Jamaica, Hispaniola, Puerto Rico), while Kalinagos settled in the Lesser Antilles (St. Lucia,
              Grenada, St. Vincent and the Grenadines, Dominica). Both groups shared Trinidad and Puerto Rico.
            </p>
            <p className="mb-2">
              Indigenous societies had their own social structures and economic practices. Their communities were called
              Chiefdoms, religion played an important role in their way of life, and they farmed, fished, and bartered
              to meet their needs. Their societies practiced cultural traditions, including pottery-making and
              stone-carving.
            </p>
            <p className="mb-2">
              The early European groups that came to the Caribbean before the 1800s include the Spanish, French, Dutch,
              and British. They came to seek wealth through resources like gold, to spread their religious beliefs, and
              to gain fame (glory).
            </p>
            <p className="mb-2">
              European colonization brought both positive changes (new technology, crops, foods, animals) and negative
              changes (diseases, loss of traditions and customs, land appropriation, loss of freedom, forced labor) to
              Indigenous societies.
            </p>
            <p>
              Today, communities of Indigenous people can be found in various Caribbean countries, including Dominica,
              St. Vincent and the Grenadines, St. Lucia, Belize, Jamaica, Puerto Rico, and Guyana. They have preserved
              aspects of their culture such as traditional arts and crafts, music and dance, storytelling traditions,
              medicinal practices, agricultural practices, and hunting techniques.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
