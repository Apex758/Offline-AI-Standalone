import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Waves, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function WavesPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <Waves className="mr-2 h-7 w-7 text-blue-600" />
            Waves: Light and Sound
          </h1>
          <p className="text-gray-700">
            Waves are all around us - from the light that allows us to see, to the sounds we hear every day.
            Understanding waves helps students make sense of many everyday phenomena and builds a foundation for future
            learning in physics, communication technologies, and more.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Waves
        </h3>

        <Tabs defaultValue="light">
          <TabsList className="grid w-full grid-cols-2 bg-blue-100">
            <TabsTrigger value="light" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Light Waves
            </TabsTrigger>
            <TabsTrigger value="sound" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Sound Waves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="light" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Develop a model to describe that light reflecting from objects and entering
              the eye allows objects to be seen
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Explain that objects can be seen when light reflected from their surface enters the eyes</li>
              <li>Demonstrate how light travels in straight lines until it is reflected or refracted</li>
              <li>Create models showing how light reflects off surfaces at predictable angles</li>
              <li>Investigate how different surfaces reflect light differently (mirrors vs. paper)</li>
              <li>Explain the relationship between light, objects, and our ability to see</li>
            </ul>
          </TabsContent>

          <TabsContent value="sound" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Develop a model to describe that sound is produced by vibrating matter and
              can vary in volume and pitch
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Demonstrate that sound is produced by vibrating objects</li>
              <li>Investigate how sound travels through different materials (solids, liquids, gases)</li>
              <li>Explain the relationship between the rate of vibration and pitch</li>
              <li>Explore how the amplitude of vibration affects volume</li>
              <li>Design and build simple musical instruments to demonstrate sound principles</li>
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
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Understanding Light Properties
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify that light travels in straight lines</li>
                    <li>Explain how light is reflected from surfaces</li>
                    <li>Demonstrate that white light is made of many colors</li>
                    <li>Investigate how light passes through some materials and not others</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Exploring Sound Characteristics
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify that sound is produced by vibrating objects</li>
                    <li>Explain how sound travels through different media</li>
                    <li>Demonstrate how changing vibration affects pitch and volume</li>
                    <li>Investigate how sound can be absorbed or reflected by different materials</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Applying Wave Concepts
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Design and build devices that use light (periscopes, kaleidoscopes)</li>
                    <li>Create instruments that demonstrate sound principles</li>
                    <li>Explain how we use light and sound in everyday communication</li>
                    <li>Investigate how technology uses waves to transmit information</li>
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
                  <strong className="text-blue-700">Observations:</strong> Teacher observations during light and sound
                  experiments, model building, and collaborative investigations
                </li>
                <li>
                  <strong className="text-blue-700">Conversations:</strong> Student explanations of wave properties,
                  reflections on experimental results, and connections to everyday phenomena
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Performance tasks involving light reflection and sound production</li>
                  <li>Exit tickets to assess understanding of key wave concepts</li>
                  <li>Science journals for recording observations, diagrams, and conclusions</li>
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
                  <AccordionTrigger>Exploring Light Properties</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use flashlights, mirrors, and prisms for hands-on exploration of light properties</li>
                      <li>Create shadow puppets to demonstrate how light travels in straight lines</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Investigating Sound Waves</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use tuning forks, rubber bands, and drums to visualize vibrations</li>
                      <li>Create water wave demonstrations to help students visualize wave patterns</li>
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
                <li>Light and sound demonstration kits</li>
                <li>Prisms, mirrors, and lenses for light experiments</li>
                <li>Tuning forks, string instruments, and percussion tools</li>
                <li>Videos showing wave properties and behaviors</li>
                <li>OECS Grade 4 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Science journals for recording observations and reflections</li>
                <li>Materials for creating simple optical devices</li>
                <li>Components for building musical instruments</li>
                <li>Wave vocabulary cards and visual aids</li>
                <li>Interactive simulations (when technology is available)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              The Waves strand in Grade 4 helps students understand that light and sound are forms of energy that travel
              as waves. Light waves can be reflected, refracted, and absorbed, allowing us to see objects when light
              bounces off them and enters our eyes. Sound waves are created by vibrations that travel through matter,
              with pitch related to frequency and volume related to amplitude. These foundational concepts prepare
              students for more advanced study of wave phenomena in later grades.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
