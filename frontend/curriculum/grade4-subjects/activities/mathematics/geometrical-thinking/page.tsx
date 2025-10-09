import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Grade 4 Mathematics - Geometrical Thinking Activities",
  description: "Activities for Grade 4 Geometrical Thinking strand",
}

export default function GeometricalThinkingActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          {
            label: "Geometrical Thinking Activities",
            href: "/curriculum/grade4-subjects/activities/mathematics/geometrical-thinking",
          },
        ]}
      />

      <div className="mb-8 mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-2 text-amber-800">Grade 4 Geometrical Thinking Activities</h1>
            <p className="text-gray-600">
              Engaging activities to help students understand geometric concepts, including angles, lines, shapes, and
              symmetry.
            </p>
          </div>
          <div className="md:w-1/4 flex justify-center mt-4 md:mt-0">
            <img
              src="/placeholder.svg?height=120&width=120&query=geometric shapes math"
              alt="Geometric shapes illustration"
              className="rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="angles-lines">
        <TabsList className="grid w-full grid-cols-5 bg-amber-50">
          <TabsTrigger
            value="angles-lines"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
          >
            Angles & Lines
          </TabsTrigger>
          <TabsTrigger
            value="2d-shapes"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
          >
            2D Shapes
          </TabsTrigger>
          <TabsTrigger
            value="3d-shapes"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
          >
            3D Shapes
          </TabsTrigger>
          <TabsTrigger value="symmetry" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
            Symmetry
          </TabsTrigger>
          <TabsTrigger
            value="online-resources"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
          >
            Online Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="angles-lines" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Angles & Lines Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=angles and lines geometry math"
              alt="Angles and lines in geometry"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="angle-exploration">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Angle Exploration
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Angle Hunt</h3>
                    <p className="mb-2">Students identify and classify angles in the environment.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Angle finders or protractors</li>
                      <li>Recording sheets</li>
                      <li>Cameras (optional)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students search for angles in the classroom or school</li>
                      <li>They classify angles as acute, right, obtuse, or straight</li>
                      <li>Students estimate and then measure angles</li>
                      <li>They create a display of different angles found</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Angle Makers</h3>
                    <p className="mb-2">Students create and measure angles.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Protractors</li>
                      <li>Angle rulers or straws</li>
                      <li>Paper</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create angles of specified measures</li>
                      <li>They label and classify each angle</li>
                      <li>Students explore how angles change when arms are extended</li>
                      <li>They investigate the sum of angles in various polygons</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="line-exploration">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Line Exploration
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Line Relationships</h3>
                    <p className="mb-2">Students identify and create different line relationships.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Rulers</li>
                      <li>Colored pencils</li>
                      <li>Grid paper</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students draw lines on grid paper</li>
                      <li>They identify parallel, perpendicular, and intersecting lines</li>
                      <li>Students measure angles formed by intersecting lines</li>
                      <li>They create designs using line relationships</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Line Symmetry</h3>
                    <p className="mb-2">Students explore line symmetry in shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Mirrors</li>
                      <li>Folding paper</li>
                      <li>Shape templates</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students fold paper to create a line of symmetry</li>
                      <li>They cut out shapes along the fold</li>
                      <li>Students unfold to reveal symmetric shapes</li>
                      <li>They discuss the properties of symmetric shapes</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="2d-shapes" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">2D Shapes Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=2D shapes polygons geometry"
              alt="2D shapes and polygons"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="polygon-classification">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Polygon Classification
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Polygon Sort</h3>
                    <p className="mb-2">Students sort polygons based on their properties.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Polygon cards or shapes</li>
                      <li>Sorting mats</li>
                      <li>Property cards</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students sort polygons by number of sides</li>
                      <li>They sort polygons by other properties (regular/irregular, convex/concave)</li>
                      <li>Students create Venn diagrams to show overlapping properties</li>
                      <li>They explain their sorting criteria and justify their classifications</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Polygon Construction</h3>
                    <p className="mb-2">Students construct polygons with specific properties.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Geoboards and rubber bands</li>
                      <li>Dot paper</li>
                      <li>Rulers and protractors</li>
                      <li>Property challenge cards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students draw challenge cards with specific polygon properties</li>
                      <li>They construct polygons that match the given properties</li>
                      <li>Students record their constructions on dot paper</li>
                      <li>They explain how their polygon meets the required properties</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="quadrilateral-focus">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Quadrilateral Focus
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Quadrilateral Hierarchy</h3>
                    <p className="mb-2">Students explore the relationships between different quadrilaterals.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Quadrilateral cards</li>
                      <li>Property cards</li>
                      <li>Hierarchy diagram templates</li>
                      <li>Colored pencils or markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students identify properties of different quadrilaterals</li>
                      <li>They create a hierarchy diagram showing relationships</li>
                      <li>Students discuss how some quadrilaterals are special cases of others</li>
                      <li>They explain why a square is a rectangle, but not all rectangles are squares</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Quadrilateral Riddles</h3>
                    <p className="mb-2">Students solve and create riddles about quadrilaterals.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Riddle cards</li>
                      <li>Quadrilateral reference sheets</li>
                      <li>Drawing materials</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students read riddles describing properties of quadrilaterals</li>
                      <li>They identify the quadrilateral being described</li>
                      <li>Students create their own riddles for classmates to solve</li>
                      <li>They use precise mathematical language to describe properties</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="3d-shapes" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">3D Shapes Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=3D shapes geometry math"
              alt="3D shapes and geometric solids"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shape-identification">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Shape Identification
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">3D Shape Sort</h3>
                    <p className="mb-2">Students sort 3D shapes based on their properties.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>3D shape models</li>
                      <li>Sorting mats</li>
                      <li>Property cards</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students sort 3D shapes by faces, edges, and vertices</li>
                      <li>They sort shapes by other properties (regular/irregular, convex/concave)</li>
                      <li>Students create Venn diagrams to show overlapping properties</li>
                      <li>They explain their sorting criteria and justify their classifications</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Shape Construction</h3>
                    <p className="mb-2">Students construct 3D shapes with specific properties.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Building blocks or nets</li>
                      <li>Property challenge cards</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students draw challenge cards with specific 3D shape properties</li>
                      <li>They construct shapes that match the given properties</li>
                      <li>Students record their constructions</li>
                      <li>They explain how their shape meets the required properties</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shape-properties">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Shape Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Surface Area Exploration</h3>
                    <p className="mb-2">Students explore the surface area of 3D shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>3D shape models</li>
                      <li>Net templates</li>
                      <li>Measuring tape or rulers</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students measure the dimensions of 3D shapes</li>
                      <li>They calculate the surface area using formulas</li>
                      <li>Students compare the surface areas of different shapes</li>
                      <li>They discuss how surface area changes with dimensions</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Volume Investigation</h3>
                    <p className="mb-2">Students investigate the volume of 3D shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>3D shape models</li>
                      <li>Water displacement containers</li>
                      <li>Measuring cups</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students measure the dimensions of 3D shapes</li>
                      <li>They calculate the volume using formulas</li>
                      <li>Students measure the volume of shapes using water displacement</li>
                      <li>They compare the calculated and measured volumes</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="symmetry" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Symmetry Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=symmetry reflection geometry"
              alt="Symmetry and reflections in geometry"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="line-symmetry">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Line Symmetry
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Symmetry Hunt</h3>
                    <p className="mb-2">Students identify and create line-symmetric shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Mirrors</li>
                      <li>Folding paper</li>
                      <li>Symmetry templates</li>
                      <li>Digital cameras or tablets (optional)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students search for examples of line symmetry in the classroom and school</li>
                      <li>They use mirrors to verify lines of symmetry</li>
                      <li>Students record their findings with drawings or photographs</li>
                      <li>They classify objects by number of lines of symmetry</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Symmetry Art</h3>
                    <p className="mb-2">Students create artwork with line symmetry.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Construction paper</li>
                      <li>Scissors</li>
                      <li>Colored pencils or markers</li>
                      <li>Grid paper</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students fold paper to create a line of symmetry</li>
                      <li>They create half of a design and cut along the fold</li>
                      <li>Students unfold to reveal a symmetric design</li>
                      <li>They create designs with multiple lines of symmetry</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rotational-symmetry">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Rotational Symmetry
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Rotational Symmetry Investigation</h3>
                    <p className="mb-2">Students explore rotational symmetry in shapes and designs.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Shape cards</li>
                      <li>Tracing paper</li>
                      <li>Push pins</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students trace shapes onto tracing paper</li>
                      <li>They rotate the tracing paper around a center point</li>
                      <li>Students identify how many times the shape matches itself in one complete rotation</li>
                      <li>They determine the order of rotational symmetry for various shapes</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Symmetric Patterns</h3>
                    <p className="mb-2">Students create patterns with both line and rotational symmetry.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Pattern blocks</li>
                      <li>Grid paper</li>
                      <li>Circular templates</li>
                      <li>Colored pencils or markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create designs with pattern blocks</li>
                      <li>They identify and record the symmetry properties of their designs</li>
                      <li>Students create mandalas with rotational symmetry</li>
                      <li>They explain the symmetry properties of their creations</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="online-resources" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Online Resources for Geometrical Thinking</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=digital geometry resources"
              alt="Digital geometry resources and tools"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="interactive-tools">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Interactive Tools
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Geometry Tools</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.geogebra.org/geometry"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          GeoGebra: Geometry
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive geometry tool for exploring shapes and properties.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.mathplayground.com/geoboard.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Playground: Geoboard
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Virtual geoboard for creating and exploring shapes.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Angle and Line Resources</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathplayground.com/measuringangles.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Playground: Measuring Angles
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tool for measuring angles.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.visnos.com/demos/basic-angles"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visnos: Interactive Protractor
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Virtual protractor for measuring and creating angles.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shape-resources">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Shape Resources
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">2D Shape Resources</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathsisfun.com/geometry/polygons.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math is Fun: Polygons
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Explanation and interactive examples of polygons.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.khanacademy.org/math/cc-fourth-grade-math/cc-4th-geometry-topic"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Khan Academy: Geometry
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Video lessons and practice on 2D shapes.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">3D Shape Resources</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathsisfun.com/geometry/3d-shapes.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math is Fun: 3D Shapes
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive 3D shapes with properties and nets.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Geometric-Solids/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          NCTM Illuminations: Geometric Solids
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tool for exploring 3D shapes.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="symmetry-resources">
              <AccordionTrigger className="text-lg font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-t-md px-4">
                Symmetry Resources
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-amber-50 dark:bg-slate-800 rounded-md border border-amber-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Line Symmetry</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathsisfun.com/geometry/symmetry.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math is Fun: Symmetry
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Explanation and interactive examples of symmetry.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.visnos.com/demos/symmetry"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visnos: Symmetry
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tool for exploring line symmetry.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Rotational Symmetry</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathsisfun.com/geometry/rotational-symmetry.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math is Fun: Rotational Symmetry
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Explanation and examples of rotational symmetry.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.geogebra.org/m/Ue23auZV"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          GeoGebra: Rotational Symmetry
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive demonstration of rotational symmetry.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}
