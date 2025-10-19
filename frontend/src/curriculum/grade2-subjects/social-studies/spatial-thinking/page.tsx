import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Map, ClipboardCheck } from 'lucide-react'

export default function SpatialThinkingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <Map className="mr-2 h-7 w-7 text-green-600" />
            Spatial Thinking
          </h1>
          <p className="text-gray-700">
            In Grade 2, students develop an understanding that islands are made up of many diverse regions and communities. 
            They learn about cardinal directions, mapping, features of communities, plants and animals, weather patterns,
            and the environment as a resource. This knowledge helps students understand their physical surroundings and
            their relationship to the natural world.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Spatial Thinking
        </h3>

        <Tabs defaultValue="location">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger value="location" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Location & Features
            </TabsTrigger>
            <TabsTrigger
              value="environment"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Plants & Weather
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Resources & Environment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Community Location and Features</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>State the four cardinal directions</li>
              <li>Give directions to your community in relation to other districts or parishes using cardinal direction</li>
              <li>Recognize the value of directions for finding your way</li>
              <li>Describe the important natural and built features of your community</li>
              <li>Observe and illustrate the various natural and built features of your community</li>
              <li>Appreciate the unique landmark features of your community that you find interesting</li>
              <li>Identify the basic features of a map including title, key, compass rose, border</li>
              <li>Draw a map of your community which includes basic features</li>
              <li>Appreciate that a map can be used to show our important landmarks in the community</li>
            </ul>
          </TabsContent>

          <TabsContent value="environment" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Plants, Animals, and Weather</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify some of the plants and animals in your community</li>
              <li>Classify the plants and animals according to wild, domestic and uses such as food, medicine, pets</li>
              <li>Demonstrate willingness to care for/protect the plants and animals in our community</li>
              <li>Describe weather patterns in your community</li>
              <li>Assess the impact of weather conditions on the community at different times of the year</li>
              <li>Appreciate how the weather affects the environment</li>
            </ul>
          </TabsContent>

          <TabsContent value="resources" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 3: Environmental Resources</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the environment as a resource</li>
              <li>Investigate how resources found in the environment are useful to us</li>
              <li>Value the importance of the local environment and its link to human survival</li>
              <li>Identify ways in which people harm the environment</li>
              <li>Gather information on the ways we harm and protect our environment</li>
              <li>Appreciate each other's role in caring for the environment</li>
            </ul>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Locating My Community
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> State and label the four cardinal directions</li>
                    <li><strong>Skills:</strong> Give directions to your community in relation to other districts or parishes using cardinal direction</li>
                    <li><strong>Values:</strong> Appreciate the value of directions for finding your way</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Features of My Community
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Describe the important natural and built features of your community</li>
                    <li><strong>Skills:</strong> Observe and illustrate the various natural and built features of your community</li>
                    <li><strong>Values:</strong> Appreciate the unique landmark features of your community that you find interesting</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Maps and Community
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Identify the basic features of a map including title, key, compass rose, border</li>
                    <li><strong>Skills:</strong> Draw a map of your community which includes basic features</li>
                    <li><strong>Values:</strong> Appreciate that a map can be used to show our important landmarks in the community</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Plants and Animals
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Identify some of the plants and animals in your community</li>
                    <li><strong>Skills:</strong> Classify the plants and animals according to wild, domestic, food or pets</li>
                    <li><strong>Values:</strong> Appreciate the importance of caring for/protecting the plants and animals in our community</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Weather
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Describe weather patterns in your community</li>
                    <li><strong>Skills:</strong> Assess the impact of weather conditions on the community at different times of the year</li>
                    <li><strong>Values:</strong> Appreciate how the weather affects the environment</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Environmental Resources
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Identify the environment as a resource</li>
                    <li><strong>Skills:</strong> Investigate how resources found in the local environment are useful to us</li>
                    <li><strong>Values:</strong> Value the importance of the local environment and its link to human survival</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Caring for the Environment
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Identify ways in which people harm the environment</li>
                    <li><strong>Skills:</strong> Gather information on the ways we harm and protect our environment</li>
                    <li><strong>Values:</strong> Appreciate each other's role in caring for the environment</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-emerald-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-emerald-700">Observations:</strong> Observing students during compass activities, map creation, plant identification, and community walks
                </li>
                <li>
                  <strong className="text-emerald-700">Conversations:</strong> Class discussions, critical thinking questions, guided discussions, student reflections
                </li>
                <li>
                  <strong className="text-emerald-700">Products:</strong> Maps, portfolios, drawings, lap books, weather logs, collages, models
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                <h4 className="font-semibold mb-2 text-emerald-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Compass rose model creation and accuracy assessment</li>
                  <li>Weather log completion and analysis</li>
                  <li>Map feature identification checklists</li>
                  <li>Plant and animal classification activities</li>
                  <li>Community feature identification during field trips</li>
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
                  <AccordionTrigger>Cardinal Directions and Community Location</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Portfolio Activity:</strong> Students create lap books/portfolios with a chapter on "The Cardinal Points."
                      </li>
                      <li>
                        <strong>Group Work:</strong> Students create songs/poems/mnemonics to recall the four main cardinal directions.
                      </li>
                      <li>
                        <strong>Compass Activity:</strong> Students use compasses to explore various positions to locate north, south, west, and east.
                      </li>
                      <li>
                        <strong>Floor Map Activity:</strong> Students identify districts/parishes in the cardinal directions using a floor map.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Maps and Community Features</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Video and Guided Discussion:</strong> Students view videos about features in the environment and discuss the differences between natural and built features.
                      </li>
                      <li>
                        <strong>Classifying Information:</strong> Students classify examples as either built/man-made or natural features.
                      </li>
                      <li>
                        <strong>Lap Book Activity:</strong> Students create chapter two of their lap books titled "Features of My Community."
                      </li>
                      <li>
                        <strong>Map Making:</strong> Students draw maps of their community with a title, key, border, and compass rose.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Plants and Animals</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>School Tour:</strong> Students walk around the school compound to observe various plants.
                      </li>
                      <li>
                        <strong>Lap Book Activity:</strong> Students create chapters in their lap books for "Animals in My Community" and "Plants in My Community."
                      </li>
                      <li>
                        <strong>Role Play:</strong> Students role play the sounds and movements of animals found in the community.
                      </li>
                      <li>
                        <strong>Resource Person:</strong> A resource person speaks to students about plants in their country and their uses.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Weather and Environmental Resources</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Weather Log:</strong> Students observe and record the weather for several days in a weather log.
                      </li>
                      <li>
                        <strong>Collage Creation:</strong> Students create a collage showing the ways people harm the environment.
                      </li>
                      <li>
                        <strong>Resource Person:</strong> An environmental officer speaks to students about protecting the environment.
                      </li>
                      <li>
                        <strong>Jingle Creation:</strong> Students create jingles to encourage others to protect the environment.
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
              <h3 className="font-semibold mb-2">For Teachers</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Maps and atlases of the country</li>
                <li>Compasses or compass apps</li>
                <li>Pictures of natural and built features</li>
                <li>Books and videos about plants, animals, and weather</li>
                <li>Materials for lap books, charts, and models</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Large drawing books or Bristol board for lap books</li>
                <li>Weather log templates</li>
                <li>Art materials for mapping and model construction</li>
                <li>Digital devices for recording observations</li>
                <li>Plant identifier apps (when available)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              <strong>Cardinal Directions:</strong> Direction is the pathway along which an object is moving or the location of a feature based on the position of another feature. Cardinal directions are the four main points of a compass: north, south, east, and west which are also known by the first letters: N, S, E, and W.
            </p>
            <p className="mb-2">
              <strong>Maps:</strong> A compass rose is a symbol found on maps that shows the four cardinal directions. Cardinal directions help identify the location of one thing or place in relation to another, known as relative location.
            </p>
            <p className="mb-2">
              <strong>Environment as Resource:</strong> Resources are any materials in the environment or skills and abilities that can be used to satisfy needs and wants. They include natural resources (from nature), man-made resources (made by humans), and human resources (skills and talents people use).
            </p>
            <p>
              <strong>Weather:</strong> Weather refers to the atmospheric conditions in a place over a short period of time. Weather patterns are the recurring atmospheric conditions observed over time. Weather affects the environment by influencing soil conditions, plant growth, animal behavior, and water availability.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
