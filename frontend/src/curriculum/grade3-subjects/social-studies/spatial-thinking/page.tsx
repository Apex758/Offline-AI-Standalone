import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Map, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function SpatialThinkingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade3-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <Map className="mr-2 h-7 w-7 text-green-600" />
            Spatial Thinking
          </h1>
          <p className="text-gray-700">
            This strand builds students' preliminary understanding of relative location by helping them see their
            island's geographic location and connections to nearby neighbors. Students explore how their islands are
            shaped by climate, environment, and natural hazards. They also understand how water bodies are important to
            Caribbean citizens' everyday life and how these bodies of water keep the region connected socially,
            politically, and economically.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Spatial Thinking
        </h3>

        <Tabs defaultValue="location">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger value="location" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Relative Location
            </TabsTrigger>
            <TabsTrigger value="water" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Water Bodies
            </TabsTrigger>
            <TabsTrigger value="seasons" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Seasons & Hazards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Relative Location</h4>
            <p className="mb-3">
              To appreciate how our people are shaped by geographic factors such as our tropical climate, island
              environment and natural hazards.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>State the relative location of our island/country/or territory within the Caribbean region</li>
              <li>Locate and label your island on a map of the Caribbean</li>
              <li>Recognize that our island/territory is connected geographically to the Caribbean region</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>What makes your island part of the Caribbean region?</p>
              <p>How is the Caribbean region similar to a neighborhood?</p>
            </div>
          </TabsContent>

          <TabsContent value="water" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Water Bodies</h4>
            <p className="mb-3">
              To appreciate how our people are shaped by geographic factors such as our tropical climate, island
              environment and natural hazards.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Name the water bodies that surround the Caribbean region</li>
              <li>Locate and label the water bodies on a map of the Caribbean</li>
              <li>Recognize that our surrounding seas and ocean have connected us as diverse Caribbean peoples</li>
              <li>Explain the importance of our water bodies to our people</li>
              <li>Investigate how our human activities affect these water bodies</li>
              <li>Appreciate the need for responsible actions to protect our water bodies</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>How have the surrounding water bodies contributed to the diversity of Caribbean people?</p>
              <p>How do the surrounding water bodies keep us connected?</p>
              <p>How do the actions of human beings affect our water bodies?</p>
              <p>Why should we protect our water bodies?</p>
            </div>
          </TabsContent>

          <TabsContent value="seasons" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Seasons and Natural Hazards</h4>
            <p className="mb-3">
              To appreciate how our people are shaped by geographic factors such as our tropical climate, island
              environment and natural hazards.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe the seasons on your islands and how they affect our daily lives</li>
              <li>Make appropriate decisions for various weather conditions</li>
              <li>Appreciate the benefits and drawbacks of each season for our environment</li>
              <li>Recognize that the location of islands makes them prone to natural hazards</li>
              <li>Examine examples of extreme natural hazards that affect our islands</li>
              <li>Appreciate that we need to be aware of ways to keep safe during natural hazards</li>
              <li>Describe appropriate preparations for various natural hazards</li>
              <li>Create a simple family preparation plan for a selected natural hazard</li>
              <li>Appreciate the need to minimize risk in times of natural hazards</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>What seasons do we experience in our part of the world?</p>
              <p>How do our lives change depending on the season?</p>
              <p>What natural disasters pose a threat to people in the Caribbean?</p>
              <p>What are the dangers posed by various natural hazards?</p>
              <p>How can families minimize their risk during a natural hazard?</p>
              <p>Why is it important for families to prepare for the event of a natural hazard?</p>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Relative Location
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> State the location of our island/country/or territory in relation to
                      their nearest neighbours in the Caribbean region
                    </li>
                    <li>
                      <strong>Skills:</strong> Locate and label your island on a map of the Caribbean
                    </li>
                    <li>
                      <strong>Values:</strong> Recognize that our island/territory is connected geographically to the
                      surrounding Caribbean region
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Water Bodies</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Name the major water bodies that surround their island and the rest of
                      Caribbean region
                    </li>
                    <li>
                      <strong>Skills:</strong> Locate and label the major water bodies on a map of the Caribbean
                    </li>
                    <li>
                      <strong>Values:</strong> Recognize that our surrounding seas and ocean have connected us as
                      diverse Caribbean peoples
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Importance of Water Bodies
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain the importance of our water bodies (seas, oceans, lagoons, and
                      rivers) to our people
                    </li>
                    <li>
                      <strong>Skills:</strong> Investigate how our human activities affect these water bodies
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the need for responsible actions to protect our water bodies
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Our Seasons</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe the seasons on your islands and describe how they affect our
                      daily lives
                    </li>
                    <li>
                      <strong>Skills:</strong> Make appropriate decisions for various weather conditions
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the benefits and drawbacks of each season for our environment
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Natural Hazards</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Recognize that the location of islands makes them prone to natural
                      hazards
                    </li>
                    <li>
                      <strong>Skills:</strong> Examine some examples of extreme natural hazards that affect our islands
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that we need to be aware of ways to keep safe during natural
                      hazards
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Preparing for Natural Hazards
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe appropriate preparations that need to be made for various
                      natural hazards
                    </li>
                    <li>
                      <strong>Skills:</strong> Create a simple family preparation plan for a selected natural hazard
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the need to minimize risk in times of natural hazards
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-teal-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-teal-700">Observations:</strong> Observe students during map activities,
                  simulations, and role plays
                </li>
                <li>
                  <strong className="text-teal-700">Conversations:</strong> Discussions about locations, water bodies,
                  seasons, and natural hazards
                </li>
                <li>
                  <strong className="text-teal-700">Products:</strong> Maps, models, charts, posters, emergency
                  preparation plans
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-100">
                <h4 className="font-semibold mb-2 text-teal-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for map activities</li>
                  <li>Rubrics for evaluating models and posters</li>
                  <li>Self-assessment forms for emergency preparation plans</li>
                  <li>Peer assessment for group work on water bodies</li>
                  <li>Exit slips for checking understanding of seasons and hazards</li>
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
                  <AccordionTrigger>Exploring Relative Location</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Map Skills:</strong> Students explore maps of the Caribbean Region using atlases,
                        globes, or Google Maps.
                      </li>
                      <li>
                        <strong>Floor Puzzle Map:</strong> Students position silhouettes of islands correctly to create
                        a floor puzzle map.
                      </li>
                      <li>
                        <strong>Map Labeling:</strong> Students identify errors in map labels and correctly label maps
                        of the Caribbean.
                      </li>
                      <li>
                        <strong>Discussion:</strong> Students discuss what it means to be part of the Caribbean region.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Understanding Water Bodies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Video and Discussion:</strong> Students view videos on types of water bodies and
                        identify those in the Caribbean.
                      </li>
                      <li>
                        <strong>Map Exploration:</strong> Students explore maps to identify water bodies surrounding the
                        region.
                      </li>
                      <li>
                        <strong>Simulation:</strong> Students position themselves based on the location of their island
                        in relation to water bodies.
                      </li>
                      <li>
                        <strong>Map Work:</strong> Students sketch their island and label surrounding water bodies.
                      </li>
                      <li>
                        <strong>Model Making:</strong> Students create models of their islands using playdough with
                        different colors for water bodies.
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students tour the island to observe various water bodies.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Seasons and Natural Hazards</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Map Exploration:</strong> Students identify the Caribbean's location near the equator
                        and discuss its impact on seasons.
                      </li>
                      <li>
                        <strong>Sorting Data:</strong> Students sort pictures depicting different seasons on their
                        island.
                      </li>
                      <li>
                        <strong>Charting Data:</strong> Students chart rainfall and temperature data for different
                        seasons.
                      </li>
                      <li>
                        <strong>Group Research:</strong> Students research how seasons affect cultural celebrations,
                        agriculture, and daily life.
                      </li>
                      <li>
                        <strong>Hazard Game:</strong> Students identify natural hazards from pictures/videos and discuss
                        their impact.
                      </li>
                      <li>
                        <strong>Role Play:</strong> Students role play the sounds and movements of natural hazards.
                      </li>
                      <li>
                        <strong>Emergency Planning:</strong> Students create family emergency preparation plans for
                        natural hazards.
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
              <h3 className="font-semibold mb-2">Maps and Geographic Tools</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Caribbean maps and maps of specific islands</li>
                <li>Atlases and globes</li>
                <li>Google Maps and other digital mapping tools</li>
                <li>
                  <a href="https://mapmaker.nationalgeographic.org/" className="text-green-600 hover:underline">
                    National Geographic MapMaker
                  </a>
                </li>
                <li>Silhouettes of Caribbean islands for floor puzzle activities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Videos and Online Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <a href="https://www.youtube.com/watch?v=U-rUl_OFBq0" className="text-green-600 hover:underline">
                    Types of Water Bodies
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/watch?v=J6DYWp27X1E" className="text-green-600 hover:underline">
                    Natural Hazards Video 1
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/watch?v=89_pDG4DneQ" className="text-green-600 hover:underline">
                    Natural Hazards Video 2
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/watch?v=HKR-2z5z_CQ" className="text-green-600 hover:underline">
                    Natural Hazards Video 3
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/watch?v=K_dhoKrxTJE" className="text-green-600 hover:underline">
                    Hurricane Story
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.theguardian.com/world/2017/oct/03/hurricane-maria-dominica-recovery"
                    className="text-green-600 hover:underline"
                  >
                    Hurricane Maria Article
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              The Caribbean has a tropical climate due to its location near the equator. The region experiences two
              seasons: the wet/rainy season (June to November) and the dry season (December to May).
            </p>
            <p className="mb-2">
              The two major water bodies surrounding the Caribbean region are the Caribbean Sea (west of the island
              chain) and the Atlantic Ocean (east of the region).
            </p>
            <p className="mb-2">
              Natural hazards common to the Caribbean include hurricanes, earthquakes, volcanic eruptions, floods, and
              landslides. The location of the Caribbean makes it prone to these hazards.
            </p>
            <p>
              Preparedness for natural hazards involves measures taken to ensure communities and individuals are ready
              to respond in the event of a disaster. Mitigation refers to measures taken in advance to reduce the
              potential impact of hazards.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
