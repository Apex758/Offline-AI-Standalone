import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"

export default function ShapeDetectivesActivity() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 2 Subjects", href: "/curriculum/grade2-subjects" },
            { label: "Mathematics", href: "/curriculum/grade2-subjects/mathematics" },
            { label: "Activities", href: "/curriculum/grade2-subjects/activities/mathematics" },
            {
              label: "Shape Detectives",
              href: "/curriculum/grade2-subjects/activities/mathematics/shape-detectives",
            },
          ]}
        />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shape Detectives</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <span className="mr-4">Time: 40 minutes</span>
          <span>Difficulty: Easy</span>
        </div>
        <img
          src="/placeholder.svg?height=300&width=800"
          alt="Shape Detectives Activity"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                In this activity, students become "shape detectives" as they identify and classify 2D and 3D shapes in
                their environment. They will explore the attributes of various shapes, create shape-based art, and
                develop geometric vocabulary through hands-on investigation and creative expression.
              </p>
              <p>
                Students will hunt for shapes around the classroom and school, analyze their properties, and use their
                findings to create artistic compositions. This activity connects geometry to the real world while
                developing spatial reasoning and classification skills.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Identify and name 2D shapes: circle, square, rectangle, triangle, hexagon, pentagon</li>
                <li>Identify and name 3D shapes: cube, sphere, cylinder, cone, rectangular prism</li>
                <li>Describe attributes of shapes (sides, corners, faces, edges, vertices)</li>
                <li>Classify shapes based on their properties</li>
                <li>Recognize shapes in different orientations and sizes</li>
                <li>Create artistic compositions using geometric shapes</li>
                <li>Use geometric vocabulary accurately in discussions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Materials</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Shape identification cards (2D and 3D shapes)</li>
                <li>Clipboards and pencils</li>
                <li>Shape detective recording sheets</li>
                <li>Digital cameras or tablets (optional)</li>
                <li>Geometric shape manipulatives</li>
                <li>Construction paper in various colors</li>
                <li>Scissors and glue sticks</li>
                <li>Shape templates and stencils</li>
                <li>Magnifying glasses (for fun detective work)</li>
                <li>Chart paper for class findings</li>
                <li>Markers and crayons</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Preparation</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Create shape identification reference cards for student use</li>
                <li>Prepare detective recording sheets with shape categories</li>
                <li>Set up art station with construction paper and supplies</li>
                <li>Identify good locations for shape hunting (classroom, hallway, playground)</li>
                <li>Gather various 3D shape manipulatives for hands-on exploration</li>
                <li>Create vocabulary word wall with shape names and attributes</li>
                <li>Prepare example shape art to inspire student creativity</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Steps</h2>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>Shape Review and Introduction (8 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Review 2D and 3D shapes using manipulatives and shape cards</li>
                    <li>Practice naming shapes and describing their attributes</li>
                    <li>Introduce detective vocabulary: investigate, classify, attributes, properties</li>
                    <li>Show examples of shapes found in the environment</li>
                    <li>Explain the shape detective mission and recording process</li>
                  </ul>
                </li>
                <li>
                  <strong>Shape Hunt Investigation (15 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Students work in pairs with clipboards and recording sheets</li>
                    <li>Hunt for shapes in designated areas (classroom, hallway, library)</li>
                    <li>Record findings by drawing or writing location of each shape</li>
                    <li>Take photos of interesting shape discoveries (if cameras available)</li>
                    <li>Encourage looking at objects from different angles</li>
                    <li>Teacher circulates asking guiding questions about shape attributes</li>
                  </ul>
                </li>
                <li>
                  <strong>Data Analysis and Sharing (7 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Pairs return to share their most interesting discoveries</li>
                    <li>Create a class chart organizing findings by shape type</li>
                    <li>Discuss which shapes were most/least common in the environment</li>
                    <li>Compare different examples of the same shape</li>
                    <li>Introduce concept that shapes can be different sizes but same type</li>
                  </ul>
                </li>
                <li>
                  <strong>Shape Art Creation (10 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Students create artistic compositions using cut-out shapes</li>
                    <li>Provide various colored paper and shape templates</li>
                    <li>Encourage creativity: animals, buildings, abstract designs</li>
                    <li>Students must use at least 5 different shapes in their artwork</li>
                    <li>Label each shape used in the composition</li>
                    <li>Share artwork and describe the shapes used</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Differentiation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Support:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Focus on basic shapes: circle, square, rectangle, triangle</li>
                    <li>Provide shape reference cards to carry during hunt</li>
                    <li>Use pre-cut shapes for art activity</li>
                    <li>Work with a supportive partner or adult volunteer</li>
                    <li>Allow verbal descriptions instead of written recording</li>
                    <li>Start with obvious, large examples of shapes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Challenge:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Include more complex shapes: pentagon, hexagon, octagon</li>
                    <li>Identify shapes within shapes (composite figures)</li>
                    <li>Measure and compare attributes (count sides, angles)</li>
                    <li>Create 3D art using boxes and cylinders</li>
                    <li>Research why certain shapes are used in architecture</li>
                    <li>Design their own shape hunt for other classes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Assessment</h2>
              <p className="mb-4">Observe students during the activity and look for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accurate identification and naming of 2D and 3D shapes</li>
                <li>Appropriate use of geometric vocabulary</li>
                <li>Ability to describe shape attributes (sides, corners, faces)</li>
                <li>Recognition of shapes in various orientations and contexts</li>
                <li>Systematic recording and organization of findings</li>
                <li>Creative and accurate use of shapes in art compositions</li>
                <li>Collaborative skills during partner work</li>
              </ul>
              <p className="mt-4">
                Collect recording sheets and artwork to assess understanding. Use a simple checklist to track which
                shapes each student can identify and name correctly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Extensions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create a classroom shape museum with labeled examples and descriptions</li>
                <li>Take shape hunt field trips to local buildings, parks, or museums</li>
                <li>Use technology to create digital shape collages or presentations</li>
                <li>Explore cultural art forms that feature geometric patterns</li>
                <li>Build 3D structures using various geometric solids</li>
                <li>Create shape riddles for other students to solve</li>
                <li>Connect to architecture by studying famous buildings and their shapes</li>
                <li>Plant a garden using geometric patterns and shapes</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Shape Identification Cards
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Detective Recording Sheets
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Shape Templates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Assessment Checklist
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Curriculum Connections</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Geometry:</h3>
                    <p className="text-sm">2D and 3D shape identification and classification</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Art:</h3>
                    <p className="text-sm">Creating compositions using geometric elements</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Language Arts:</h3>
                    <p className="text-sm">Descriptive vocabulary and communication skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Teacher Tips</h2>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Create a shape word wall with visual references</li>
                  <li>Use consistent language when describing shape attributes</li>
                  <li>Encourage students to use hands to trace shape outlines</li>
                  <li>Connect shapes to familiar objects (ball = sphere, box = cube)</li>
                  <li>Display student artwork to celebrate geometric creativity</li>
                  <li>Take photos of shape discoveries for future reference</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ChevronLeft size={16} />
                Previous Activity
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                Next Activity
                <ChevronRight size={16} />
              </Button>
            </div>

            <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2 bg-transparent">
              <Printer size={16} />
              Print Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
