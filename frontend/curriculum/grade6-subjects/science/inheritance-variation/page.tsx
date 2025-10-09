import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ClipboardCheck, BookOpen, Users, Target, Dna } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function InheritanceVariationPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade6-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <Dna className="mr-2 h-7 w-7 text-green-600" />
            Inheritance and Variation of Traits
          </h1>
          <p className="text-gray-700 text-lg">
            Explore heredity patterns, genetic variation, environmental influences on traits, and life cycle diversity
            across different organisms.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Heredity</Badge>
            <Badge variant="secondary">Genetic Variation</Badge>
            <Badge variant="secondary">Environmental Factors</Badge>
            <Badge variant="secondary">Life Cycles</Badge>
            <Badge variant="secondary">Natural Selection</Badge>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Essential Learning Outcomes & Genetic Understanding
        </h3>

        <Tabs defaultValue="heredity">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger value="heredity" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Heredity Patterns
            </TabsTrigger>
            <TabsTrigger value="variation" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Trait Variation
            </TabsTrigger>
            <TabsTrigger
              value="life-cycles"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Life Cycles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heredity" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-3 text-green-800">
              Essential Learning Outcome 1: Use arguments based on empirical evidence and scientific reasoning to
              support an explanation for how characteristic animal behaviors and specialized plant structures affect the
              probability of successful reproduction.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">Animal Reproductive Behaviors:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Courtship displays and mate selection</li>
                  <li>Territorial behaviors and resource protection</li>
                  <li>Parental care and offspring protection</li>
                  <li>Migration patterns for breeding</li>
                  <li>Seasonal timing of reproductive activities</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">Plant Reproductive Structures:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Flower structures for pollinator attraction</li>
                  <li>Seed dispersal mechanisms (wind, water, animals)</li>
                  <li>Fruit development for seed protection</li>
                  <li>Root and stem adaptations for reproduction</li>
                  <li>Timing of flowering and fruiting</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variation" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-3 text-green-800">
              Essential Learning Outcome 2: Construct a scientific explanation based on evidence for how environmental
              and genetic factors influence the growth of organisms.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">Genetic Factors:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Inherited traits from parent organisms</li>
                  <li>DNA as the blueprint for development</li>
                  <li>Gene expression and protein production</li>
                  <li>Genetic variation within populations</li>
                  <li>Mutations and their effects on traits</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">Environmental Factors:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Nutrition and resource availability</li>
                  <li>Temperature and climate conditions</li>
                  <li>Light exposure and photoperiod</li>
                  <li>Water availability and humidity</li>
                  <li>Social interactions and competition</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="life-cycles" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-3 text-green-800">
              Essential Learning Outcome 3: Develop and use a model to describe why structural changes to genes
              (mutations) located on chromosomes may affect proteins and may result in harmful, beneficial, or neutral
              effects to the structure and function of the organism.
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">Genetic Mutations:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Point mutations (single base changes)</li>
                  <li>Insertion and deletion mutations</li>
                  <li>Chromosomal rearrangements</li>
                  <li>Silent, missense, and nonsense mutations</li>
                  <li>Somatic vs. germline mutations</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">Effects on Organisms:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Beneficial: improved survival or reproduction</li>
                  <li>Harmful: reduced fitness or disease</li>
                  <li>Neutral: no significant effect on function</li>
                  <li>Context-dependent effects</li>
                  <li>Population-level consequences</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Detailed Curriculum Outcomes
              </CardTitle>
              <CardDescription>Comprehensive heredity and genetics learning expectations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                    Reproductive Success and Adaptations
                  </AccordionTrigger>
                  <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Students will understand:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Reproductive success determines species survival</li>
                          <li>Behaviors and structures evolve to increase reproduction</li>
                          <li>Environmental pressures shape reproductive strategies</li>
                          <li>Trade-offs exist between reproduction and survival</li>
                          <li>Sexual selection influences trait development</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Caribbean Examples:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Sea turtle nesting behaviors and site selection</li>
                          <li>Hummingbird-flower coevolution relationships</li>
                          <li>Coral spawning synchronization</li>
                          <li>Mangrove propagule dispersal strategies</li>
                          <li>Seasonal bird migration for breeding</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Key Vocabulary:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            adaptation
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            courtship
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            pollination
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            dispersal
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            fitness
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            selection
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                    Environmental and Genetic Influences
                  </AccordionTrigger>
                  <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Nature vs. Nurture Investigations:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Twin studies and genetic similarity</li>
                          <li>Plant growth under different conditions</li>
                          <li>Animal behavior in various environments</li>
                          <li>Phenotypic plasticity examples</li>
                          <li>Epigenetic effects on gene expression</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Experimental Design Skills:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Controlled variable identification</li>
                          <li>Data collection and measurement</li>
                          <li>Statistical analysis of variation</li>
                          <li>Graphing and data interpretation</li>
                          <li>Drawing evidence-based conclusions</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h6 className="font-medium text-xs mb-1">Measurable Traits:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Height and weight</li>
                            <li>• Leaf size and shape</li>
                            <li>• Flower color intensity</li>
                            <li>• Behavioral frequencies</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-xs mb-1">Environmental Variables:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Temperature ranges</li>
                            <li>• Light intensity/duration</li>
                            <li>• Nutrient availability</li>
                            <li>• Social conditions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                    Mutations and Genetic Variation
                  </AccordionTrigger>
                  <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Mutation Modeling Activities:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>DNA sequence changes and protein effects</li>
                          <li>Chromosome structure alterations</li>
                          <li>Population genetics simulations</li>
                          <li>Natural selection scenarios</li>
                          <li>Genetic drift demonstrations</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Real-World Applications:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Antibiotic resistance in bacteria</li>
                          <li>Crop breeding and genetic improvement</li>
                          <li>Conservation genetics for endangered species</li>
                          <li>Human genetic disorders and treatments</li>
                          <li>Evolution of pesticide resistance</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-700">Performance-Based Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Heredity pattern analysis projects</li>
                    <li>Environmental factor experiments</li>
                    <li>Life cycle comparison studies</li>
                    <li>Mutation effect modeling</li>
                    <li>Adaptation explanation portfolios</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-green-700">Formative Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Daily trait observation logs</li>
                    <li>Quick Punnett square exercises</li>
                    <li>Environmental factor predictions</li>
                    <li>Genetic variation concept maps</li>
                    <li>Peer explanation sessions</li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <h4 className="font-semibold mb-2 text-green-700">Real-World Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Family trait inheritance studies</li>
                    <li>Local species adaptation analysis</li>
                    <li>Agricultural breeding investigations</li>
                    <li>Conservation genetics projects</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Differentiated Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="visual-spatial">
                  <AccordionTrigger>Visual-Spatial Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Pedigree charts and family trees</li>
                      <li>Life cycle diagrams and flowcharts</li>
                      <li>DNA structure models</li>
                      <li>Trait variation infographics</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hands-on">
                  <AccordionTrigger>Kinesthetic Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Physical trait measurement activities</li>
                      <li>DNA extraction experiments</li>
                      <li>Breeding simulation games</li>
                      <li>Environmental manipulation studies</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="analytical">
                  <AccordionTrigger>Analytical Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Statistical analysis of trait data</li>
                      <li>Probability calculations in genetics</li>
                      <li>Research-based investigations</li>
                      <li>Quantitative trait analysis</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="collaborative">
                  <AccordionTrigger>Social Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Group heredity investigations</li>
                      <li>Team breeding experiments</li>
                      <li>Peer teaching of genetic concepts</li>
                      <li>Collaborative data collection</li>
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
          <CardTitle>Comprehensive Resources and Field Study Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-700">Laboratory Equipment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Microscopes for cell observation</li>
                <li>DNA extraction kits</li>
                <li>Genetic crosses materials</li>
                <li>Measurement tools (rulers, scales)</li>
                <li>Environmental monitoring equipment</li>
                <li>Plant growth chambers</li>
                <li>Digital cameras for documentation</li>
                <li>Computer software for data analysis</li>
                <li>Genetic simulation programs</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-green-700">Living Materials</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Fast-growing plants (beans, peas)</li>
                <li>Fruit flies for genetic studies</li>
                <li>Local plant varieties</li>
                <li>Aquatic organisms (fish, plants)</li>
                <li>Bacterial cultures for mutation studies</li>
                <li>Seeds with visible trait variations</li>
                <li>Caribbean native species</li>
                <li>Domesticated animals for observation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-green-700">Community Connections</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Local agricultural extension services</li>
                <li>Botanical gardens and nature centers</li>
                <li>Veterinary clinics and animal hospitals</li>
                <li>University genetics departments</li>
                <li>Conservation organizations</li>
                <li>Traditional plant knowledge keepers</li>
                <li>Breeding associations and farmers</li>
                <li>Medical genetics counselors</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge and Preparation</h3>
            <p className="text-sm mb-3">
              Teachers should develop understanding of genetics principles, heredity patterns, and evolutionary
              concepts. Emphasis should be placed on connecting genetic theory to observable traits and Caribbean
              biodiversity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Essential Genetics Knowledge:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Mendelian genetics and inheritance patterns</li>
                  <li>DNA structure and function</li>
                  <li>Gene expression and protein synthesis</li>
                  <li>Mutation types and effects</li>
                  <li>Natural selection and evolution</li>
                  <li>Population genetics principles</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pedagogical Strategies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Inquiry-based genetics investigations</li>
                  <li>Model organism care and handling</li>
                  <li>Data collection and statistical analysis</li>
                  <li>Ethical considerations in genetics</li>
                  <li>Technology integration for simulations</li>
                  <li>Local biodiversity connections</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
