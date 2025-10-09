"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Leaf, ClipboardCheck } from "lucide-react"

export default function InterdependentRelationshipsPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade2-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <Leaf className="mr-2 h-7 w-7 text-amber-600" />
            Interdependent Relationships in Ecosystems
          </h1>
          <p className="text-gray-700">
            The study of ecosystems encompasses knowledge about how plants, animals, and their environments interact.
            Students will investigate the needs of plants and animals, how they depend on each other, and the diversity
            of life in different habitats. Through observation and experimentation, students will develop an
            understanding of the interconnected nature of living things.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Interdependent Relationships in Ecosystems
        </h3>

        <Tabs defaultValue="elo1">
          <TabsList className="grid w-full grid-cols-2 bg-amber-100">
            <TabsTrigger value="elo1" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              ELO-1: Plants Need Sunlight and Water
            </TabsTrigger>
            <TabsTrigger value="elo2" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              ELO-2: Animal Roles in Ecosystems
            </TabsTrigger>
          </TabsList>

          <TabsContent value="elo1" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Plan and conduct an investigation to determine if plants need sunlight and
              water to grow.
            </h4>
            <p className="mb-2 text-sm italic">
              [Assessment Boundary: Assessment is limited to testing one variable at a time.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Design and conduct controlled experiments to test plant needs</li>
              <li>Observe and record plant growth under different conditions</li>
              <li>Analyze data to determine the effects of sunlight and water on plant growth</li>
              <li>Draw conclusions based on evidence from investigations</li>
              <li>Communicate findings using scientific vocabulary</li>
            </ul>
          </TabsContent>

          <TabsContent value="elo2" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Develop a simple model that mimics the function of an animal in dispersing
              seeds or pollinating plants. Make observations of plants and animals to compare the diversity of life in
              different habitats.
            </h4>
            <p className="mb-2 text-sm italic">
              [Clarification Statement: Emphasis is on the diversity of living things in each of a variety of different
              habitats.] [Assessment Boundary: Assessment does not include specific animal and plant names in specific
              habitats.]
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe how animals help plants through seed dispersal and pollination</li>
              <li>Design and create models that demonstrate animal functions in ecosystems</li>
              <li>Observe and document plants and animals in different habitats</li>
              <li>Compare the diversity of living things across different habitats</li>
              <li>Recognize patterns in how plants and animals are adapted to their habitats</li>
            </ul>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Knowledge Outcomes
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Define key terms related to plants, seeds, and ecosystems</li>
                    <li>Give examples of parts of plants that we eat</li>
                    <li>Account for why it is important to know how to nurture the growth of plants</li>
                    <li>
                      Use humans as a comparison to plants in terms of fundamental needs (water, nutrition, fresh air)
                    </li>
                    <li>Name the different parts of the seed (embryo, seed coat, cotyledon)</li>
                    <li>Explain the functions of the different parts of the seed</li>
                    <li>Explain how to design a controlled experiment</li>
                    <li>Explain why a controlled experiment is necessary</li>
                    <li>Account for differences in the rate of growth of plants under varying conditions</li>
                    <li>Identify and name different kinds of plants</li>
                    <li>List different uses of leaves in everyday life</li>
                    <li>Identify and appreciate caring for plants and animals and their environment</li>
                    <li>Outline and explain the process of germination</li>
                    <li>Identify and name the main conditions necessary for seed growth</li>
                    <li>Name, draw and label the main external parts of a plant</li>
                    <li>
                      Describe the process of germination in plants, outlining the factors that are necessary for the
                      process to occur
                    </li>
                    <li>
                      Describe the physical features of the parts of a plant, relating these features to their functions
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">Skill Outcomes</AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Compare the growth of plants under different conditions</li>
                    <li>Construct drawings of the different seeds during the germination process</li>
                    <li>Place the sequence of germination stages in the correct order</li>
                    <li>Observe the different stages of plant growth</li>
                    <li>Infer that sunlight and water are needed for plants to grow</li>
                    <li>Measure plant growth over a period of time</li>
                    <li>Communicate results of investigations in a variety of ways</li>
                    <li>Predict the effect of sunlight and water on the growth rate of plants</li>
                    <li>Construct simple diagrams and charts to present findings</li>
                    <li>Calculate growth rate of plants under varying conditions</li>
                    <li>Investigate whether sunlight and water are necessary for plant growth</li>
                    <li>Graph data on plant growth</li>
                    <li>Interpret data tables and graphs with data on plant growth</li>
                    <li>Observe different habitats and record the types of animals and plants that live there</li>
                    <li>
                      Infer how animals and plants within different habitats are adapted for seed dispersal and
                      pollination
                    </li>
                    <li>Classify seeds based on the type of dispersal (wind, animal, water)</li>
                    <li>Collect data from videos (using a table) on how seeds are dispersed in the environment</li>
                    <li>
                      Communicate their findings about seed dispersal and pollination using oral presentations, tables
                      and charts
                    </li>
                    <li>Construct a design for a model to show dispersal of seeds by animals</li>
                    <li>Calculate the number of seeds dispersed by animals, wind and water</li>
                    <li>Construct a pictograph using the information gathered</li>
                    <li>Interpret data presented in pictographs and charts</li>
                    <li>Conduct an experiment to determine how much water is absorbed by different types of soil</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Attitudes and Values
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Be aware that farming is an important means to secure our food and this is a vital industry for
                      our countries
                    </li>
                    <li>Appreciate that sunlight and water are conditions necessary for plant growth</li>
                    <li>Display Interest/Curiosity for what is needed for plants to grow well</li>
                    <li>Develop a positive attitude for engaging in inquiry</li>
                    <li>
                      Demonstrate respect for evidence by conducting experiments in a systematic and timely manner
                    </li>
                    <li>Work collaboratively & cooperatively to carry out scientific investigations</li>
                    <li>Show respect for living things by caring plants around</li>
                    <li>
                      Display sensitivity and offer assistance to peers who may have physical or learning challenges
                      when conducting practical and group work
                    </li>
                    <li>Participate actively in classroom discussions</li>
                    <li>Appreciate the importance of seed dispersal for the survival of plants</li>
                    <li>Create solutions to mitigate the impacts of invasive species of plants</li>
                    <li>
                      Recognise the role of animals in the survival of different plant species through seed dispersal
                    </li>
                    <li>Inquiry into soil absorption gives information for farming</li>
                    <li>Inventiveness - Create a model to show how animals disperse seeds</li>
                    <li>
                      Collaboration & Cooperation - Work collaboratively with their peers to create a model for the type
                      of dispersal selected
                    </li>
                    <li>Stewardship/Respect for Living Things</li>
                    <li>Safety as the soil experiment is undertaken</li>
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
                  <strong className="text-orange-700">Observations:</strong> Teacher observations during plant growth
                  experiments, habitat explorations, and model creation
                </li>
                <li>
                  <strong className="text-orange-700">Conversations:</strong> Student explanations, questions, and
                  discussions about plant needs and animal roles in ecosystems
                </li>
                <li>
                  <strong className="text-orange-700">Products:</strong> Student drawings, charts, graphs, models, and
                  written responses
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <h4 className="font-semibold mb-2 text-orange-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for plant growth experiments</li>
                  <li>Rubrics for evaluating seed dispersal models</li>
                  <li>Science journals with prompts for recording observations and reflections</li>
                  <li>Performance tasks that require application of knowledge about plant needs</li>
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
                  <AccordionTrigger>Plants Need Sunlight and Water</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Plant Growth Experiments:</strong> Design and conduct controlled experiments to
                        investigate how plants grow under different conditions of light and water.
                      </li>
                      <li>
                        <strong>Observation Stations:</strong> Set up stations where students can observe and document
                        plant growth over time, using measurement tools and recording sheets.
                      </li>
                      <li>
                        <strong>Data Collection and Analysis:</strong> Guide students in collecting, recording, and
                        analyzing data from plant growth experiments using simple charts and graphs.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Seed Structure and Germination</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Seed Dissection:</strong> Provide students with soaked seeds to carefully dissect and
                        identify the parts (seed coat, embryo, cotyledon).
                      </li>
                      <li>
                        <strong>Germination Sequence:</strong> Use clear containers to observe and document the stages
                        of seed germination over time.
                      </li>
                      <li>
                        <strong>Seed Journal:</strong> Students maintain a journal with drawings and descriptions of
                        seed parts and the germination process.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Seed Dispersal and Pollination</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Seed Collection and Classification:</strong> Collect various seeds and classify them
                        based on their dispersal mechanisms (wind, water, animals).
                      </li>
                      <li>
                        <strong>Model Creation:</strong> Design and create models that demonstrate how animals help
                        disperse seeds or pollinate plants.
                      </li>
                      <li>
                        <strong>Simulation Activities:</strong> Engage in role-playing or simulation activities to
                        demonstrate seed dispersal and pollination processes.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Habitat Exploration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Field Trips:</strong> Visit different habitats to observe and document the diversity of
                        plants and animals.
                      </li>
                      <li>
                        <strong>Habitat Comparison:</strong> Create charts or diagrams to compare the types of living
                        things found in different habitats.
                      </li>
                      <li>
                        <strong>Habitat Models:</strong> Design and create models of different habitats, showing the
                        plants and animals that live there.
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
                <li>"Watch it Grow: Backyard Life Cycles" by Barbara Reid</li>
                <li>OECS Grade 2 Science Curriculum Guide</li>
                <li>Plant growth experiment guides</li>
                <li>Seed dispersal and pollination resources</li>
                <li>Habitat comparison charts</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Seeds for planting and observation</li>
                <li>Clear containers for germination observation</li>
                <li>Magnifying glasses for seed examination</li>
                <li>Materials for creating seed dispersal models</li>
                <li>Science journals for recording observations and data</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Plants need sunlight, water, and nutrients to grow. Sunlight provides energy for photosynthesis, the
              process by which plants make their own food. Water is essential for transporting nutrients throughout the
              plant and for photosynthesis. Seeds contain all the parts needed to grow a new plant: the seed coat
              protects the seed, the embryo will grow into a new plant, and the cotyledon provides food for the growing
              embryo. Germination is the process by which a seed begins to grow into a plant. Animals help plants
              reproduce through seed dispersal and pollination. Seed dispersal is the movement of seeds away from the
              parent plant, which can happen through wind, water, or animals. Pollination is the transfer of pollen from
              the male part of a flower to the female part, which is necessary for the production of seeds.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
