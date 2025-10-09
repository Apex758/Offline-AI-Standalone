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
            <Link href="/curriculum/grade4-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-green-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-700 flex items-center">
            <Map className="mr-2 h-7 w-7 text-teal-600" />
            Spatial Thinking
          </h1>
          <p className="text-gray-700">
            In this strand, students explore the important geographic features that help them understand the unique
            features of their island. This includes learning to locate their island using latitude and longitude,
            determining its geographical divisions, examining the impacts of weather and climate change, and
            understanding the importance of parklands, fresh water sources, and how human activity shapes their natural
            environment.
          </p>
        </div>
      </div>

      <div className="bg-teal-50 p-6 rounded-lg border border-teal-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-teal-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Spatial Thinking
        </h3>

        <Tabs defaultValue="location">
          <TabsList className="grid w-full grid-cols-4 bg-teal-100">
            <TabsTrigger value="location" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Island Location
            </TabsTrigger>
            <TabsTrigger value="divisions" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Geographic Divisions
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Physical Features
            </TabsTrigger>
            <TabsTrigger value="climate" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Climate & Environment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Island Location</h4>
            <p className="mb-3">To understand that our island has important geographic features that make us unique.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe your island's location in relation to the wider Caribbean region</li>
              <li>Locate the island where you live on maps/globes using latitude and longitude</li>
              <li>
                Appreciate the advantages of maps and technology such as Google Earth in locating and describing our
                island's geography
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-teal-100">
              <h5 className="font-medium text-teal-700">Focus Questions:</h5>
              <p>How can we locate our island?</p>
              <p>How are maps useful to us?</p>
            </div>
          </TabsContent>

          <TabsContent value="divisions" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Geographic Divisions</h4>
            <p className="mb-3">To understand that our island has important geographic features that make us unique.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the geographic divisions of the country</li>
              <li>Label a map of the country to identify the geographic divisions</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-teal-100">
              <h5 className="font-medium text-teal-700">Focus Questions:</h5>
              <p>Why are geographic divisions necessary?</p>
              <p>How are geographic boundaries determined?</p>
            </div>
          </TabsContent>

          <TabsContent value="features" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Physical Features</h4>
            <p className="mb-3">To understand that our island has important geographic features that make us unique.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Define and classify the major physical features of our island</li>
              <li>Observe the differences between various land and water features of our island</li>
              <li>Appreciate that our island has natural geographic features that are environmentally vulnerable</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-teal-100">
              <h5 className="font-medium text-teal-700">Focus Questions:</h5>
              <p>What are the major physical natural features of our island and where are they located?</p>
              <p>Why is it important to protect our physical natural features?</p>
            </div>
          </TabsContent>

          <TabsContent value="climate" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Climate & Environment</h4>
            <p className="mb-3">To understand that our island has important geographic features that make us unique.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe the climate of our island(s)</li>
              <li>Investigate the changes in climate</li>
              <li>Appreciate that our climate has risks for our population</li>
              <li>Identify significant weather events that have impacted the natural environment</li>
              <li>Investigate the consequences of recent weather events on the built environment of your country</li>
              <li>
                Appreciate the need to prepare for climate emergencies and actions that can be taken to lessen the
                effects of natural forces
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-teal-100">
              <h5 className="font-medium text-teal-700">Focus Questions:</h5>
              <p>How has my island's climate changed over time?</p>
              <p>What are the risks associated with our climate?</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-teal-50">
            <CardTitle className="text-teal-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">Island Location</AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Skills:</strong> Locate the island where you live on maps/globes using lines of latitude
                      and longitude
                    </li>
                    <li>
                      <strong>Knowledge:</strong> Describe our island's location in relation to the wider Caribbean
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the advantages of maps and technology such as Google Earth in
                      locating and describing our island's geography
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Geographic Divisions
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify the geographic divisions of the country
                    </li>
                    <li>
                      <strong>Skills:</strong> Label a map of the country to identify the geographic divisions
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">Physical Features</AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Define and classify the major physical features of our island
                    </li>
                    <li>
                      <strong>Skills:</strong> Observe the differences between various land and water features of our
                      island
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that our island has natural geographic features that are
                      environmentally vulnerable
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">Climate & Weather</AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe the climate of our island(s) and identify significant weather
                      events that have impacted the natural environment
                    </li>
                    <li>
                      <strong>Skills:</strong> Investigate the changes in climate and the consequences of recent weather
                      events on the built environment
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that our climate has risks for our population and the need to
                      prepare for climate emergencies
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Parklands & Natural Reserves
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Determine the scope and nature of the areas of your country that are
                      parklands or natural reserves
                    </li>
                    <li>
                      <strong>Skills:</strong> Locate and describe the features and characteristics of these parklands
                      or reserves
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the purpose of these areas and their significance for
                      preserving flora, fauna, and human existence
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Fresh Water Sources
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify the sources and status of our island's fresh water
                    </li>
                    <li>
                      <strong>Skills:</strong> Determine the ways that you can help conserve and protect our local water
                      sources
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the importance of protecting our fresh water sources
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Human Impact on Environment
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain the impact of human activity on the natural environment
                    </li>
                    <li>
                      <strong>Skills:</strong> Gather information from multiple sources to explain the impact of human
                      activity on the natural environment
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that we can reduce the negative effects of human activity on
                      our natural environment
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-green-700">Observations:</strong> Observe students during map work, field
                  trips, group activities, and hands-on demonstrations
                </li>
                <li>
                  <strong className="text-green-700">Conversations:</strong> Class discussions, brainstorming sessions,
                  think-pair-share activities, interviews with community members
                </li>
                <li>
                  <strong className="text-green-700">Products:</strong> Maps, charts, models, posters, journals,
                  presentations, brochures, concept maps
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
                <h4 className="font-semibold mb-2 text-green-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for field trips and group work</li>
                  <li>Rubrics for evaluating map work and presentations</li>
                  <li>Self-assessment forms for project contributions</li>
                  <li>Peer assessment for collaborative activities</li>
                  <li>Exit slips for checking understanding of key concepts</li>
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
                  <AccordionTrigger>Island Location & Mapping</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Treasure Hunt:</strong> Students work in teams to find different types of maps using
                        relative location clues
                      </li>
                      <li>
                        <strong>Map Comparison:</strong> Students observe and compare political and physical maps of
                        their country
                      </li>
                      <li>
                        <strong>Map Element Exploration:</strong> Students identify common elements of maps through
                        guided observation
                      </li>
                      <li>
                        <strong>Video Learning:</strong> Students watch videos about latitude and longitude
                      </li>
                      <li>
                        <strong>Kinesthetic Learning:</strong> Students use hand gestures to demonstrate latitude and
                        longitude
                      </li>
                      <li>
                        <strong>Globe Exploration:</strong> Students identify main lines of latitude and longitude on a
                        globe or Google Earth
                      </li>
                      <li>
                        <strong>Model Creation:</strong> Students create models of the Earth showing lines of latitude
                        and longitude
                      </li>
                      <li>
                        <strong>Coordinate Location:</strong> Students locate their island using coordinates and
                        describe its position relative to the Equator and Prime Meridian
                      </li>
                      <li>
                        <strong>Island Hopping Bingo:</strong> Students locate Caribbean islands using coordinates
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Geographic Divisions & Features</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Map Creation:</strong> Students create textured, dimensional maps of their country
                        showing geographic divisions
                      </li>
                      <li>
                        <strong>Google Maps/Atlas Exploration:</strong> Students identify geographic divisions in their
                        country
                      </li>
                      <li>
                        <strong>Puzzle Map Activity:</strong> Students create floor maps of their island using puzzle
                        pieces with geographic clues
                      </li>
                      <li>
                        <strong>Critical Thinking Discussion:</strong> Students discuss the necessity and changes of
                        geographic divisions
                      </li>
                      <li>
                        <strong>Resource Person:</strong> A guest speaker discusses geographic divisions and their
                        changes over time
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students tour parts of the country to observe different geographic
                        divisions
                      </li>
                      <li>
                        <strong>Creative Writing:</strong> Students write stories about traveling through different
                        geographic divisions
                      </li>
                      <li>
                        <strong>Gallery Walk:</strong> Students observe various physical and natural features through
                        pictures
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students visit natural features to observe and gather information
                      </li>
                      <li>
                        <strong>Exhibition:</strong> Students create and present models of their favorite physical
                        natural features
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Climate & Weather</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Inquiry Thinking:</strong> Students compare weather patterns in their country to other
                        countries
                      </li>
                      <li>
                        <strong>Video and Discussion:</strong> Students learn about climate and climatic zones through
                        videos
                      </li>
                      <li>
                        <strong>Map Skills:</strong> Students locate their island and its climatic zone using maps or
                        Google Earth
                      </li>
                      <li>
                        <strong>Elder Interviews:</strong> Students interview elderly community members about climate
                        changes
                      </li>
                      <li>
                        <strong>Data Collection and Analysis:</strong> Students create bar graphs showing climate change
                        information
                      </li>
                      <li>
                        <strong>Climate Prediction:</strong> Students role-play as elderly people predicting climate in
                        fifty years
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students visit areas affected by climate change and document
                        changes
                      </li>
                      <li>
                        <strong>Resource Person:</strong> An expert speaks about climate changes in the country
                      </li>
                      <li>
                        <strong>Group Work:</strong> Students discuss and identify risks associated with climate change
                      </li>
                      <li>
                        <strong>Climate Awareness:</strong> Students create materials to raise awareness about climate
                        risks
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Weather Events & Emergency Preparedness</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Video Analysis:</strong> Students watch videos of significant weather events
                      </li>
                      <li>
                        <strong>Concept Mapping:</strong> Students create webs showing how weather events impact the
                        environment
                      </li>
                      <li>
                        <strong>Virtual Field Trip:</strong> Students observe effects of weather events on man-made
                        features
                      </li>
                      <li>
                        <strong>Community Member Stories:</strong> Local people share experiences of severe weather
                        events
                      </li>
                      <li>
                        <strong>Project Presentation:</strong> Students create projects showing weather impacts on built
                        environments
                      </li>
                      <li>
                        <strong>Scenario Discussion:</strong> Students discuss what to do in emergency weather
                        situations
                      </li>
                      <li>
                        <strong>Emergency Plan Creation:</strong> Students develop family emergency plans
                      </li>
                      <li>
                        <strong>Communication Plan:</strong> Students learn about and create emergency communication
                        plans
                      </li>
                      <li>
                        <strong>Emergency Kit Assembly:</strong> Students learn what goes into an emergency kit
                      </li>
                      <li>
                        <strong>Property Inspection:</strong> Students discuss the importance of property inspections
                        before emergencies
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-5">
                  <AccordionTrigger>Natural Reserves & Fresh Water</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Video Viewing:</strong> Students watch videos defining nature reserves
                      </li>
                      <li>
                        <strong>Mapping:</strong> Students locate natural reserves/parklands on maps
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students visit natural reserves to observe features and
                        characteristics
                      </li>
                      <li>
                        <strong>Descriptive Writing:</strong> Students write essays or poems about natural reserves
                      </li>
                      <li>
                        <strong>Model Creation:</strong> Students create 3D models of natural reserves
                      </li>
                      <li>
                        <strong>Discussion:</strong> Students discuss the importance of protecting natural reserves
                      </li>
                      <li>
                        <strong>Resource Person:</strong> An expert speaks about protecting natural reserves
                      </li>
                      <li>
                        <strong>Sign Creation:</strong> Students create signs with precautionary measures for nature
                        reserves
                      </li>
                      <li>
                        <strong>Water Experiment:</strong> Students compare fresh and salt water
                      </li>
                      <li>
                        <strong>Fresh Water Source Identification:</strong> Students identify sources of fresh water
                      </li>
                      <li>
                        <strong>Map Work:</strong> Students locate fresh water sources on maps
                      </li>
                      <li>
                        <strong>Water Conservation:</strong> Students learn and practice water conservation techniques
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-6">
                  <AccordionTrigger>Human Impact on Environment</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Gallery Walk:</strong> Students observe pictures of human activities impacting the
                        environment
                      </li>
                      <li>
                        <strong>Discussion:</strong> Students discuss the difference between natural and man-made
                        features
                      </li>
                      <li>
                        <strong>Chart Creation:</strong> Students create charts grouping human activities as having
                        positive or negative impacts
                      </li>
                      <li>
                        <strong>Data Collection:</strong> Students gather information from multiple sources on human
                        environmental impact
                      </li>
                      <li>
                        <strong>Poster Creation:</strong> Students create posters illustrating human impact on the
                        environment
                      </li>
                      <li>
                        <strong>Research Project:</strong> Students research specific human activities impacting the
                        environment
                      </li>
                      <li>
                        <strong>Scavenger Hunt:</strong> Students search for examples of human impact on the environment
                      </li>
                      <li>
                        <strong>Eco-friendly Invention:</strong> Students design inventions to reduce environmental
                        impact
                      </li>
                      <li>
                        <strong>Trash Collection:</strong> Students organize trash collection activities
                      </li>
                      <li>
                        <strong>Tree Planting:</strong> Students participate in tree planting activities
                      </li>
                      <li>
                        <strong>Nature Walk:</strong> Students observe the natural environment and human impacts
                      </li>
                      <li>
                        <strong>Recycling Campaign:</strong> Students organize recycling drives or campaigns
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
                <li>Videos on map elements and coordinate systems</li>
                <li>Interactive maps and globes</li>
                <li>Google Earth and digital mapping tools</li>
                <li>Videos on climate and climate change</li>
                <li>Documentaries on weather events and natural disasters</li>
                <li>Videos on natural reserves and fresh water sources</li>
                <li>
                  <a
                    href="https://youtu.be/pzr5x2cLljg?si=GpyzJs7Pf81IEM7X"
                    className="text-teal-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tips for effective group work in the classroom
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtu.be/rWq8nhocU5M?si=W1URGbN8fsNXVckC"
                    className="text-teal-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    How to use Google Earth in the Classroom
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Atlases and physical maps</li>
                <li>Globes and compass roses</li>
                <li>Art supplies for map creation</li>
                <li>Materials for model building</li>
                <li>Field trip observation sheets</li>
                <li>Water testing kits</li>
                <li>Materials for emergency kits</li>
                <li>Recycled materials for eco-friendly projects</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Maps are essential tools for locating places. We can locate places using cardinal directions (main and
              intermediate) and latitude and longitude. Latitude lines (parallels) run east-west, with the Equator at 0
              degrees dividing the Earth into northern and southern hemispheres. Longitude lines (meridians) run
              north-south, with the Prime Meridian at 0 degrees.
            </p>
            <p className="mb-2">
              All countries are divided into smaller segments for administrative purposes. In the Caribbean, these
              geographic divisions were done mainly for administrative control of settlers and slaves. Most are
              demarcated by physical features like rivers or ravines. Boundaries may change over time due to factors
              like depopulation.
            </p>
            <p className="mb-2">
              Climate refers to the typical weather conditions in a region over a long period. Climate change is a
              long-term change in weather patterns, largely caused by human activities releasing greenhouse gases. This
              can lead to problems like melting ice, rising sea levels, and changes in weather patterns.
            </p>
            <p className="mb-2">
              A natural reserve is a protected area for plants, animals, and other living things. They are important for
              keeping plants and animals safe, maintaining biodiversity, providing clean air and water, and offering
              educational and recreational opportunities.
            </p>
            <p>
              Freshwater sources are natural sources of water with low levels of dissolved salts and minerals, found in
              rivers, lakes, and underground aquifers. They are essential for human life, agriculture, and ecosystems
              but can be affected by pollution and climate change.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
