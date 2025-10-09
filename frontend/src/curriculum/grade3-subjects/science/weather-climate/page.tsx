import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Wind, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function WeatherClimatePage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Wind className="mr-2 h-7 w-7 text-purple-600" />
            Weather and Climate
          </h1>
          <p className="text-gray-700">
            In Grade 3, students learn to represent and analyze weather data, describe climates in different regions of
            the world, and design solutions to reduce the impacts of weather-related hazards. They explore how weather
            patterns affect human activities and the environment, developing an understanding of the difference between
            weather and climate and the factors that influence both.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Weather and Climate
        </h3>

        <Tabs defaultValue="patterns">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="patterns" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Weather Patterns
            </TabsTrigger>
            <TabsTrigger value="climate" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Climate Zones
            </TabsTrigger>
            <TabsTrigger value="hazards" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Weather Hazards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Represent data in tables and graphical displays to describe typical weather
              conditions expected during a particular season
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Collect and record weather data (temperature, precipitation, wind direction, etc.)</li>
              <li>Organize weather data in tables and charts</li>
              <li>Create graphical displays of weather data (bar graphs, pictographs, etc.)</li>
              <li>Analyze weather data to identify patterns and trends</li>
              <li>Describe typical weather conditions for each season in the local area</li>
              <li>Compare weather patterns across different seasons</li>
              <li>Use data to make predictions about future weather conditions</li>
            </ul>
          </TabsContent>

          <TabsContent value="climate" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Obtain and combine information to describe climates in different regions of
              the world
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Distinguish between weather and climate</li>
              <li>Identify the major climate zones of the world</li>
              <li>Research and describe the characteristics of different climate zones</li>
              <li>Compare and contrast climates in different regions</li>
              <li>Investigate how location affects climate (latitude, elevation, proximity to water)</li>
              <li>Analyze how climate influences plant and animal life in different regions</li>
              <li>Create visual representations of climate data for different regions</li>
            </ul>
          </TabsContent>

          <TabsContent value="hazards" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Make a claim about the merit of a design solution that reduces the impacts
              of a weather-related hazard
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify various weather-related hazards (floods, hurricanes, droughts, etc.)</li>
              <li>Investigate the impacts of weather-related hazards on communities</li>
              <li>Research and evaluate design solutions that reduce the impacts of weather hazards</li>
              <li>Design and test models of solutions to weather-related problems</li>
              <li>Evaluate the effectiveness of different design solutions</li>
              <li>Make evidence-based claims about the merit of specific solutions</li>
              <li>Communicate design solutions and their benefits</li>
            </ul>
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
                  Weather Data and Patterns
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and describe the components of weather (temperature, precipitation, wind, etc.)</li>
                    <li>Use appropriate tools to measure and record weather data</li>
                    <li>Collect and record weather data over time</li>
                    <li>Organize weather data in tables and charts</li>
                    <li>Create graphical displays of weather data (bar graphs, pictographs, etc.)</li>
                    <li>Analyze weather data to identify patterns and trends</li>
                    <li>Describe typical weather conditions for each season in the local area</li>
                    <li>Compare weather patterns across different seasons</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Climate Zones and Characteristics
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Distinguish between weather (short-term conditions) and climate (long-term patterns)</li>
                    <li>Identify the major climate zones of the world</li>
                    <li>Research and describe the characteristics of different climate zones</li>
                    <li>Compare and contrast climates in different regions</li>
                    <li>Investigate how location affects climate (latitude, elevation, proximity to water)</li>
                    <li>Analyze how climate influences plant and animal life in different regions</li>
                    <li>Create visual representations of climate data for different regions</li>
                    <li>Recognize the climate characteristics of their own region</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Weather Hazards and Solutions
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify various weather-related hazards (floods, hurricanes, droughts, etc.)</li>
                    <li>Investigate the impacts of weather-related hazards on communities</li>
                    <li>Research and evaluate design solutions that reduce the impacts of weather hazards</li>
                    <li>Design and test models of solutions to weather-related problems</li>
                    <li>Evaluate the effectiveness of different design solutions</li>
                    <li>Make evidence-based claims about the merit of specific solutions</li>
                    <li>Communicate design solutions and their benefits</li>
                    <li>Recognize the importance of preparation and planning for weather hazards</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Weather Forecasting and Prediction
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Investigate how meteorologists forecast weather</li>
                    <li>Identify the tools and technologies used in weather prediction</li>
                    <li>Use weather data to make simple predictions</li>
                    <li>Recognize weather patterns that indicate changes in weather</li>
                    <li>Analyze the importance of weather forecasting for daily activities</li>
                    <li>Explore how weather forecasts help communities prepare for severe weather</li>
                    <li>Create and interpret simple weather maps</li>
                    <li>Communicate weather predictions using appropriate vocabulary and symbols</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-purple-700">Observations:</strong> Teacher observations during weather data
                  collection, climate research, and design solution activities
                </li>
                <li>
                  <strong className="text-purple-700">Conversations:</strong> Student explanations of weather patterns,
                  climate characteristics, and design solution effectiveness
                </li>
                <li>
                  <strong className="text-purple-700">Products:</strong> Student work samples, including weather data
                  displays, climate zone maps, and design solution models
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                <h4 className="font-semibold mb-2 text-purple-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for data collection and analysis skills</li>
                  <li>Rubrics for evaluating weather data displays and design solutions</li>
                  <li>Performance tasks involving weather prediction and climate analysis</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Science journals for recording weather observations, data, and reflections</li>
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
                  <AccordionTrigger>Weather Data Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Weather Stations:</strong> Set up classroom weather stations where students can collect
                        and record daily weather data.
                      </li>
                      <li>
                        <strong>Data Visualization Activities:</strong> Guide students in creating various types of
                        graphs and charts to represent weather data.
                      </li>
                      <li>
                        <strong>Weather Journals:</strong> Have students maintain weather journals where they record
                        observations and data over time.
                      </li>
                      <li>
                        <strong>Pattern Recognition Activities:</strong> Engage students in activities that help them
                        identify and describe patterns in weather data.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Climate Zone Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Climate Zone Research:</strong> Have students research different climate zones and
                        create presentations or posters about their characteristics.
                      </li>
                      <li>
                        <strong>Climate Comparison Activities:</strong> Guide students in comparing and contrasting
                        climates in different regions using data and visual aids.
                      </li>
                      <li>
                        <strong>Climate Maps:</strong> Engage students in creating and interpreting maps that show
                        different climate zones around the world.
                      </li>
                      <li>
                        <strong>Climate and Adaptation Connections:</strong> Explore how plants and animals are adapted
                        to different climate zones.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Weather Hazard Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Hazard Case Studies:</strong> Examine real-world examples of weather-related hazards and
                        their impacts on communities.
                      </li>
                      <li>
                        <strong>Design Challenges:</strong> Present students with design challenges related to reducing
                        the impacts of specific weather hazards.
                      </li>
                      <li>
                        <strong>Model Testing:</strong> Guide students in building and testing models of their design
                        solutions.
                      </li>
                      <li>
                        <strong>Solution Evaluation:</strong> Engage students in evaluating different solutions based on
                        criteria such as effectiveness, cost, and feasibility.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Weather Forecasting Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Weather Map Interpretation:</strong> Provide opportunities for students to interpret
                        weather maps and symbols.
                      </li>
                      <li>
                        <strong>Forecasting Activities:</strong> Engage students in making simple weather predictions
                        based on data and observations.
                      </li>
                      <li>
                        <strong>Meteorologist Role-Play:</strong> Have students take on the role of meteorologists,
                        creating and presenting weather forecasts.
                      </li>
                      <li>
                        <strong>Technology Exploration:</strong> Investigate the tools and technologies used by
                        meteorologists to predict weather.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-5">
                  <AccordionTrigger>Differentiation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Visual Supports:</strong> Use visual aids, diagrams, and graphic organizers to support
                        students' understanding of weather and climate concepts.
                      </li>
                      <li>
                        <strong>Tiered Activities:</strong> Adjust the complexity of data collection, analysis, and
                        design activities based on students' readiness levels.
                      </li>
                      <li>
                        <strong>Multiple Representations:</strong> Provide opportunities for students to demonstrate
                        their understanding through various means (drawing, building, explaining, writing).
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Incorporate partner and small group activities to
                        support peer learning and discussion of weather and climate concepts.
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
                <li>Weather measurement tools (thermometers, rain gauges, wind vanes, etc.)</li>
                <li>Climate zone maps and resources</li>
                <li>Weather hazard information and case studies</li>
                <li>Materials for building and testing design solutions</li>
                <li>Videos and images of weather phenomena and climate zones</li>
                <li>OECS Grade 3 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Weather journals for recording observations and data</li>
                <li>Materials for creating weather data displays</li>
                <li>Climate zone research templates</li>
                <li>Weather and climate vocabulary cards</li>
                <li>Visual aids and reference materials</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Weather and Climate in Grade 3 builds upon students' earlier experiences with observing and describing
              weather conditions. Students develop a deeper understanding of the difference between weather (short-term
              atmospheric conditions) and climate (long-term weather patterns in a particular area). They learn to
              collect, record, and analyze weather data, identify patterns in weather over time, and understand how
              location affects climate. Students also explore weather-related hazards and design solutions to reduce
              their impacts. Through investigations, data analysis, and design activities, students develop an
              understanding of the factors that influence weather and climate and how humans can prepare for and respond
              to weather-related challenges.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
