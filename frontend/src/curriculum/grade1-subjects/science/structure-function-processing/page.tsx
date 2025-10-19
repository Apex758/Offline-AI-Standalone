import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function StructureFunctionProcessing() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Structure, Function, and Information Processing</h1>
        <Link to="/curriculum/grade1-subjects/science"><Button>Back to Science</Button></Link>
      </div>

      <div className="grid gap-6 space-y-2">
        <Card>
          <CardContent className="pt-6 px-4 sm:px-6">
            <p className="mb-4 leading-relaxed">
              Students explore how plants and animals use their external parts to survive, grow, and meet their needs.
              They learn about parent-offspring relationships, observe similarities and differences between young and
              adult organisms, and discover how humans can mimic nature to solve problems.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="outcomes">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="outcomes" className="text-xs sm:text-sm">
              Learning Outcomes
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs sm:text-sm">
              Key Activities
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="text-xs sm:text-sm">
              Vocabulary
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm">
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="outcomes" className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Essential Learning Outcomes</h2>
            <div className="grid gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-1</Badge>
                    Mimicking Nature
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Use materials to design a solution to a human problem by mimicking how plants and/or animals use
                    their external parts to help them survive, grow and meet their needs.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Define terms: mimic/mimicking, protection, living/non-living things, defense, camouflage</li>
                      <li>Name and describe external parts of local animals and plants</li>
                      <li>Identify natural defenses that animals use to survive</li>
                      <li>Give examples of how humans mimic plants and animals to solve problems</li>
                      <li>Use simple materials to design solutions based on nature</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-2</Badge>
                    Parent-Offspring Behaviors
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Read texts and use media to determine patterns in behavior of parent and offspring that help
                    offspring survive.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Define terms: protect, signal, offspring, survive, behavior, parents, respond</li>
                      <li>Name and identify offspring of common animals</li>
                      <li>Identify signals offspring make (crying, chirping, whining)</li>
                      <li>Describe how behavior patterns teach survival skills</li>
                      <li>Demonstrate through role play parent-offspring behaviors</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-3</Badge>
                    Comparing Young and Adult Organisms
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Make observations to construct an evidence-based account that young plants and animals are like, but
                    not exactly like their parents.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Define terms: parent, roots, leaves, stems, fruits, flowers, body coverings</li>
                      <li>Identify properties that distinguish between parents and offspring</li>
                      <li>Observe and compare young animals and plants with their parents</li>
                      <li>Collect and record evidence of similarities and differences</li>
                      <li>Work collaboratively to observe physical features of living things</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Key Learning Activities</h2>
            <div className="grid gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biomimicry Design Challenges</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Giraffe neck mimicry: Design tools to reach high places</li>
                    <li>Turtle shell protection: Create helmets for safety</li>
                    <li>Bird wing design: Explore airplane wing concepts</li>
                    <li>Mangrove root stability: Build tripod-like supports</li>
                    <li>Touch-sensitive plant: Explore touch screen technology</li>
                    <li>Animal camouflage: Design hiding strategies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parent-Offspring Observations</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Field trips to farms or zoos to observe animal families</li>
                    <li>Video analysis of parent-offspring interactions</li>
                    <li>Role-playing scenarios of animal communication</li>
                    <li>Sound identification games (baby animal calls)</li>
                    <li>Creating shelter models for protecting young</li>
                    <li>Storytelling about animal family behaviors</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparing Young and Adult Organisms</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>T-chart comparisons of plant features (young vs. adult)</li>
                    <li>Animal matching activities (parents with offspring)</li>
                    <li>Drawing exercises showing growth changes</li>
                    <li>Nature walks to observe different life stages</li>
                    <li>Photo documentation of similarities and differences</li>
                    <li>KWL charts about animal and plant development</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hands-On Investigations</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Shameplant (Mimosa pudica) touch experiments</li>
                    <li>Building simple devices inspired by animals</li>
                    <li>Creating animal defense models</li>
                    <li>Observing live specimens when possible</li>
                    <li>Making connections between human tools and animal features</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vocabulary" className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Key Vocabulary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Biomimicry Terms</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-2 text-sm leading-relaxed">
                    <li>
                      <strong>Mimic:</strong> To copy or imitate
                    </li>
                    <li>
                      <strong>Protection:</strong> Keeping safe from harm
                    </li>
                    <li>
                      <strong>Living things:</strong> Plants and animals that grow and need food
                    </li>
                    <li>
                      <strong>Non-living things:</strong> Objects that don't grow or need food
                    </li>
                    <li>
                      <strong>Defense:</strong> Ways to protect against danger
                    </li>
                    <li>
                      <strong>Camouflage:</strong> Hiding by blending in
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Behavior Terms</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-2 text-sm leading-relaxed">
                    <li>
                      <strong>Protect:</strong> To keep safe
                    </li>
                    <li>
                      <strong>Signal:</strong> A way to send a message
                    </li>
                    <li>
                      <strong>Offspring:</strong> Baby animals or young plants
                    </li>
                    <li>
                      <strong>Survive:</strong> To stay alive
                    </li>
                    <li>
                      <strong>Behavior:</strong> How animals act
                    </li>
                    <li>
                      <strong>Parents:</strong> Adult animals that care for young
                    </li>
                    <li>
                      <strong>Respond:</strong> To react to something
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plant & Animal Parts</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-2 text-sm leading-relaxed">
                    <li>
                      <strong>Roots:</strong> Plant parts that take in water
                    </li>
                    <li>
                      <strong>Leaves:</strong> Plant parts that make food
                    </li>
                    <li>
                      <strong>Stems:</strong> Plant parts that hold up leaves
                    </li>
                    <li>
                      <strong>Fruits:</strong> Plant parts that hold seeds
                    </li>
                    <li>
                      <strong>Flowers:</strong> Plant parts that make seeds
                    </li>
                    <li>
                      <strong>Body coverings:</strong> Fur, feathers, or skin
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Teaching Resources</h2>
            <div className="grid gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Materials for Activities</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Design Materials:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Cardboard, tape, scissors</li>
                        <li>Plastic cups and bottles</li>
                        <li>String, rubber bands</li>
                        <li>Construction paper</li>
                        <li>Modeling clay or playdough</li>
                        <li>Craft sticks and straws</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Observation Tools:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Magnifying glasses</li>
                        <li>Cameras for documentation</li>
                        <li>Chart paper for T-charts</li>
                        <li>Clipboards for field work</li>
                        <li>Colored pencils and markers</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Specimens & Models</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Shameplant (Mimosa pudica) for touch experiments</li>
                    <li>Various plant specimens at different growth stages</li>
                    <li>Pictures and videos of local animals and their young</li>
                    <li>Models of animal parts (shells, feathers, etc.)</li>
                    <li>Examples of human tools inspired by nature</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Strategies</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Design challenge portfolios</li>
                    <li>Observation journals and drawings</li>
                    <li>Role-play demonstrations</li>
                    <li>Matching and sorting activities</li>
                    <li>Oral presentations of findings</li>
                    <li>Collaborative group projects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cross-Curricular Connections</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Mathematics:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Counting and measuring materials</li>
                        <li>Data collection and graphing</li>
                        <li>Pattern recognition</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Language Arts:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Vocabulary development</li>
                        <li>Descriptive writing</li>
                        <li>Storytelling and presentations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
