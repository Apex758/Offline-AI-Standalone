import type { Metadata } from "next"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Grade 3 Mathematics - Geometrical Thinking Activities",
  description: "Activities for Grade 3 Geometrical Thinking strand",
}

export default function GeometricalThinkingActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">Grade 3 Geometrical Thinking Activities</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Engaging activities to help students develop spatial sense, understand shapes, and explore geometric
          relationships.
        </p>
      </div>

      <Tabs defaultValue="spatial-sense">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spatial-sense">Spatial Sense</TabsTrigger>
          <TabsTrigger value="shapes">2D & 3D Shapes</TabsTrigger>
          <TabsTrigger value="transformations">Transformations</TabsTrigger>
        </TabsList>

        <TabsContent value="spatial-sense" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Developing Spatial Sense Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="spatial-awareness">
              <AccordionTrigger className="text-lg font-medium">Spatial Awareness Games</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Shape Hunt</h3>
                    <p className="mb-2">Students search for 2D shapes hidden in a picture or around the classroom.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Pictures with hidden shapes</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with pictures containing hidden shapes</li>
                      <li>Students identify and record the shapes they find</li>
                      <li>They can also search for shapes around the classroom</li>
                      <li>Discuss how shapes appear in different orientations</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Positional Language Game</h3>
                    <p className="mb-2">
                      Students practice using positional language to describe the location of objects.
                    </p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Small objects or toys</li>
                      <li>Grid or mat</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Place objects on a grid or around the classroom</li>
                      <li>Students take turns describing the position of an object</li>
                      <li>Other students try to identify the object based on the description</li>
                      <li>Encourage use of terms like "over," "under," "beside," "beneath"</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="visualization">
              <AccordionTrigger className="text-lg font-medium">Visualization Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">What Am I Drawing?</h3>
                    <p className="mb-2">Students follow verbal directions to create a drawing.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Paper and pencils</li>
                      <li>List of directions</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Teacher reads a series of directions</li>
                      <li>Students draw according to the directions</li>
                      <li>Directions should include specific shapes and positions</li>
                      <li>Compare drawings at the end to see if everyone created the same image</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mental Rotation</h3>
                    <p className="mb-2">Students practice mentally rotating shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Shape cards</li>
                      <li>Rotation cards (90°, 180°, 270°)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Show students a shape</li>
                      <li>Ask them to visualize the shape rotated by a certain amount</li>
                      <li>Students draw what they think the rotated shape looks like</li>
                      <li>Compare with the actual rotated shape</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="shapes" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">2D and 3D Shapes Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="2d-shapes">
              <AccordionTrigger className="text-lg font-medium">Exploring 2D Shapes</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Shape Sorting</h3>
                    <p className="mb-2">Students sort shapes based on their attributes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Shape cards or manipulatives</li>
                      <li>Sorting mats</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with a variety of 2D shapes</li>
                      <li>Ask them to sort the shapes based on different attributes</li>
                      <li>Attributes can include number of sides, corners, or other properties</li>
                      <li>Students explain their sorting criteria</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Geoboard Shapes</h3>
                    <p className="mb-2">Students create 2D shapes on geoboards.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Geoboards</li>
                      <li>Rubber bands</li>
                      <li>Shape cards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create various 2D shapes on geoboards</li>
                      <li>They identify the properties of each shape</li>
                      <li>Challenge students to create shapes with specific attributes</li>
                      <li>Students can record their shapes on dot paper</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="3d-shapes">
              <AccordionTrigger className="text-lg font-medium">Exploring 3D Shapes</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">3D Shape Hunt</h3>
                    <p className="mb-2">Students identify 3D shapes in the environment.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>3D shape reference cards</li>
                      <li>Recording sheets</li>
                      <li>Cameras (optional)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students search for 3D shapes in the classroom or school</li>
                      <li>They record or photograph the objects they find</li>
                      <li>Students identify the 3D shape of each object</li>
                      <li>Class creates a display of 3D shapes in the environment</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Building 3D Shapes</h3>
                    <p className="mb-2">Students construct 3D shapes using various materials.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Toothpicks or straws</li>
                      <li>Marshmallows or clay</li>
                      <li>3D shape cards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students use toothpicks and marshmallows to build 3D shapes</li>
                      <li>They count the edges, vertices, and faces of each shape</li>
                      <li>Students compare different 3D shapes</li>
                      <li>They identify the 2D shapes that make up the faces of 3D shapes</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="nets">
              <AccordionTrigger className="text-lg font-medium">Nets of 3D Shapes</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Net Construction</h3>
                    <p className="mb-2">Students create nets and fold them to make 3D shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Net templates</li>
                      <li>Cardstock</li>
                      <li>Scissors and tape</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with net templates</li>
                      <li>They cut out the nets and fold them to create 3D shapes</li>
                      <li>Students identify the 2D shapes in each net</li>
                      <li>They compare different nets for the same 3D shape</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Net Matching</h3>
                    <p className="mb-2">Students match nets to their corresponding 3D shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Net cards</li>
                      <li>3D shape models</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students match net cards to 3D shape models</li>
                      <li>They explain how they know which net corresponds to which shape</li>
                      <li>Challenge students to identify multiple nets for the same shape</li>
                      <li>Students create their own nets for specific 3D shapes</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="transformations" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Transformations Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="symmetry">
              <AccordionTrigger className="text-lg font-medium">Exploring Symmetry</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Symmetry Art</h3>
                    <p className="mb-2">Students create symmetrical designs and identify lines of symmetry.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Paper</li>
                      <li>Paint or markers</li>
                      <li>Mirrors</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students fold paper in half</li>
                      <li>They paint or draw on one side of the fold</li>
                      <li>While the paint is still wet, they fold the paper to create a symmetrical design</li>
                      <li>Students identify the line of symmetry in their artwork</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Symmetry Hunt</h3>
                    <p className="mb-2">Students find examples of symmetry in the environment.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Mirrors</li>
                      <li>Recording sheets</li>
                      <li>Cameras (optional)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students search for symmetrical objects in the classroom or school</li>
                      <li>They use mirrors to verify lines of symmetry</li>
                      <li>Students record or photograph the symmetrical objects</li>
                      <li>Class creates a display of symmetrical objects</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="composing-decomposing">
              <AccordionTrigger className="text-lg font-medium">Composing and Decomposing Shapes</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Tangram Puzzles</h3>
                    <p className="mb-2">Students use tangram pieces to create different shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Tangram sets</li>
                      <li>Tangram puzzle cards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide each student with a tangram set</li>
                      <li>Students use the pieces to create different shapes</li>
                      <li>They can follow puzzle cards or create their own designs</li>
                      <li>Students identify the shapes used in their creations</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Shape Puzzles</h3>
                    <p className="mb-2">Students decompose and recompose shapes to solve puzzles.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Pattern blocks</li>
                      <li>Shape puzzle templates</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with pattern blocks</li>
                      <li>They use the blocks to fill in shape outlines</li>
                      <li>Students identify the shapes used in each puzzle</li>
                      <li>They create their own shape puzzles for classmates to solve</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Online Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Games</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="https://www.splashlearn.com/math-skills/third-grade/geometry"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    SplashLearn Geometry Games
                  </Link>
                </li>
                <li>
                  <Link to="https://www.mathplayground.com/grade_3_games.html"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Playground Geometry Games
                  </Link>
                </li>
                <li>
                  <Link to="https://www.abcya.com/grades/3/skill/geometry"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    ABCya Geometry Games
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Printable Worksheets</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="https://www.k5learning.com/free-math-worksheets/third-grade-3/geometry"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    K5 Learning Geometry Worksheets
                  </Link>
                </li>
                <li>
                  <Link to="https://www.mathworksheets4kids.com/geometry.php"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Worksheets 4 Kids Geometry
                  </Link>
                </li>
                <li>
                  <Link to="https://www.math-salamanders.com/3rd-grade-geometry.html"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Salamanders Geometry Worksheets
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="https://www.khanacademy.org/math/cc-third-grade-math/3rd-basic-geometry"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Khan Academy Geometry
                  </Link>
                </li>
                <li>
                  <Link to="https://www.youtube.com/playlist?list=PLQlHzK9o1Hd8MtT7UT8f6EHsFZF4RQfzL"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Antics Geometry Videos
                  </Link>
                </li>
                <li>
                  <Link to="https://www.brainpop.com/math/geometryandmeasurement/"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    BrainPOP Geometry Videos
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
