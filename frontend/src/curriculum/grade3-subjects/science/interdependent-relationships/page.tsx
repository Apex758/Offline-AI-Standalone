import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Leaf, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function InterdependentRelationshipsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <Leaf className="mr-2 h-7 w-7 text-blue-600" />
            Interdependent Relationships in Ecosystems
          </h1>
          <p className="text-gray-700">
            In Grade 3, students explore how organisms form groups that help members survive, analyze how habitats
            support different organisms, and investigate how environmental changes affect plants and animals. They
            examine how variations in traits can provide advantages for survival and develop an understanding of the
            interdependence of living things within ecosystems.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Interdependent Relationships in Ecosystems
        </h3>

        <Tabs defaultValue="groups">
          <TabsList className="grid w-full grid-cols-4 bg-blue-100">
            <TabsTrigger value="groups" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Social Groups & Survival
            </TabsTrigger>
            <TabsTrigger value="habitats" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Habitats & Organisms
            </TabsTrigger>
            <TabsTrigger value="changes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Environmental Changes
            </TabsTrigger>
            <TabsTrigger value="adaptation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Adaptation & Survival
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Construct an argument that some animals form groups that help members
              survive
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify various animal groups and their social structures</li>
              <li>
                Analyze how being part of a group helps animals find food, defend against predators, and care for young
              </li>
              <li>Compare solitary animals with those that live in groups</li>
              <li>Investigate how different animals communicate within their groups</li>
              <li>Observe and describe the roles of different members within animal groups</li>
              <li>Construct evidence-based arguments about the survival benefits of group living</li>
              <li>Research and present information about specific animal groups and their survival strategies</li>
            </ul>
          </TabsContent>

          <TabsContent value="habitats" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Analyze and interpret data from fossils to provide evidence of the organisms
              and the environments in which they lived long ago
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Examine fossil evidence to learn about organisms that lived long ago</li>
              <li>Compare fossils to modern organisms to identify similarities and differences</li>
              <li>Use fossil evidence to make inferences about past environments</li>
              <li>Analyze how fossil evidence shows changes in organisms over time</li>
              <li>Investigate how fossils form and are preserved</li>
              <li>Interpret data from fossils to understand past ecosystems</li>
              <li>Create models or representations of fossil organisms and their environments</li>
            </ul>
          </TabsContent>

          <TabsContent value="changes" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Make a claim about the merit of a solution to a problem caused when the
              environment changes and the types of plants and animals that live there may change
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify environmental changes that can affect ecosystems (natural and human-caused)</li>
              <li>Investigate how environmental changes affect the plants and animals in an ecosystem</li>
              <li>Analyze how some organisms adapt to environmental changes while others may not survive</li>
              <li>Explore solutions to problems caused by environmental changes</li>
              <li>Evaluate the effectiveness of different solutions to environmental problems</li>
              <li>Make evidence-based claims about the merit of specific solutions</li>
              <li>Design and communicate solutions to help organisms survive environmental changes</li>
            </ul>
          </TabsContent>

          <TabsContent value="adaptation" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 4: Use evidence to construct an explanation for how the variations in
              characteristics among individuals of the same species may provide advantages in surviving and reproducing
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe and identify variations among individuals of the same species</li>
              <li>Investigate how specific traits can provide advantages for survival and reproduction</li>
              <li>Analyze how environmental conditions influence which traits provide advantages</li>
              <li>Collect evidence of advantageous traits in specific environments</li>
              <li>Construct explanations of how variations lead to different survival rates</li>
              <li>Use examples to explain the concept of natural selection in simple terms</li>
              <li>Create models to demonstrate how advantageous traits help organisms survive</li>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Animal Groups and Survival
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and describe various animal groups and their social structures</li>
                    <li>Analyze how being part of a group helps animals find food</li>
                    <li>Investigate how group living helps animals defend against predators</li>
                    <li>Examine how groups support the care and protection of young</li>
                    <li>Compare and contrast solitary animals with those that live in groups</li>
                    <li>Investigate how different animals communicate within their groups</li>
                    <li>Observe and describe the roles of different members within animal groups</li>
                    <li>Construct evidence-based arguments about the survival benefits of group living</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Fossils and Past Environments
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Examine fossil evidence to learn about organisms that lived long ago</li>
                    <li>Compare fossils to modern organisms to identify similarities and differences</li>
                    <li>Use fossil evidence to make inferences about past environments</li>
                    <li>Analyze how fossil evidence shows changes in organisms over time</li>
                    <li>Investigate how fossils form and are preserved</li>
                    <li>Interpret data from fossils to understand past ecosystems</li>
                    <li>Create models or representations of fossil organisms and their environments</li>
                    <li>Recognize that fossils provide evidence of organisms that lived long ago</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Environmental Changes and Ecosystems
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify environmental changes that can affect ecosystems (natural and human-caused)</li>
                    <li>Investigate how environmental changes affect the plants and animals in an ecosystem</li>
                    <li>Analyze how some organisms adapt to environmental changes while others may not survive</li>
                    <li>Explore solutions to problems caused by environmental changes</li>
                    <li>Evaluate the effectiveness of different solutions to environmental problems</li>
                    <li>Make evidence-based claims about the merit of specific solutions</li>
                    <li>Design and communicate solutions to help organisms survive environmental changes</li>
                    <li>Recognize the importance of habitat preservation for maintaining biodiversity</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Variation and Adaptation
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Observe and identify variations among individuals of the same species</li>
                    <li>Investigate how specific traits can provide advantages for survival and reproduction</li>
                    <li>Analyze how environmental conditions influence which traits provide advantages</li>
                    <li>Collect evidence of advantageous traits in specific environments</li>
                    <li>Construct explanations of how variations lead to different survival rates</li>
                    <li>Use examples to explain the concept of natural selection in simple terms</li>
                    <li>Create models to demonstrate how advantageous traits help organisms survive</li>
                    <li>Recognize that diversity within a species can be beneficial for survival</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-blue-700">Observations:</strong> Teacher observations during investigations,
                  group discussions, and ecosystem modeling activities
                </li>
                <li>
                  <strong className="text-blue-700">Conversations:</strong> Student explanations of ecosystem concepts,
                  animal adaptations, and environmental change solutions
                </li>
                <li>
                  <strong className="text-blue-700">Products:</strong> Student work samples, including ecosystem models,
                  research projects, and solution proposals
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for group work and investigation skills</li>
                  <li>Rubrics for evaluating ecosystem models and research projects</li>
                  <li>Performance tasks involving ecosystem relationships and adaptations</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Science journals for recording observations, data, and reflections</li>
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
                  <AccordionTrigger>Animal Groups Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Animal Group Research:</strong> Have students research different animal groups (e.g.,
                        wolf packs, bee colonies, bird flocks) and create presentations about how group living benefits
                        survival.
                      </li>
                      <li>
                        <strong>Role-Play Activities:</strong> Engage students in role-play activities where they act
                        out the roles of different members in animal groups to understand social structures.
                      </li>
                      <li>
                        <strong>Video Analysis:</strong> Show videos of animal groups in action and guide students in
                        analyzing how group behaviors contribute to survival.
                      </li>
                      <li>
                        <strong>Comparison Charts:</strong> Create charts comparing solitary animals with those that
                        live in groups, highlighting the advantages and challenges of each lifestyle.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Fossil Investigation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Fossil Exploration:</strong> Provide fossil replicas or images for students to examine
                        and make observations about past organisms and their environments.
                      </li>
                      <li>
                        <strong>Fossil Formation Models:</strong> Guide students in creating models that demonstrate how
                        fossils form and are preserved over time.
                      </li>
                      <li>
                        <strong>Past and Present Comparisons:</strong> Have students compare fossil organisms with their
                        modern relatives to identify similarities and differences.
                      </li>
                      <li>
                        <strong>Paleontologist Role-Play:</strong> Engage students in activities where they act as
                        paleontologists, using fossil evidence to reconstruct past environments.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Environmental Change Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Ecosystem Change Simulations:</strong> Use simulations or models to demonstrate how
                        environmental changes affect ecosystems and the organisms within them.
                      </li>
                      <li>
                        <strong>Problem-Solution Projects:</strong> Have students identify environmental problems and
                        design solutions to help organisms adapt or survive.
                      </li>
                      <li>
                        <strong>Case Studies:</strong> Examine real-world examples of environmental changes and their
                        effects on specific ecosystems.
                      </li>
                      <li>
                        <strong>Solution Evaluation:</strong> Guide students in evaluating different solutions to
                        environmental problems based on scientific criteria.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Variation and Adaptation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Trait Variation Observations:</strong> Have students observe and document variations in
                        traits among individuals of the same species (e.g., seed size, leaf shape, pet characteristics).
                      </li>
                      <li>
                        <strong>Adaptation Scenarios:</strong> Present students with different environmental scenarios
                        and have them predict which traits would be advantageous in each situation.
                      </li>
                      <li>
                        <strong>Survival Advantage Models:</strong> Guide students in creating models or simulations
                        that demonstrate how specific traits provide survival advantages.
                      </li>
                      <li>
                        <strong>Evidence Collection:</strong> Engage students in collecting and analyzing evidence of
                        how variations in traits affect survival in different environments.
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
                        students' understanding of ecosystem relationships and concepts.
                      </li>
                      <li>
                        <strong>Tiered Activities:</strong> Adjust the complexity of investigations and projects based
                        on students' readiness levels.
                      </li>
                      <li>
                        <strong>Multiple Representations:</strong> Provide opportunities for students to demonstrate
                        their understanding through various means (drawing, building, explaining, writing).
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Incorporate partner and small group activities to
                        support peer learning and discussion of ecosystem concepts.
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
                <li>Field guides for local plants and animals</li>
                <li>Fossil replicas or images for classroom use</li>
                <li>Ecosystem models and simulations</li>
                <li>Videos of animal groups and their behaviors</li>
                <li>Books and articles about environmental changes and adaptations</li>
                <li>OECS Grade 3 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Science journals for recording observations and data</li>
                <li>Materials for creating ecosystem models</li>
                <li>Field notebooks for outdoor observations</li>
                <li>Ecosystem vocabulary cards</li>
                <li>Visual aids and reference materials</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Interdependent Relationships in Ecosystems in Grade 3 builds upon students' earlier experiences with
              plants, animals, and their environments. Students develop a deeper understanding of how organisms interact
              with each other and with their environment. They learn about the benefits of group living for many animal
              species, how fossils provide evidence of past organisms and environments, how environmental changes affect
              ecosystems, and how variations in traits can provide advantages for survival. Through investigations,
              research, and modeling activities, students develop an understanding of the interdependence of living
              things and the importance of biodiversity for healthy ecosystems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
