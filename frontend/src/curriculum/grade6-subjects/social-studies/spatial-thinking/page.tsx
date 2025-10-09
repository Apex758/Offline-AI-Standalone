import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function SpatialThinkingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade6-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <MapPin className="mr-2 h-7 w-7 text-green-600" />
            Spatial Thinking
          </h1>
          <p className="text-gray-700">
            This strand helps students appreciate that the Caribbean has diverse geography that poses challenges and
            opportunities. Students explore world geography, climatic regions, human adaptation to different
            environments, and how extreme weather conditions require technological adaptations for survival and
            development.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Spatial Thinking
        </h3>

        <Tabs defaultValue="geography">
          <TabsList className="grid w-full grid-cols-4 bg-green-100">
            <TabsTrigger value="geography" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              World Geography
            </TabsTrigger>
            <TabsTrigger value="climate" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Climatic Regions
            </TabsTrigger>
            <TabsTrigger value="adaptation" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Human Adaptation
            </TabsTrigger>
            <TabsTrigger value="extreme" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Extreme Weather
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geography" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: World Geography Understanding</h4>
            <p className="mb-3">
              To appreciate that the Caribbean has diverse geography and understand its place in the world.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Name the continents and major water bodies of the world</li>
              <li>Locate continents and oceans on maps and globes</li>
              <li>Recognize that continents are made up of different countries</li>
              <li>Understand the Caribbean's location relative to other regions</li>
              <li>Explore the relationship between geography and human settlement</li>
              <li>Identify major geographical features and their significance</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>What features are seen on Earth from space?</p>
              <p>Why is the Earth called the Blue Planet?</p>
              <p>Why are continents divided into countries?</p>
            </div>
          </TabsContent>

          <TabsContent value="climate" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Global Climatic Regions</h4>
            <p className="mb-3">To understand the world's climatic zones and their unique characteristics.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify tropical, temperate, and polar climatic regions</li>
              <li>Describe physical characteristics of different climate zones</li>
              <li>Illustrate how other regions compare to the Caribbean</li>
              <li>Appreciate that all regions have unique natural features</li>
              <li>Understand how climate affects ecosystems and biodiversity</li>
              <li>Explore the relationship between latitude and climate</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>What are the global climatic zones?</p>
              <p>How are climatic zones unique?</p>
              <p>What physical features are unique to various climatic zones?</p>
            </div>
          </TabsContent>

          <TabsContent value="adaptation" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Human Adaptation to Climate</h4>
            <p className="mb-3">To understand how people adapt their lifestyles to different climatic conditions.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe how people live in various regions (housing, clothing, agriculture)</li>
              <li>Analyze advantages and disadvantages of living in different regions</li>
              <li>Appreciate that regions have unique features determining lifestyle</li>
              <li>Understand how climate influences transportation and social life</li>
              <li>Explore sustainable living practices in different climates</li>
              <li>Compare lifestyle adaptations across climatic regions</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>How do people adapt housing, clothing, and agriculture to climate?</p>
              <p>What are advantages and disadvantages of living in different regions?</p>
              <p>How do unique features influence lifestyle and cultural practices?</p>
            </div>
          </TabsContent>

          <TabsContent value="extreme" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Extreme Weather Management</h4>
            <p className="mb-3">
              To understand how extreme climatic conditions are managed and their impact on communities.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe extreme climatic conditions and how they are managed</li>
              <li>Analyze the impact of extreme weather on people and environment</li>
              <li>Appreciate technological adaptations for food, shelter, and transportation</li>
              <li>Understand disaster preparedness and response strategies</li>
              <li>Explore how communities build resilience to extreme weather</li>
              <li>Investigate climate change and its global implications</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
              <h5 className="font-medium text-green-700">Focus Questions:</h5>
              <p>How do severe climatic conditions impact people's lives?</p>
              <p>What technologies help people adapt to extreme weather?</p>
              <p>How can communities prepare for and respond to natural disasters?</p>
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
            <CardDescription>By the end of Grade Six, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  World Geography Knowledge
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Name continents, oceans, and understand country divisions
                    </li>
                    <li>
                      <strong>Skills:</strong> Locate geographical features on maps and globes
                    </li>
                    <li>
                      <strong>Values:</strong> Recognize the Caribbean's place in the global context
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Climatic Region Understanding
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify and describe tropical, temperate, and polar regions
                    </li>
                    <li>
                      <strong>Skills:</strong> Illustrate regional comparisons and unique features
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate natural diversity across climatic zones
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Human Adaptation Analysis
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe lifestyle adaptations to different climates
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze advantages and disadvantages of regional living
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate how geography shapes human culture
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Extreme Weather Response
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe extreme weather conditions and management
                    </li>
                    <li>
                      <strong>Skills:</strong> Analyze impacts and technological adaptations
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate human resilience and innovation
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
                  <strong className="text-teal-700">Observations:</strong> Monitor map work, climate simulations, and
                  adaptation projects
                </li>
                <li>
                  <strong className="text-teal-700">Conversations:</strong> Geographic discussions, climate comparisons,
                  adaptation strategies
                </li>
                <li>
                  <strong className="text-teal-700">Products:</strong> World maps, climate charts, adaptation models,
                  weather reports
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-100">
                <h4 className="font-semibold mb-2 text-teal-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Geographic knowledge assessment rubrics</li>
                  <li>Climate comparison project criteria</li>
                  <li>Adaptation model evaluation guides</li>
                  <li>Weather simulation participation checklists</li>
                  <li>Collaborative mapping assessment tools</li>
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
                  <AccordionTrigger>World Geography Exploration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Globe Activities:</strong> Students explore Earth's features using inflatable globes
                      </li>
                      <li>
                        <strong>Continent Puzzles:</strong> Students create and assemble continent maps
                      </li>
                      <li>
                        <strong>Ocean Exploration:</strong> Students learn about major water bodies and their
                        significance
                      </li>
                      <li>
                        <strong>Country Mapping:</strong> Students identify and locate countries within continents
                      </li>
                      <li>
                        <strong>Caribbean Positioning:</strong> Students understand the Caribbean's global location
                      </li>
                      <li>
                        <strong>3D Earth Models:</strong> Students create models showing continents and oceans
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Climate Zone Studies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Climate Mapping:</strong> Students color-code world maps by climate zones
                      </li>
                      <li>
                        <strong>Ecosystem Research:</strong> Students investigate unique features of each zone
                      </li>
                      <li>
                        <strong>Virtual Field Trips:</strong> Students explore different climatic regions online
                      </li>
                      <li>
                        <strong>Climate Comparisons:</strong> Students create charts comparing regional characteristics
                      </li>
                      <li>
                        <strong>Biodiversity Studies:</strong> Students explore how climate affects plant and animal
                        life
                      </li>
                      <li>
                        <strong>Weather Pattern Analysis:</strong> Students track and compare global weather data
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Human Adaptation Projects</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Housing Design:</strong> Students design climate-appropriate housing models
                      </li>
                      <li>
                        <strong>Clothing Studies:</strong> Students explore how climate influences clothing choices
                      </li>
                      <li>
                        <strong>Agriculture Research:</strong> Students investigate farming practices in different
                        climates
                      </li>
                      <li>
                        <strong>Transportation Analysis:</strong> Students compare transportation methods across regions
                      </li>
                      <li>
                        <strong>Lifestyle Comparisons:</strong> Students create presentations on regional lifestyles
                      </li>
                      <li>
                        <strong>Sustainable City Design:</strong> Students plan cities adapted to specific climates
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Extreme Weather Management</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Weather Simulations:</strong> Students experience different extreme weather conditions
                      </li>
                      <li>
                        <strong>Survival Guides:</strong> Students create guides for managing extreme weather
                      </li>
                      <li>
                        <strong>Case Study Analysis:</strong> Students examine real extreme weather events
                      </li>
                      <li>
                        <strong>Technology Research:</strong> Students investigate adaptations for extreme conditions
                      </li>
                      <li>
                        <strong>Disaster Preparedness:</strong> Students develop emergency response plans
                      </li>
                      <li>
                        <strong>Innovation Projects:</strong> Students design solutions for climate challenges
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
                <li>Interactive world maps and Google Earth</li>
                <li>Climate zone educational videos</li>
                <li>Virtual reality climate experiences</li>
                <li>Weather simulation software</li>
                <li>Geographic information systems (GIS)</li>
                <li>Climate change documentaries</li>
                <li>Extreme weather case study databases</li>
                <li>Adaptation technology showcases</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>World globes and atlases</li>
                <li>Climate zone maps and charts</li>
                <li>Weather measurement instruments</li>
                <li>Building materials for housing models</li>
                <li>Cultural clothing samples</li>
                <li>Agricultural product samples</li>
                <li>Extreme weather simulation materials</li>
                <li>Geographic puzzle sets</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Earth consists of seven continents (Asia, Africa, North America, South America, Antarctica, Europe,
              Australia) and five oceans (Pacific, Atlantic, Indian, Arctic, Southern). The Caribbean is located between
              North and South America, surrounded by the Atlantic Ocean and Caribbean Sea. Understanding this geographic
              context helps students appreciate the region's strategic location and cultural connections.
            </p>
            <p className="mb-2">
              The world's three main climatic zones are tropical (hot year-round), temperate (moderate temperatures with
              seasons), and polar (cold year-round). Each zone has unique ecosystems, weather patterns, and challenges.
              The Caribbean is primarily tropical, which influences everything from agriculture to architecture to
              cultural practices.
            </p>
            <p>
              Human adaptation to climate involves modifications in housing (stilts in flood-prone areas, thick walls in
              cold regions), clothing (light fabrics in hot climates, layers in cold areas), agriculture
              (drought-resistant crops, greenhouse farming), and transportation (snow vehicles, boats for island
              communities). Understanding these adaptations helps students appreciate human ingenuity and cultural
              diversity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
