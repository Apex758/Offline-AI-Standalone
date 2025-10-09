import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Shapes, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function GeometricalThinkingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade3-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Shapes className="mr-2 h-7 w-7 text-purple-600" />
            Geometrical Thinking
          </h1>
          <p className="text-gray-700">
            In Grade 3, students explore the properties of two-dimensional and three-dimensional shapes, spatial
            relationships, symmetry, and transformations. They develop their spatial reasoning and visualization skills
            while building a foundation for more advanced geometric concepts.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Geometrical Thinking
        </h3>

        <Tabs defaultValue="2d">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="2d" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              2D Shapes
            </TabsTrigger>
            <TabsTrigger value="3d" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              3D Shapes
            </TabsTrigger>
            <TabsTrigger
              value="transformations"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Transformations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="2d" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Understanding 2D Shapes and Their Properties
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify, describe, and classify 2D shapes based on their properties</li>
              <li>Recognize and draw polygons (triangles, quadrilaterals, pentagons, hexagons)</li>
              <li>Identify and describe the properties of polygons (sides, vertices, angles)</li>
              <li>Compare and contrast different types of triangles and quadrilaterals</li>
              <li>Identify and create symmetrical shapes and patterns</li>
              <li>Recognize congruent shapes</li>
            </ul>
          </TabsContent>

          <TabsContent value="3d" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Understanding 3D Shapes and Their Properties
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify, describe, and classify 3D shapes based on their properties</li>
              <li>Recognize and name prisms, pyramids, cylinders, cones, and spheres</li>
              <li>Identify and count faces, edges, and vertices of 3D shapes</li>
              <li>Describe the relationship between 2D and 3D shapes</li>
              <li>Identify 2D shapes that form the faces of 3D shapes</li>
              <li>Build 3D shapes using various materials</li>
            </ul>
          </TabsContent>

          <TabsContent value="transformations" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Understanding Transformations and Spatial Relationships
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify and describe lines, line segments, rays, and angles</li>
              <li>Recognize and create lines of symmetry in 2D shapes</li>
              <li>Describe and perform transformations (slides, flips, turns) on 2D shapes</li>
              <li>Create and extend geometric patterns and tessellations</li>
              <li>Use appropriate geometric vocabulary to describe shapes and their properties</li>
              <li>Identify and describe the location of objects using positional language</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  2D Shape Properties
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and describe various polygons based on their attributes</li>
                    <li>Compare and classify triangles according to their sides and angles</li>
                    <li>Compare and classify quadrilaterals according to their properties</li>
                    <li>Identify and draw lines of symmetry in 2D shapes</li>
                    <li>Create symmetrical designs and patterns</li>
                    <li>Recognize and create congruent shapes</li>
                    <li>Use appropriate geometric vocabulary to describe 2D shapes</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  3D Shape Properties
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and describe various 3D shapes based on their attributes</li>
                    <li>Count the faces, edges, and vertices of 3D shapes</li>
                    <li>Sort and classify 3D shapes according to their properties</li>
                    <li>Identify the 2D shapes that make up the faces of 3D shapes</li>
                    <li>Construct 3D shapes using nets or other materials</li>
                    <li>Compare and contrast different 3D shapes</li>
                    <li>Use appropriate geometric vocabulary to describe 3D shapes</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Transformations and Spatial Sense
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify and describe lines, line segments, rays, and angles in the environment</li>
                    <li>Recognize and describe slides, flips, and turns of 2D shapes</li>
                    <li>Perform transformations (slides, flips, turns) on 2D shapes</li>
                    <li>Create and extend geometric patterns using transformations</li>
                    <li>Create tessellations using regular and irregular shapes</li>
                    <li>Use positional language to describe the location of objects in space</li>
                    <li>Create and interpret simple maps and coordinate grids</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-purple-700">Observations:</strong> Teacher observations during shape
                  explorations, pattern creation, and geometric problem-solving activities
                </li>
                <li>
                  <strong className="text-purple-700">Conversations:</strong> Student explanations of shape properties,
                  transformations, and spatial relationships
                </li>
                <li>
                  <strong className="text-purple-700">Products:</strong> Student work samples, including drawings,
                  constructions, and models demonstrating geometric understanding
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                <h4 className="font-semibold mb-2 text-purple-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for shape identification and classification</li>
                  <li>Rubrics for evaluating student understanding of transformations</li>
                  <li>Performance tasks involving creating and analyzing geometric patterns</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Geometric drawing and construction tasks</li>
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
                  <AccordionTrigger>2D Shape Exploration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Shape Sorting:</strong> Provide a variety of 2D shapes for students to sort and classify
                        based on different attributes (sides, angles, symmetry).
                      </li>
                      <li>
                        <strong>Shape Hunts:</strong> Have students search for and identify different 2D shapes in the
                        classroom, school, or community environment.
                      </li>
                      <li>
                        <strong>Symmetry Activities:</strong> Use mirrors, folding paper, and drawing activities to
                        explore lines of symmetry in various shapes.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>3D Shape Exploration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>3D Shape Models:</strong> Provide a variety of 3D shape models for students to explore
                        and manipulate.
                      </li>
                      <li>
                        <strong>Building Activities:</strong> Have students construct 3D shapes using nets, straws and
                        connectors, clay, or other materials.
                      </li>
                      <li>
                        <strong>Face, Edge, Vertex Counting:</strong> Engage students in activities where they identify
                        and count the faces, edges, and vertices of various 3D shapes.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Transformation Activities</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Movement Activities:</strong> Use physical movement to demonstrate slides, flips, and
                        turns, having students move their bodies or objects in these ways.
                      </li>
                      <li>
                        <strong>Pattern Block Transformations:</strong> Have students create designs with pattern
                        blocks, then transform them through slides, flips, and turns.
                      </li>
                      <li>
                        <strong>Tessellation Exploration:</strong> Provide opportunities for students to create and
                        analyze tessellations using regular and irregular shapes.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Differentiation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Visual Supports:</strong> Use color-coding, visual cues, and concrete models to support
                        students who need additional scaffolding.
                      </li>
                      <li>
                        <strong>Tiered Activities:</strong> Adjust the complexity of geometric tasks based on students'
                        readiness levels.
                      </li>
                      <li>
                        <strong>Multiple Representations:</strong> Provide opportunities for students to demonstrate
                        their understanding through various means (drawing, building, explaining, writing).
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Incorporate partner and small group activities to
                        support peer learning and discussion of geometric concepts.
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
                <li>Pattern blocks and geometric shape sets</li>
                <li>3D shape models and nets</li>
                <li>Geoboards and geobands</li>
                <li>Mirrors for symmetry activities</li>
                <li>OECS Grade 3 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual sets of 2D and 3D shapes</li>
                <li>Grid paper and dot paper for geometric drawings</li>
                <li>Rulers, protractors, and other measuring tools</li>
                <li>Scissors and construction paper for creating shapes</li>
                <li>Geometry vocabulary cards and visual aids</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Geometrical thinking in Grade 3 builds upon students' earlier experiences with shapes and spatial
              relationships. Students develop a deeper understanding of the properties of 2D and 3D shapes, including
              more formal classification based on attributes such as sides, angles, faces, edges, and vertices. They
              explore symmetry, congruence, and transformations (slides, flips, and turns), and begin to understand the
              relationships between different shapes. Through hands-on exploration and problem-solving, students develop
              spatial reasoning skills that form the foundation for more advanced geometric concepts in later grades.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
