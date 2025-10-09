"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Globe, ClipboardCheck } from "lucide-react"

export default function EarthSystemsProcessesPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade2-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <Globe className="mr-2 h-7 w-7 text-blue-600" />
            Earth Systems: Processes That Shape The Earth
          </h1>
          <p className="text-gray-700">
            The study of Earth systems encompasses knowledge about the processes that shape our planet. Students will
            investigate how Earth events can occur quickly or slowly, how wind and water change the shape of the land,
            and where water is found on Earth. Through observation and research, students will develop an understanding
            of the dynamic nature of our planet.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Earth Systems: Processes That Shape The Earth
        </h3>

        <Tabs defaultValue="elo1">
          <TabsList className="grid w-full grid-cols-4 bg-blue-100">
            <TabsTrigger value="elo1" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              ELO-1: Fast and Slow Events
            </TabsTrigger>
            <TabsTrigger value="elo2" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              ELO-2: Preventing Erosion
            </TabsTrigger>
            <TabsTrigger value="elo3" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              ELO-3: Land and Water Models
            </TabsTrigger>
            <TabsTrigger value="elo4" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              ELO-4: Water on Earth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="elo1" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Use information from several sources to provide evidence that Earth events
              can occur quickly or slowly.
            </h4>
            <p className="mb-2 text-sm italic">
              [Clarification Statement: Examples of events and timescales could include volcanic explosions and
              earthquakes, which happen quickly and erosion of rocks, which occurs slowly.] [Assessment Boundary:
              Assessment does not include quantitative measurements of timescales.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Gather information about Earth events from various sources</li>
              <li>Classify Earth events as occurring quickly or slowly</li>
              <li>Provide evidence to support classifications</li>
              <li>Compare and contrast fast and slow Earth events</li>
              <li>Communicate findings using scientific vocabulary</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo2" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Compare multiple solutions designed to slow or prevent wind or water from
              changing the shape of the land.
            </h4>
            <p className="mb-2 text-sm italic">
              [Clarification Statement: Examples of solutions could include different designs of dikes and windbreaks to
              hold back wind and water, and different designs for using shrubs, grass, and trees to hold back the land.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe how wind and water can change the shape of land</li>
              <li>Research different solutions to prevent or slow erosion</li>
              <li>Compare the effectiveness of different solutions</li>
              <li>Evaluate solutions based on specific criteria</li>
              <li>Communicate findings and recommendations</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo3" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Develop a model to represent the shapes and kinds of land and bodies of
              water in an area.
            </h4>
            <p className="mb-2 text-sm italic">
              [Assessment Boundary: Assessment does not include quantitative scaling in models.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify different landforms and bodies of water</li>
              <li>Recognize patterns in the distribution of land and water</li>
              <li>Create models to represent land and water features</li>
              <li>Use appropriate symbols and labels in models</li>
              <li>Explain how models represent real-world features</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo4" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 4: Obtain information to identify where water is found on Earth and that it can
              be solid or liquid.
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Research where water is found on Earth</li>
              <li>Identify water in its solid and liquid forms</li>
              <li>Recognize patterns in the distribution of water on Earth</li>
              <li>Understand the water cycle</li>
              <li>Communicate findings using scientific vocabulary</li>
            </ul>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Knowledge Outcomes
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Define key terms related to Earth systems and processes</li>
                    <li>
                      Using examples, demonstrate an understanding of the difference between fast and slow earth events
                    </li>
                    <li>
                      Define the term soil erosion, listing types of soil erosion, and ways and means of preventing it
                    </li>
                    <li>Describe an earthquake as a natural occurrence and explain what causes it</li>
                    <li>
                      Identify volcanic activity as a natural process and explain how volcanoes are formed, as well as
                      the impact on the environment
                    </li>
                    <li>
                      Demonstrate an understanding that the shape of an object depends on its function to solve a given
                      problem
                    </li>
                    <li>
                      Recognize that there are different designs for a roof and that some designs are better for
                      resisting the effects of wind and rain
                    </li>
                    <li>
                      Identify objects in the school, house and community that have specific shapes based on their
                      functions
                    </li>
                    <li>
                      Recognize that certain shapes are required in order for a designed object to solve the problem
                    </li>
                    <li>
                      Define and identify locations of different landforms and bodies of water in the Caribbean region,
                      such as hills, rivers, mountains, canyons, oceans, islands, volcanoes, deserts, waterfalls, and
                      estuaries
                    </li>
                    <li>Identify the two major landforms on the earth</li>
                    <li>Identify the 7 continents that make up the earth's land masses</li>
                    <li>Describe at least three means of traveling over landforms</li>
                    <li>Compare and define different forms of water (fresh, hard, soft and salt)</li>
                    <li>Provide examples of water pollution</li>
                    <li>
                      Give three examples of how technology has resulted in water pollution (oil spill, fertilizer,
                      industrial effluent)
                    </li>
                    <li>List 5 examples of land pollution</li>
                    <li>Explain how the three R's mitigate the effects of pollution</li>
                    <li>Explain the dangers of litter in the school and organize a clean-up project</li>
                    <li>Describe how pollutants affect people's activities and their health</li>
                    <li>Distinguish between activities that harm and those that preserve habitat/the environment</li>
                    <li>
                      Define the term environmental destruction and investigate the factors that cause and prevent its
                      destruction
                    </li>
                    <li>
                      Identify and discuss some of the unintended consequences of using fuels for transport and
                      production of materials for commerce (e.g., pollution)
                    </li>
                    <li>
                      Define the term solid waste, identifying methods of managing this waste in
                      home/school/community-recycling, composting
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">Skill Outcomes</AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use new vocabulary to describe your observations</li>
                    <li>Draw pictures that demonstrate you understand features of a volcano</li>
                    <li>Compare and contrast slow and fast earth events</li>
                    <li>Problem solve around preparation to be safe for predictable events</li>
                    <li>Interpret video information and pictures</li>
                    <li>Communicate ideas about observation of erosion</li>
                    <li>With the assistance of the teacher, construct models</li>
                    <li>
                      Understand and practice the engineering loop of stating the problem, creating a solution drawing
                      and testing the prototype design
                    </li>
                    <li>Investigate how the shape of an object depends on its function to solve a given problem</li>
                    <li>
                      Sketch or draw to simply illustrate how the shape of an object depends on its function to solve a
                      given problem
                    </li>
                    <li>
                      Communicate effectively to explain their sketches or drawings as to how the shape of an object
                      helps to solve a given problem
                    </li>
                    <li>Compare and contrast the shapes of objects with the same/ similar function</li>
                    <li>Predicting the shape of an object to solve a given problem</li>
                    <li>
                      Observe and recognize different shapes such as circles, squares, rectangles, triangles and more to
                      help solve a problem
                    </li>
                    <li>Propose a design for a practical device (window stick)</li>
                    <li>Interpret a pie chart</li>
                    <li>Classify the Caribbean region's common landforms (e.g., mountains, hills, valleys, plains)</li>
                    <li>Compile information on regional landforms from several sources</li>
                    <li>Use technology (Google Earth®) to investigate landforms in the region</li>
                    <li>Interpret pictures by careful observation</li>
                    <li>Gather information from video resources</li>
                    <li>Create posters to communicate the need for responsible recycling</li>
                    <li>
                      Construct a model or representation (e.g., using clay, or paper) that accurately depicts the
                      shapes and kinds of land and bodies of water in their area
                    </li>
                    <li>
                      Group litter in their school according to size, colour, what it is made of, recyclable and
                      non-recyclable
                    </li>
                    <li>
                      Classify samples of water as hard or soft by their ability to form lather with soap, explain the
                      advantages and disadvantages of both types of water
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Attitudes and Values
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Appreciate the role of natural processes in shaping the earth</li>
                    <li>
                      Compassion for those experiencing hardship due to a dangerous earth event. If able, assist those
                      that have been victims of an earth event
                    </li>
                    <li>Persistence at completing tasks and activities</li>
                    <li>
                      Interest/Curiosity- Find out more about different naturally occurring events and objects on their
                      own
                    </li>
                    <li>Respect for Evidence- Explain and listen to other students' results and explanation</li>
                    <li>Collaboration & Cooperation- Share ideas with others</li>
                    <li>Stewardship/Respect for Living Things- Show sensitivity to living things in the environment</li>
                    <li>Apply safety practices during fast earth events such as earthquakes, hurricanes, etc</li>
                    <li>
                      When conducting practical and group work, display sensitivity and offer assistance to peers who
                      may have physical or learning challenges
                    </li>
                    <li>Participate actively in classroom discussions</li>
                    <li>
                      Unplanned and excessive science and technological activities may destroy the earth as we know it,
                      resulting in untold disasters (Oil exploration, global warming)
                    </li>
                    <li>
                      Acknowledge that human-made things hold the potential to pollute the atmosphere and disrupt the
                      environment
                    </li>
                    <li>Appreciate that water and land are important resources that must be protected</li>
                    <li>To be curious about the shapes and kinds of land and bodies of water in their environment</li>
                    <li>
                      Collaborate with peers to discuss and compare different landforms and bodies of water found in the
                      Caribbean, fostering an appreciation for the diversity and uniqueness of the region's geography
                    </li>
                    <li>
                      Demonstrate respect for the environment by discussing ways to protect and preserve landforms and
                      bodies of water
                    </li>
                    <li>
                      Demonstrate Stewardship/Respect for living things that may be affected by lack of clean water
                    </li>
                    <li>Demonstrate Stewardship/Respect for living things that are impacted adversely by pollution</li>
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
                  <strong className="text-teal-700">Observations:</strong> Teacher observations during model creation,
                  erosion experiments, and landform identification activities
                </li>
                <li>
                  <strong className="text-teal-700">Conversations:</strong> Student explanations, questions, and
                  discussions about Earth events and processes
                </li>
                <li>
                  <strong className="text-teal-700">Products:</strong> Student drawings, models, charts, and written
                  responses
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
                <h4 className="font-semibold mb-2 text-teal-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for model creation activities</li>
                  <li>Rubrics for evaluating landform and water models</li>
                  <li>Science journals with prompts for recording observations and reflections</li>
                  <li>Performance tasks that require application of knowledge about Earth processes</li>
                  <li>Self-assessment tools for group work and collaboration</li>
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
                  <AccordionTrigger>Fast and Slow Earth Events</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Earth Event Investigation:</strong> Research and gather information about different
                        Earth events, classifying them as occurring quickly or slowly.
                      </li>
                      <li>
                        <strong>Visual Timelines:</strong> Create visual timelines to represent the different timescales
                        of Earth events, from rapid events like earthquakes to slow processes like erosion.
                      </li>
                      <li>
                        <strong>Evidence Collection:</strong> Collect and organize evidence from various sources to
                        support classifications of Earth events as fast or slow.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Preventing Wind and Water Erosion</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Erosion Experiments:</strong> Conduct simple experiments to observe how wind and water
                        can change the shape of land, using sand, soil, and water.
                      </li>
                      <li>
                        <strong>Solution Design:</strong> Research and design different solutions to prevent or slow
                        erosion, such as windbreaks, vegetation, and barriers.
                      </li>
                      <li>
                        <strong>Solution Comparison:</strong> Compare the effectiveness of different erosion prevention
                        solutions through experiments or models.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Land and Water Models</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Landform Identification:</strong> Use maps, globes, and images to identify different
                        landforms and bodies of water in the local area and around the world.
                      </li>
                      <li>
                        <strong>Model Creation:</strong> Create 3D models of landforms and bodies of water using clay,
                        paper, or other materials.
                      </li>
                      <li>
                        <strong>Map Reading:</strong> Practice reading and interpreting maps that show land and water
                        features, focusing on symbols and labels.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Water on Earth</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Water Location Research:</strong> Research and identify where water is found on Earth,
                        including oceans, lakes, rivers, glaciers, and groundwater.
                      </li>
                      <li>
                        <strong>Water State Exploration:</strong> Explore water in its solid and liquid forms through
                        simple experiments with freezing and melting.
                      </li>
                      <li>
                        <strong>Water Cycle Investigation:</strong> Investigate the water cycle through demonstrations
                        and models, focusing on how water moves around Earth.
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
                <li>OECS Grade 2 Science Curriculum Guide</li>
                <li>Maps and globes showing landforms and bodies of water</li>
                <li>Videos and images of Earth events (volcanoes, earthquakes, erosion)</li>
                <li>Erosion prevention demonstration materials</li>
                <li>Water cycle demonstration materials</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Materials for creating landform and water models (clay, paper, etc.)</li>
                <li>Materials for erosion experiments (sand, soil, water, etc.)</li>
                <li>Science journals for recording observations and data</li>
                <li>Visual aids showing Earth events and processes</li>
                <li>Simple maps and globes for exploration</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Earth events can occur at different timescales. Fast events, like volcanic eruptions and earthquakes,
              happen quickly and can cause dramatic changes to the landscape. Slow events, like erosion and weathering,
              happen over long periods of time but can also cause significant changes. Wind and water are powerful
              forces that can change the shape of the land through erosion. Humans can design solutions to prevent or
              slow erosion, such as planting vegetation, building barriers, and creating windbreaks. Earth's surface is
              made up of various landforms (mountains, hills, valleys, plains) and bodies of water (oceans, lakes,
              rivers). Water is found on Earth in both solid (ice, snow) and liquid forms, and it moves through the
              water cycle (evaporation, condensation, precipitation).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
