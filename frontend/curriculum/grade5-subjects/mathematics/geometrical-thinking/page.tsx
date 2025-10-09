import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5MathematicsGeometryPage() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Geometrical Thinking", href: "/curriculum/grade5-subjects/mathematics/geometrical-thinking" },
        ]}
      />
      <Link href="/curriculum/grade5-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Mathematics
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Grade 5 Mathematics - Geometrical Thinking
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore the Geometrical Thinking strand of the Grade 5 Mathematics curriculum. Develop spatial reasoning and
            understanding of geometric properties and relationships.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Geometrical Thinking
        </h3>

        <Tabs defaultValue="2d-shapes">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger value="2d-shapes" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              2D Shapes & Properties
            </TabsTrigger>
            <TabsTrigger
              value="coordinate-geometry"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Coordinate Geometry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="2d-shapes" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: 2D Shapes and Properties</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Classify two-dimensional figures into categories based on their properties</li>
              <li>Understand that attributes belonging to a category also belong to all subcategories</li>
              <li>Recognize and describe properties of triangles and quadrilaterals</li>
              <li>Identify and create geometric patterns using shapes</li>
            </ul>
          </TabsContent>

          <TabsContent
            value="coordinate-geometry"
            className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200"
          >
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Coordinate Geometry and Transformations
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Graph points on the coordinate plane to solve real-world and mathematical problems</li>
              <li>
                Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines
              </li>
              <li>Understand and apply concepts of symmetry and transformations</li>
              <li>Solve problems involving area and perimeter of rectangles</li>
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
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Shape Classification
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Classify triangles by their sides (scalene, isosceles, equilateral)</li>
                    <li>Classify triangles by their angles (acute, right, obtuse)</li>
                    <li>Identify properties of quadrilaterals</li>
                    <li>Understand hierarchical relationships among shapes</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Coordinate Plane
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Plot points on coordinate plane using ordered pairs</li>
                    <li>Create shapes using coordinate points</li>
                    <li>Find distances between points on coordinate plane</li>
                    <li>Solve real-world problems using coordinate geometry</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Area & Perimeter
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Calculate area of rectangles using formula</li>
                    <li>Calculate perimeter of rectangles and other polygons</li>
                    <li>Solve real-world problems involving area and perimeter</li>
                    <li>Understand relationship between area and perimeter</li>
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
                  <strong className="text-indigo-700">Observations:</strong> Shape identification and classification
                  tasks
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Geometric reasoning and explanations
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Coordinate graphing and measurement activities
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Shape sorting and classification activities</li>
                  <li>Coordinate plotting accuracy checks</li>
                  <li>Area and perimeter problem-solving tasks</li>
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
                      <li>Use geometric shapes and pattern blocks</li>
                      <li>Use coordinate grids and graphing materials</li>
                      <li>Use measuring tools for area and perimeter</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Visual Aids</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use shape classification charts</li>
                      <li>Use coordinate plane posters</li>
                      <li>Use geometric property diagrams</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Real-World Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Connect geometry to architecture and design</li>
                      <li>Use coordinate systems in maps and navigation</li>
                      <li>Apply area and perimeter to real spaces</li>
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
              <li>Coordinate grid boards and paper</li>
              <li>Rulers, protractors, and measuring tools</li>
              <li>Tangrams and geometric puzzles</li>
              <li>Geoboards and rubber bands</li>
              <li>3D shape models for reference</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Digital Resources</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive geometry software</li>
              <li>Virtual coordinate plane tools</li>
              <li>Shape classification games</li>
              <li>Area and perimeter calculators</li>
              <li>Educational videos on geometric concepts</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Recommended Reading</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Geometry and Spatial Sense" by National Council of Teachers of Mathematics</li>
            <li>"Teaching Geometry in Grades 3-5" by Catherine Fosnot</li>
            <li>"Spatial Sense and Geometry" by Joanne Mulligan</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
