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
            <Link href="/curriculum/grade5-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-emerald-700 flex items-center">
            <Map className="mr-2 h-7 w-7 text-emerald-600" />
            Spatial Thinking
          </h1>
          <p className="text-gray-700">
            This strand develops students' understanding of Caribbean geography, including the classification of
            islands, geological formations, climate patterns, and natural landmarks. Students explore the relationship
            between geography and human settlement, and learn to analyze spatial relationships within the Caribbean
            region.
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-emerald-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Spatial Thinking
        </h3>

        <Tabs defaultValue="classification">
          <TabsList className="grid w-full grid-cols-4 bg-emerald-100">
            <TabsTrigger
              value="classification"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Island Classification
            </TabsTrigger>
            <TabsTrigger
              value="formations"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Geological Formations
            </TabsTrigger>
            <TabsTrigger
              value="landmarks"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Natural Landmarks
            </TabsTrigger>
            <TabsTrigger value="climate" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Climate & Weather
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classification" className="p-4 border rounded-md mt-2 bg-emerald-50 border-emerald-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Caribbean Island Classification</h4>
            <p className="mb-3">
              To understand how Caribbean islands are classified and the geographical relationships between different
              island groups.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Distinguish between Greater Antilles and Lesser Antilles</li>
              <li>Identify Windward and Leeward Islands within the Lesser Antilles</li>
              <li>Locate major Caribbean islands on maps</li>
              <li>Understand the geographical significance of island positioning</li>
              <li>Explore the relationship between island size and population</li>
              <li>Analyze trade wind patterns and their effect on island classification</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-emerald-100">
              <h5 className="font-medium text-emerald-700">Focus Questions:</h5>
              <p>What is the difference between Greater Antilles and Lesser Antilles?</p>
              <p>Why are some islands called Windward and others Leeward?</p>
              <p>How does an island's location affect its climate and culture?</p>
              <p>What patterns can we see in how Caribbean islands are arranged?</p>
            </div>
          </TabsContent>

          <TabsContent value="formations" className="p-4 border rounded-md mt-2 bg-emerald-50 border-emerald-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Volcanic vs Coral Island Formations</h4>
            <p className="mb-3">
              To compare and contrast volcanic and coral island formations and understand their impact on human
              settlement.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify characteristics of volcanic islands</li>
              <li>Recognize features of coral islands and atolls</li>
              <li>Compare soil fertility between volcanic and coral islands</li>
              <li>Understand how island formation affects agriculture</li>
              <li>Explore the relationship between geology and natural resources</li>
              <li>Analyze how island type influences settlement patterns</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-emerald-100">
              <h5 className="font-medium text-emerald-700">Focus Questions:</h5>
              <p>How are volcanic islands different from coral islands?</p>
              <p>Why do volcanic islands often have better soil for farming?</p>
              <p>What challenges do people face living on different types of islands?</p>
              <p>How does the way an island was formed affect what grows there?</p>
            </div>
          </TabsContent>

          <TabsContent value="landmarks" className="p-4 border rounded-md mt-2 bg-emerald-50 border-emerald-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Natural Landmarks and Features</h4>
            <p className="mb-3">
              To identify and appreciate significant natural landmarks across the Caribbean region.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Locate major mountains, valleys, and coastal features</li>
              <li>Identify important rivers, lakes, and water bodies</li>
              <li>Recognize unique geological formations</li>
              <li>Understand the cultural significance of natural landmarks</li>
              <li>Explore how landmarks influence tourism and economy</li>
              <li>Appreciate the biodiversity of Caribbean ecosystems</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-emerald-100">
              <h5 className="font-medium text-emerald-700">Focus Questions:</h5>
              <p>What are some famous natural landmarks in the Caribbean?</p>
              <p>How do natural features affect where people live and work?</p>
              <p>Why are some natural areas protected as national parks?</p>
              <p>How do landmarks help define a country's identity?</p>
            </div>
          </TabsContent>

          <TabsContent value="climate" className="p-4 border rounded-md mt-2 bg-emerald-50 border-emerald-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Climate Patterns and Severe Weather</h4>
            <p className="mb-3">
              To understand Caribbean climate patterns and the impact of severe weather events on the region.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe the tropical climate characteristics of the Caribbean</li>
              <li>Understand seasonal weather patterns including wet and dry seasons</li>
              <li>Identify the hurricane season and its impacts</li>
              <li>Explore how climate affects agriculture and daily life</li>
              <li>Understand climate change effects on small island states</li>
              <li>Learn about disaster preparedness and response</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-emerald-100">
              <h5 className="font-medium text-emerald-700">Focus Questions:</h5>
              <p>What makes the Caribbean climate tropical?</p>
              <p>How do hurricanes form and why do they affect the Caribbean?</p>
              <p>What can communities do to prepare for severe weather?</p>
              <p>How is climate change affecting Caribbean islands?</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-emerald-50">
            <CardTitle className="text-emerald-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-emerald-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-emerald-50 px-4 py-2 rounded-md">
                  Caribbean Island Classification
                </AccordionTrigger>
                <AccordionContent className="bg-emerald-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Distinguish between Greater Antilles, Lesser Antilles, Windward and
                      Leeward Islands
                    </li>
                    <li>
                      <strong>Skills:</strong> Create detailed maps showing Caribbean island classifications
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the geographical diversity of the Caribbean region
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-emerald-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-emerald-50 px-4 py-2 rounded-md">
                  Volcanic vs Coral Formations
                </AccordionTrigger>
                <AccordionContent className="bg-emerald-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Compare and contrast volcanic and coral island formations
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze how geological formation affects human settlement
                    </li>
                    <li>
                      <strong>Values:</strong> Value the unique geological heritage of Caribbean islands
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-emerald-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-emerald-50 px-4 py-2 rounded-md">
                  Natural Landmarks
                </AccordionTrigger>
                <AccordionContent className="bg-emerald-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify significant natural landmarks across the Caribbean
                    </li>
                    <li>
                      <strong>Skills:</strong> Research and present on landmark significance
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the natural beauty and cultural importance of landmarks
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-emerald-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-emerald-50 px-4 py-2 rounded-md">
                  Climate and Weather Patterns
                </AccordionTrigger>
                <AccordionContent className="bg-emerald-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Understand Caribbean climate patterns and severe weather events
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze weather data and create climate graphs
                    </li>
                    <li>
                      <strong>Values:</strong> Recognize the importance of climate adaptation and preparedness
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
                  <strong className="text-teal-700">Observations:</strong> Monitor map-reading skills, spatial
                  reasoning, and geographical analysis
                </li>
                <li>
                  <strong className="text-teal-700">Conversations:</strong> Geographic discussions, field trip
                  reflections, weather pattern analysis
                </li>
                <li>
                  <strong className="text-teal-700">Products:</strong> Maps, models, weather charts, landmark research
                  projects, geographical presentations
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg border border-teal-100">
                <h4 className="font-semibold mb-2 text-teal-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Map skills assessment rubrics</li>
                  <li>Geographical knowledge quizzes</li>
                  <li>Model-making evaluation criteria</li>
                  <li>Research project assessment guides</li>
                  <li>Spatial thinking skill checklists</li>
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
                  <AccordionTrigger>Island Classification Activities</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Map Puzzles:</strong> Students assemble Caribbean map puzzles by island groups
                      </li>
                      <li>
                        <strong>Island Sorting:</strong> Students categorize islands using various classification
                        systems
                      </li>
                      <li>
                        <strong>Virtual Tours:</strong> Students take online tours of different Caribbean islands
                      </li>
                      <li>
                        <strong>Comparison Charts:</strong> Students create charts comparing island characteristics
                      </li>
                      <li>
                        <strong>Geography Games:</strong> Students play location-based games and quizzes
                      </li>
                      <li>
                        <strong>3D Mapping:</strong> Students create relief maps showing island relationships
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Geological Formation Studies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Model Building:</strong> Students create models of volcanic and coral islands
                      </li>
                      <li>
                        <strong>Soil Comparison:</strong> Students examine soil samples from different island types
                      </li>
                      <li>
                        <strong>Formation Simulations:</strong> Students simulate volcanic and coral formation processes
                      </li>
                      <li>
                        <strong>Cross-Section Drawings:</strong> Students draw geological cross-sections of islands
                      </li>
                      <li>
                        <strong>Rock and Mineral Study:</strong> Students identify rocks from different formations
                      </li>
                      <li>
                        <strong>Time-lapse Videos:</strong> Students watch geological formation documentaries
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Natural Landmarks Exploration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Virtual Field Trips:</strong> Students explore Caribbean landmarks online
                      </li>
                      <li>
                        <strong>Landmark Research:</strong> Students research and present on specific landmarks
                      </li>
                      <li>
                        <strong>Photography Analysis:</strong> Students analyze landmark photographs for features
                      </li>
                      <li>
                        <strong>Tourism Brochures:</strong> Students create brochures promoting natural landmarks
                      </li>
                      <li>
                        <strong>Conservation Projects:</strong> Students design landmark protection plans
                      </li>
                      <li>
                        <strong>Cultural Connections:</strong> Students explore landmark significance to local cultures
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Climate and Weather Studies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Weather Tracking:</strong> Students monitor and record daily weather patterns
                      </li>
                      <li>
                        <strong>Hurricane Simulation:</strong> Students model hurricane formation and movement
                      </li>
                      <li>
                        <strong>Climate Graphs:</strong> Students create and interpret climate data charts
                      </li>
                      <li>
                        <strong>Disaster Preparedness:</strong> Students develop emergency preparedness plans
                      </li>
                      <li>
                        <strong>Seasonal Calendars:</strong> Students create calendars showing seasonal changes
                      </li>
                      <li>
                        <strong>Climate Change Research:</strong> Students investigate climate change impacts
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
                <li>Interactive Caribbean maps and atlases</li>
                <li>Satellite imagery and aerial photographs</li>
                <li>Weather tracking websites and apps</li>
                <li>Virtual reality tours of Caribbean landmarks</li>
                <li>Geological formation videos and animations</li>
                <li>Climate data visualization tools</li>
                <li>Hurricane tracking and simulation software</li>
                <li>Online geography games and quizzes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Physical maps and globes</li>
                <li>Rock and mineral samples</li>
                <li>Weather measurement instruments</li>
                <li>Model-making materials (clay, foam, etc.)</li>
                <li>Topographic maps and charts</li>
                <li>Compass and navigation tools</li>
                <li>Soil samples from different islands</li>
                <li>Photography and documentation materials</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              The Caribbean islands are classified into the Greater Antilles (Cuba, Jamaica, Haiti/Dominican Republic,
              Puerto Rico) and Lesser Antilles. The Lesser Antilles are further divided into Windward Islands (facing
              prevailing trade winds) and Leeward Islands (sheltered from trade winds). This classification affects
              climate, vegetation, and human settlement patterns.
            </p>
            <p className="mb-2">
              Caribbean islands formed through two main processes: volcanic activity and coral growth. Volcanic islands
              like Dominica and St. Vincent have fertile soils and mountainous terrain, while coral islands like
              Barbados and the Bahamas have limestone foundations and flatter topography. These geological differences
              significantly impact agriculture, water resources, and economic development.
            </p>
            <p className="mb-2">
              The Caribbean's tropical climate is characterized by warm temperatures year-round, distinct wet and dry
              seasons, and vulnerability to hurricanes from June to November. Trade winds moderate temperatures and
              bring moisture, while the region's location in the hurricane belt makes it susceptible to severe weather
              events that can devastate communities and economies.
            </p>
            <p>
              Natural landmarks like Blue Mountain Peak in Jamaica, Mount Pelée in Martinique, and the Pitons in St.
              Lucia serve as important geographical reference points and tourist attractions. These features often hold
              cultural and spiritual significance for local communities and contribute to national identity and economic
              development through tourism.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
