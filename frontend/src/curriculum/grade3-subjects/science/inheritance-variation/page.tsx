import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Beaker, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function InheritanceVariationPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <Beaker className="mr-2 h-7 w-7 text-amber-600" />
            Inheritance and Variation of Traits
          </h1>
          <p className="text-gray-700">
            In Grade 3, students develop models to describe the unique and diverse life cycles of organisms. They
            analyze evidence of inherited traits, explore how traits can be influenced by the environment, and
            investigate how variations in traits can provide advantages for survival. Through these explorations,
            students build an understanding of inheritance, variation, and adaptation.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Inheritance and Variation of Traits
        </h3>

        <Tabs defaultValue="lifecycle">
          <TabsList className="grid w-full grid-cols-3 bg-amber-100">
            <TabsTrigger value="lifecycle" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Life Cycles
            </TabsTrigger>
            <TabsTrigger
              value="inheritance"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Inheritance of Traits
            </TabsTrigger>
            <TabsTrigger value="variation" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Variation & Environment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lifecycle" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Develop models to describe that organisms have unique and diverse life
              cycles but all have in common birth, growth, reproduction, and death
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify the stages in the life cycles of various plants and animals</li>
              <li>Compare and contrast life cycles of different organisms</li>
              <li>Recognize the common elements in all life cycles (birth, growth, reproduction, death)</li>
              <li>Develop models to represent different life cycles</li>
              <li>Observe and document changes in organisms as they progress through their life cycles</li>
              <li>Investigate how different organisms reproduce and develop</li>
              <li>Create diagrams or models to illustrate the life cycles of various organisms</li>
            </ul>
          </TabsContent>

          <TabsContent value="inheritance" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Analyze and interpret data to provide evidence that plants and animals have
              traits inherited from parents and that variation of these traits exists in a group of similar organisms
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify traits that are inherited from parents in plants and animals</li>
              <li>Collect and analyze data on traits in different individuals of the same species</li>
              <li>Recognize patterns of inheritance in family groups</li>
              <li>Compare traits among parents and offspring</li>
              <li>Investigate variations in traits among individuals of the same species</li>
              <li>Use data to provide evidence of inherited traits</li>
              <li>Create visual representations of trait inheritance and variation</li>
            </ul>
          </TabsContent>

          <TabsContent value="variation" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Use evidence to support the explanation that traits can be influenced by the
              environment
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Investigate how environmental factors can affect the traits of organisms</li>
              <li>Design experiments to test how environment influences traits</li>
              <li>Collect evidence of environmental influences on traits</li>
              <li>Compare the same type of organism grown in different environments</li>
              <li>Analyze data to identify patterns in how environment affects traits</li>
              <li>Distinguish between inherited traits and those influenced by the environment</li>
              <li>Construct explanations of how specific environmental factors affect specific traits</li>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Life Cycles of Organisms
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Identify and describe the stages in the life cycles of various plants (e.g., flowering plants,
                      conifers)
                    </li>
                    <li>
                      Identify and describe the stages in the life cycles of various animals (e.g., mammals, birds,
                      insects, amphibians)
                    </li>
                    <li>Compare and contrast life cycles of different organisms</li>
                    <li>Recognize the common elements in all life cycles (birth, growth, reproduction, death)</li>
                    <li>Develop models to represent different life cycles</li>
                    <li>Observe and document changes in organisms as they progress through their life cycles</li>
                    <li>Investigate how different organisms reproduce and develop</li>
                    <li>Create diagrams or models to illustrate the life cycles of various organisms</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Inheritance of Traits
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify traits that are inherited from parents in plants and animals</li>
                    <li>Collect and analyze data on traits in different individuals of the same species</li>
                    <li>Recognize patterns of inheritance in family groups</li>
                    <li>Compare traits among parents and offspring</li>
                    <li>Investigate variations in traits among individuals of the same species</li>
                    <li>Use data to provide evidence of inherited traits</li>
                    <li>Create visual representations of trait inheritance and variation</li>
                    <li>Distinguish between inherited traits and learned behaviors</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Environmental Influences on Traits
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Investigate how environmental factors can affect the traits of organisms</li>
                    <li>Design experiments to test how environment influences traits</li>
                    <li>Collect evidence of environmental influences on traits</li>
                    <li>Compare the same type of organism grown in different environments</li>
                    <li>Analyze data to identify patterns in how environment affects traits</li>
                    <li>Distinguish between inherited traits and those influenced by the environment</li>
                    <li>Construct explanations of how specific environmental factors affect specific traits</li>
                    <li>Recognize that both inheritance and environment contribute to an organism's characteristics</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Variation and Adaptation
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Observe and identify variations among individuals of the same species</li>
                    <li>Investigate how specific traits can provide advantages for survival and reproduction</li>
                    <li>Analyze how environmental conditions influence which traits provide advantages</li>
                    <li>Collect evidence of advantageous traits in specific environments</li>
                    <li>Construct explanations of how variations lead to different survival rates</li>
                    <li>Use examples to explain the concept of adaptation in simple terms</li>
                    <li>Create models to demonstrate how advantageous traits help organisms survive</li>
                    <li>Recognize that diversity within a species can be beneficial for survival</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-amber-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-amber-700">Observations:</strong> Teacher observations during life cycle
                  investigations, trait comparisons, and environmental influence experiments
                </li>
                <li>
                  <strong className="text-amber-700">Conversations:</strong> Student explanations of inheritance
                  concepts, life cycle patterns, and environmental influences on traits
                </li>
                <li>
                  <strong className="text-amber-700">Products:</strong> Student work samples, including life cycle
                  models, trait comparison charts, and experiment results
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                <h4 className="font-semibold mb-2 text-amber-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for investigation and modeling skills</li>
                  <li>Rubrics for evaluating life cycle models and trait comparison projects</li>
                  <li>Performance tasks involving inheritance and environmental influence concepts</li>
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
                  <AccordionTrigger>Life Cycle Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Life Cycle Observations:</strong> Provide opportunities for students to observe and
                        document the life cycles of various organisms, such as butterflies, frogs, or plants.
                      </li>
                      <li>
                        <strong>Life Cycle Modeling:</strong> Guide students in creating models or diagrams that
                        represent the life cycles of different organisms.
                      </li>
                      <li>
                        <strong>Comparison Activities:</strong> Engage students in comparing the life cycles of
                        different organisms to identify similarities and differences.
                      </li>
                      <li>
                        <strong>Life Cycle Sequencing:</strong> Provide activities where students sequence the stages of
                        different life cycles using pictures or descriptions.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Inheritance Investigation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Trait Surveys:</strong> Have students conduct surveys of traits among classmates or
                        family members (e.g., eye color, hair color, ability to roll tongue).
                      </li>
                      <li>
                        <strong>Plant Breeding Simulations:</strong> Use simple plant breeding activities to demonstrate
                        how traits are passed from parents to offspring.
                      </li>
                      <li>
                        <strong>Family Trait Studies:</strong> Guide students in investigating traits that run in their
                        families, creating family trait trees.
                      </li>
                      <li>
                        <strong>Data Analysis Activities:</strong> Provide data sets for students to analyze patterns of
                        trait inheritance in various organisms.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Environmental Influence Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Plant Growth Experiments:</strong> Design experiments where students grow the same type
                        of plant in different environmental conditions (light, water, soil type).
                      </li>
                      <li>
                        <strong>Case Studies:</strong> Examine real-world examples of how environment affects traits in
                        various organisms.
                      </li>
                      <li>
                        <strong>Controlled Variable Investigations:</strong> Guide students in designing investigations
                        that test how specific environmental factors affect specific traits.
                      </li>
                      <li>
                        <strong>Data Collection and Analysis:</strong> Engage students in collecting and analyzing data
                        about environmental influences on traits.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Variation and Adaptation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Variation Observations:</strong> Have students observe and document variations in traits
                        among individuals of the same species (e.g., seed size, leaf shape, pet characteristics).
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
                        students' understanding of inheritance and life cycle concepts.
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
                        support peer learning and discussion of inheritance concepts.
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
                <li>Life cycle kits (butterfly, frog, plant)</li>
                <li>Seeds and plants for growth experiments</li>
                <li>Trait inheritance demonstration materials</li>
                <li>Videos and images of life cycles and inheritance</li>
                <li>Books and articles about genetics and inheritance for children</li>
                <li>OECS Grade 3 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Science journals for recording observations and data</li>
                <li>Materials for creating life cycle models</li>
                <li>Data collection sheets for trait surveys</li>
                <li>Inheritance and life cycle vocabulary cards</li>
                <li>Visual aids and reference materials</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Inheritance and Variation of Traits in Grade 3 builds upon students' earlier experiences with plants,
              animals, and their life cycles. Students develop a deeper understanding of how organisms grow, develop,
              and reproduce. They learn that organisms inherit traits from their parents and that there is variation in
              these traits among individuals of the same species. Students also explore how environmental factors can
              influence traits and how variations in traits can provide advantages for survival in specific
              environments. Through investigations, observations, and modeling activities, students develop an
              understanding of the basic principles of inheritance, variation, and adaptation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
