import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade4MathematicsGeometryPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4 Subjects", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          { label: "Geometrical Thinking", href: "/curriculum/grade4-subjects/mathematics/geometrical-thinking" },
        ]}
      />
      <Link href="/curriculum/grade4-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Mathematics
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Grade 4 Mathematics - Geometrical Thinking
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Geometrical Thinking strand of the Grade 4 Mathematics curriculum. Develop spatial reasoning
            skills, analyze shapes and their attributes, and understand geometric relationships.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Geometrical Thinking
        </h3>

        <Tabs defaultValue="analyzing-shapes">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger
              value="analyzing-shapes"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Analyzing Shapes
            </TabsTrigger>
            <TabsTrigger
              value="transforming-shapes"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Transforming Shapes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzing-shapes" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Exploring and Analyzing Geometric Shapes and Relationships
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Use language and gestures that describes shape and space orally and in writing</li>
              <li>Visualize how a 3D solid can be created by folding a 2D net</li>
              <li>Recognize shapes in various points of view and from various distances</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="transforming-shapes"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Composing, Decomposing, and Transforming Shapes
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Construct quadrilaterals using concrete materials</li>
              <li>Construct composite shapes (various quadrilaterals) from congruent polygons</li>
              <li>Construct nets for a given 3-D shape</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-teal-50">
            <CardTitle className="text-teal-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Analyzing Shapes
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Describe shapes in real-life settings using written language or using gestures</li>
                    <li>Describe shapes in the picture using written language or gestures</li>
                    <li>Recognize shapes in pictures or patterns</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Transforming Shapes
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Construct quadrilaterals using concrete materials</li>
                    <li>Construct composite shapes (various quadrilaterals) from congruent polygons</li>
                    <li>Construct nets for a given 3-D shape</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-indigo-700">Observations:</strong> Teacher observations during activities
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Student explanations and discussions
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Student work samples and completed tasks
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for geometrical thinking skills</li>
                  <li>Rubrics for evaluating student-created models</li>
                  <li>Performance tasks involving real-world applications</li>
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
                  <AccordionTrigger>Concrete Materials</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use geometric solids to explore shapes</li>
                      <li>Use nets to construct 3D shapes</li>
                      <li>Use tangrams to create composite shapes</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Aids</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use diagrams to illustrate shapes</li>
                      <li>Use charts to organize shape attributes</li>
                      <li>Use models to represent 3D objects</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect shapes to real-world objects</li>
                      <li>Use shapes in art and design</li>
                      <li>Use shapes in architecture</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 p-6 rounded-xl shadow-md border border-purple-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Additional Resources and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Manipulatives</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Geometric solids</li>
              <li>Pattern blocks</li>
              <li>Tangrams</li>
              <li>Geoboards</li>
              <li>Mirrors for symmetry</li>
              <li>Protractors and rulers</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive geometry software</li>
              <li>Virtual manipulatives for shapes</li>
              <li>3D shape exploration tools</li>
              <li>Symmetry and transformation games</li>
              <li>Educational videos on geometry</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-purple-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Exploring Geometry" by Michael Serra</li>
            <li>"Teaching Mathematics Through Problem Solving: Grades K-6" by Frank K. Lester</li>
            <li>"Hands-On Geometry: Constructions with Straightedge and Compass" by Christopher M. Freeman</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
