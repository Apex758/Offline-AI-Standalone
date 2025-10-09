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
      
      <Link href="/curriculum/grade3-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Users className="mr-2 h-7 w-7 text-purple-600" />
            Civic Participation
          </h1>
          <p className="text-gray-700">
            Students build their civic competence by exploring dimensions of national pride that shape island citizens.
            This includes national symbols, anthems, emblems that help define their unique island context. Through
            understanding these elements, students develop a sense of identity and belonging to their nation.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Civic Participation
        </h3>

        <Tabs defaultValue="symbols">
          <TabsList className="grid w-full grid-cols-2 bg-purple-100">
            <TabsTrigger value="symbols" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              National Symbols
            </TabsTrigger>
            <TabsTrigger value="heroes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              National Heroes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symbols" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: National Symbols</h4>
            <p className="mb-3">To appreciate that we shape and are influenced by national pride.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the people who contributed to the creation of some of our national symbols</li>
              <li>
                Illustrate and describe the meaning of the colors/symbols of some of our national symbols and emblems
              </li>
              <li>Appreciate that our national symbols help us define who we are as a people</li>
              <li>Explain why we play, sing, recite our national anthem, motto and pledge</li>
              <li>Sing and recite our national anthem, motto and pledge</li>
              <li>
                Demonstrate appropriate behavior when singing/playing or reciting the National Pledge, Motto or Anthem
              </li>
              <li>
                Recognize that our national bird and tree help us identify important features of our natural environment
              </li>
              <li>Demonstrate the ways that we show respect for our national bird and flower</li>
              <li>
                Appreciate that our national bird and flower are a precious part of our environment that need to be
                protected
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-purple-100">
              <h5 className="font-medium text-purple-700">Focus Questions:</h5>
              <p>How do you think the national symbols of your country came about?</p>
              <p>What do you know about the national symbols and emblems?</p>
              <p>
                How do you feel when the national symbols are being showcased locally, regionally, and internationally?
              </p>
              <p>Why do you think it is important to have a national anthem and pledge?</p>
              <p>What are the national bird, tree and flower of our country?</p>
              <p>How do we protect our national bird, tree and flower?</p>
            </div>
          </TabsContent>

          <TabsContent value="heroes" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: National Heroes</h4>
            <p className="mb-3">To appreciate that we shape and are influenced by national pride.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Name the national heroes of our country</li>
              <li>Create profiles about these national heroes</li>
              <li>
                Show respect for the contribution made by national heroes who help to improve the lives of our people
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-purple-100">
              <h5 className="font-medium text-purple-700">Focus Questions:</h5>
              <p>Who are some of our national heroes?</p>
              <p>How did these heroes shape and impact our country?</p>
              <p>How should we show gratitude to our national heroes?</p>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  National Symbols
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify the people who contributed to the creation of some of our
                      national symbols
                    </li>
                    <li>
                      <strong>Skills:</strong> Illustrate and describe the meaning of the colors/symbols of some of our
                      national symbols and emblems
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that our national symbols help us define who we are as a
                      people
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  National Anthem and Pledge
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain why we play, sing, recite our national anthem, motto and
                      pledge
                    </li>
                    <li>
                      <strong>Skills:</strong> Sing and recite our national anthem, motto and pledge
                    </li>
                    <li>
                      <strong>Values:</strong> Demonstrate appropriate behavior when singing/playing or reciting the
                      National Pledge, Motto or Anthem
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  National Bird and Tree
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Recognize that our national bird and tree help us identify important
                      features of our natural environment
                    </li>
                    <li>
                      <strong>Skills:</strong> Demonstrate the ways that we show respect for our national bird and
                      flower
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that our national bird and flower are a precious part of our
                      environment that need to be protected
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">National Heroes</AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Name the national heroes of our country
                    </li>
                    <li>
                      <strong>Skills:</strong> Create profiles about these national heroes
                    </li>
                    <li>
                      <strong>Values:</strong> Show respect for the contribution made by national heroes who help to
                      improve the lives of our people
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-violet-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-violet-50">
              <CardTitle className="text-violet-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-violet-700">Observations:</strong> Observe students during role plays, video
                  viewing, and picture inferencing
                </li>
                <li>
                  <strong className="text-violet-700">Conversations:</strong> Class discussions, brainstorming sessions,
                  KWL activities
                </li>
                <li>
                  <strong className="text-violet-700">Products:</strong> Artwork, posters, word art, collages, profiles
                  of national heroes
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
                <h4 className="font-semibold mb-2 text-violet-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for role plays and presentations</li>
                  <li>Rubrics for evaluating artwork and posters</li>
                  <li>Self-assessment forms for singing the national anthem</li>
                  <li>Peer assessment for group work on national heroes</li>
                  <li>Fill-in-the-blanks activities for the national anthem and pledge</li>
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
                  <AccordionTrigger>Exploring National Symbols</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Class Discussion:</strong> Students view videos of local athletes representing the
                        country and identify national symbols.
                      </li>
                      <li>
                        <strong>Brainstorming/KWL:</strong> Students share what they know about national symbols and
                        what they want to learn.
                      </li>
                      <li>
                        <strong>Research:</strong> Students research information on the persons who created/designed
                        national symbols.
                      </li>
                      <li>
                        <strong>Role Play:</strong> Students role play the creation and meaning of national symbols.
                      </li>
                      <li>
                        <strong>Artwork:</strong> Students create artwork representing national symbols.
                      </li>
                      <li>
                        <strong>Gallery Walk:</strong> Students display and view each other's artwork.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>National Anthem and Pledge</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Video Analysis:</strong> Students watch videos of athletes receiving medals and crowds
                        reciting the pledge.
                      </li>
                      <li>
                        <strong>Story Time:</strong> A visitor shares why it's important to play, sing, and recite the
                        national anthem and pledge.
                      </li>
                      <li>
                        <strong>Word Art:</strong> Students create word clouds about the national anthem and pledge.
                      </li>
                      <li>
                        <strong>Group Practice:</strong> Students practice singing the anthem and reciting the pledge in
                        small groups.
                      </li>
                      <li>
                        <strong>Fill in the Blanks:</strong> Students complete missing words in printed copies of the
                        anthem and pledge.
                      </li>
                      <li>
                        <strong>Resource Person:</strong> A police officer discusses appropriate behavior during the
                        anthem and pledge.
                      </li>
                      <li>
                        <strong>Role Play:</strong> Students demonstrate appropriate and inappropriate behaviors during
                        the anthem and pledge.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>National Bird and Tree</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Class Discussion:</strong> Students view videos or presentations on the national bird,
                        tree, and flower.
                      </li>
                      <li>
                        <strong>Map Work:</strong> Students use maps to identify the natural environment of the national
                        bird, tree, and flower.
                      </li>
                      <li>
                        <strong>Nature Walk:</strong> Students observe and photograph national symbols in their natural
                        environment.
                      </li>
                      <li>
                        <strong>Social Media Profiles:</strong> Students create WhatsApp profiles explaining how to
                        respect national symbols.
                      </li>
                      <li>
                        <strong>Tree Planting:</strong> Students plant national trees and flowers at school.
                      </li>
                      <li>
                        <strong>Ministry Communication:</strong> Students contact environmental ministries about
                        protection laws.
                      </li>
                      <li>
                        <strong>Creative Writing:</strong> Students create poems or songs about protecting national
                        symbols.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>National Heroes</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Brainstorming:</strong> Students identify outstanding personalities in their
                        country/region.
                      </li>
                      <li>
                        <strong>Group Work:</strong> Students research and create collages of national heroes.
                      </li>
                      <li>
                        <strong>Think Pair Share:</strong> Students discuss characteristics of national heroes.
                      </li>
                      <li>
                        <strong>Video Analysis:</strong> Students watch videos about national heroes and their
                        contributions.
                      </li>
                      <li>
                        <strong>Venn Diagrams:</strong> Students compare and contrast different national heroes.
                      </li>
                      <li>
                        <strong>Inquiry-Based Learning:</strong> Students research challenges faced by the country and
                        how heroes helped.
                      </li>
                      <li>
                        <strong>Profile Creation:</strong> Students design profiles of national heroes based on
                        research.
                      </li>
                      <li>
                        <strong>Letter Writing:</strong> Students write letters to living heroes or families of deceased
                        heroes.
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
                <li>Videos of local athletes representing the country</li>
                <li>Recordings of the national anthem and pledge</li>
                <li>PowerPoint presentations on national symbols</li>
                <li>Videos or images of national birds, trees, and flowers</li>
                <li>
                  <a
                    href="https://youtu.be/cfhnW3bd064?si=gmcqk993Yge3k01Q"
                    className="text-purple-600 hover:underline"
                  >
                    PowerPoint tutorial for children
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/watch?v=U0mpJ3rv64U" className="text-purple-600 hover:underline">
                    National Heroes Video
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/watch?v=FgdKD9owv7E" className="text-purple-600 hover:underline">
                    A Hero Like You
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Art and Activity Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Laptop, Bluetooth speaker, tablets</li>
                <li>Chart paper, easel, copy paper, construction paper</li>
                <li>Crayons, acrylic paint, markers, glue, scissors</li>
                <li>Musical instruments for anthem practice</li>
                <li>Pictures of national heroes, symbols, and emblems</li>
                <li>Tree seedlings for planting activities</li>
                <li>Materials for creating collages and posters</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              National symbols serve as a source of unity and pride among citizens, fostering a sense of national
              identity and belonging. They are often officially recognized and protected by law to ensure their proper
              use and representation.
            </p>
            <p className="mb-2">
              When we play, sing, and recite our national anthem and pledge, we show respect for our country and its
              values. By singing and reciting our national anthem and pledge, we express our loyalty and love for our
              nation.
            </p>
            <p className="mb-2">
              National symbols help to form the national identity of a country. They create national pride among
              citizens. Every country has its own national symbols, and each country creates laws to protect its
              national symbols.
            </p>
            <p>
              A national hero is an individual who is recognized and honored for their outstanding works which have had
              a positive impact on the country. Heroes often address challenges faced by the nation and contribute to
              its development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
