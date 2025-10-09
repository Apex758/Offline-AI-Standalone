import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck, ChevronRight } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6MathematicsGeometricalThinkingPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Mathematics", href: "/curriculum/grade6-subjects/mathematics" },
          { label: "Geometrical Thinking", href: "/curriculum/grade6-subjects/mathematics/geometrical-thinking" },
        ]}
      />
      <Link href="/curriculum/grade6-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Mathematics
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Grade 6 Mathematics - Geometrical Thinking
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Geometrical Thinking strand of the Grade 6 Mathematics curriculum. Develop skills in
            understanding and applying geometrical concepts, transformations, and spatial reasoning.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Geometrical Thinking
        </h3>

        <Tabs defaultValue="explore-analyse-shapes">
          <TabsList className="grid w-full grid-cols-3 bg-indigo-100">
            <TabsTrigger
              value="explore-analyse-shapes"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
            >
              Explore & Analyse Shapes
            </TabsTrigger>
            <TabsTrigger
              value="recognizing-naming-shapes"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
            >
              Recognizing & Naming Shapes
            </TabsTrigger>
            <TabsTrigger
              value="composing-transforming"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
            >
              Composing & Transforming
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="explore-analyse-shapes"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Explore and Analyse Geometric Shapes and Relationships
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Use language and gestures that describe shape, objects, and space orally and in writing</li>
              <li>Describe a picture or object in real world contexts or an object undergoing a transformation</li>
              <li>Identify and categorize various types of quadrilaterals based on their characteristics</li>
              <li>Compile comprehensive lists of geometric properties for each type of quadrilateral</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="recognizing-naming-shapes"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Recognizing, Naming and Describing Shapes
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Recognize, name and classify angles (acute, right, obtuse, reflex)</li>
              <li>Recognize angle relationships (complementary, supplementary, vertically opposite)</li>
              <li>Identify angles created by parallel lines and transversals</li>
              <li>Recognize, name and create tessellations</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="composing-transforming"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Composing, Decomposing and Transforming Shapes
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Represent, construct and deconstruct 3D shapes and objects</li>
              <li>Represent and construct angles using a straightedge and protractor</li>
              <li>
                Recognize, name, perform and draw transformations (reflections, rotations, translations, dilations)
              </li>
              <li>Create and analyze tessellations using various geometric shapes</li>
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
            <CardDescription>By the end of Grade Six, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Quadrilaterals and Properties
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Identify and categorize various types of quadrilaterals (squares, rectangles, rhombuses,
                      parallelograms, trapezoids) based on their characteristics
                    </li>
                    <li>
                      Compile comprehensive lists of geometric properties for each type of quadrilateral, including
                      number of sides and angles, lengths of opposite sides, measures of interior angles, and
                      relationships between sides and angles
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Angle Relationships
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Recognize angle relationships (complementary, supplementary, vertically opposite angles and angles
                      created by parallel lines and transversals)
                    </li>
                    <li>
                      Describe angle relationships and use them to solve problems involving unknown angle measures
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Transformations and Tessellations
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Recognize, name and create tessellations using regular and irregular polygons</li>
                    <li>
                      Recognize, name, perform and draw transformations (reflections, rotations, translations and
                      dilations) on coordinate planes
                    </li>
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
                  <strong className="text-indigo-700">Observations:</strong> Geometric construction and transformation
                  processes
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Spatial reasoning and geometric property
                  discussions
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Geometric drawings, tessellations, and 3D
                  models
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Geometric construction rubrics</li>
                  <li>Angle measurement accuracy checks</li>
                  <li>Transformation portfolio assessments</li>
                  <li>Tessellation design projects</li>
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
                      <li>Use geometric shapes and pattern blocks for hands-on exploration</li>
                      <li>Use protractors and angle measurers for accurate constructions</li>
                      <li>Use 3D geometric solids and nets for spatial understanding</li>
                      <li>Use tangrams and tessellation tiles for transformation activities</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Representations</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use coordinate grids for transformation mapping</li>
                      <li>Use geometric property charts and diagrams</li>
                      <li>Use angle relationship visual aids</li>
                      <li>Use tessellation pattern examples and templates</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect geometry to architecture and design</li>
                      <li>Use art and cultural patterns for tessellation studies</li>
                      <li>Apply transformations to computer graphics and animation</li>
                      <li>Explore geometric shapes in nature and everyday objects</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 rounded-xl shadow-md border border-indigo-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Additional Resources and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Manipulatives</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Geometric shapes and pattern blocks</li>
              <li>Protractors and angle measurers</li>
              <li>Rulers and straightedges</li>
              <li>Compasses for circle construction</li>
              <li>3D geometric solids and nets</li>
              <li>Tangrams and tessellation materials</li>
              <li>Coordinate grid boards and markers</li>
              <li>Transformation mirrors and tracing paper</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Virtual geometry construction tools (GeoGebra)</li>
              <li>Interactive angle measurement activities</li>
              <li>3D shape exploration software</li>
              <li>Transformation and tessellation games</li>
              <li>Educational videos on geometric concepts</li>
              <li>Online coordinate plane activities</li>
              <li>Virtual protractor and ruler tools</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Geometry and Spatial Sense" by Catherine Twomey Fosnot</li>
            <li>"Teaching Geometry According to the Common Core Standards" by Laurie Boswell</li>
            <li>"Developing Geometric Reasoning in Grades K-8" by Douglas Clements</li>
            <li>"Transformational Geometry" by Richard Brown</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link
            href="/curriculum/grade6-subjects/activities/mathematics/geometrical-thinking"
            className="flex items-center"
          >
            <span className="mr-2">View Geometrical Thinking Activities</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
