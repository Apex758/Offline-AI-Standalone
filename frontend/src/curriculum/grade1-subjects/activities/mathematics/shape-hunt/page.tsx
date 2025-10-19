import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shapes, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function ShapeHuntPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Shape Hunt
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A geometry activity where students explore their environment to discover and identify 2D shapes, 
            developing spatial awareness and geometric thinking skills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shapes className="h-5 w-5 text-emerald-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Shape Hunt is an engaging geometry activity that transforms students into shape detectives as they 
                explore the classroom and school environment to find examples of different 2D shapes. This hands-on 
                approach helps young learners develop spatial awareness, recognize geometric properties, and understand 
                how shapes are used in the real world. Students create visual collages of their discoveries, building 
                a concrete understanding of geometric concepts.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/g1math-shape-hunt.png" alt="Shape Hunt Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Identify and name common 2D shapes (circle, square, triangle, rectangle)</li>
                <li>Recognize shapes in real-world objects and environments</li>
                <li>Develop spatial awareness and geometric thinking</li>
                <li>Practice observation and classification skills</li>
                <li>Build geometric vocabulary and communication skills</li>
                <li>Create visual representations of mathematical concepts</li>
                <li>Connect classroom learning to everyday experiences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 6:</strong> Learners will use mathematical language and symbols to communicate 
                  mathematical thinking.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 6.1: Use mathematical language</li>
                  <li>SCO 6.2: Use mathematical symbols</li>
                  <li>SCO 6.3: Communicate mathematical thinking</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 7:</strong> Learners will use spatial relationships to solve problems.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 7.1: Recognize and describe shapes</li>
                  <li>SCO 7.2: Use spatial relationships</li>
                  <li>SCO 7.3: Solve spatial problems</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-emerald-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Shape Introduction (5-10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Review basic 2D shapes with visual examples</li>
                    <li>Discuss shape properties (sides, corners, curves)</li>
                    <li>Show shape cards and have students name them</li>
                    <li>Explain the shape hunting mission</li>
                    <li>Set up shape collection bags or folders</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Shape Hunt (20-25 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students explore the classroom and school environment</li>
                    <li>Look for objects that represent different shapes</li>
                    <li>Take photos or draw pictures of shape discoveries</li>
                    <li>Record findings on shape hunt worksheets</li>
                    <li>Work in pairs or small groups for support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Shape Collection (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Return to classroom and organize discoveries</li>
                    <li>Sort objects and pictures by shape type</li>
                    <li>Create shape categories on chart paper</li>
                    <li>Discuss interesting shape discoveries</li>
                    <li>Count how many of each shape were found</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Shape Collage Creation (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students create individual shape collages</li>
                    <li>Use found objects, pictures, and drawings</li>
                    <li>Organize by shape type or create mixed arrangements</li>
                    <li>Add labels and descriptions to collages</li>
                    <li>Share collages with classmates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Shape Discussion (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Present shape collages to the class</li>
                    <li>Discuss where different shapes are commonly found</li>
                    <li>Explore why certain shapes are used for specific purposes</li>
                    <li>Identify shape patterns in the environment</li>
                    <li>Plan future shape exploration activities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-emerald-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-emerald-50 p-3 rounded-md border border-emerald-200">
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Home Shape Hunt</h3>
                  <p className="text-sm">
                    Send students home to find shapes in their home environment and create family shape collages.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Digital Shape Collection</h3>
                  <p className="text-sm">
                    Use tablets to photograph shapes and create digital shape galleries with captions.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Shape Art Creation</h3>
                  <p className="text-sm">
                    Use found shapes as inspiration for creating original artwork and designs.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">3D Shape Extension</h3>
                  <p className="text-sm">
                    Extend the hunt to include 3D shapes and discuss the relationship to 2D shapes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Hunt for more complex shapes (hexagon, octagon, pentagon)</li>
                    <li>Identify shape properties and characteristics</li>
                    <li>Create shape riddles for classmates</li>
                    <li>Explore symmetry in found shapes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on basic shapes (circle, square, triangle)</li>
                    <li>Provide shape templates for tracing</li>
                    <li>Work with a partner for support</li>
                    <li>Use familiar objects and locations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use shape names in students' home languages</li>
                    <li>Provide visual shape cards for reference</li>
                    <li>Allow students to describe shapes in their preferred language</li>
                    <li>Use gestures and expressions to support understanding</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Shape Recognition</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Identifies all basic shapes correctly</li>
                    <li><strong>Good:</strong> Identifies most basic shapes correctly</li>
                    <li><strong>Developing:</strong> Identifies some basic shapes</li>
                    <li><strong>Beginning:</strong> Struggles with shape identification</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Shape Discovery</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Finds many shapes independently</li>
                    <li><strong>Good:</strong> Finds several shapes with some guidance</li>
                    <li><strong>Developing:</strong> Finds some shapes with support</li>
                    <li><strong>Beginning:</strong> Needs significant guidance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Shape Communication</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Clearly describes shape properties</li>
                    <li><strong>Good:</strong> Describes most shape properties</li>
                    <li><strong>Developing:</strong> Describes some shape properties</li>
                    <li><strong>Beginning:</strong> Struggles to describe shapes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-xl shadow-md border border-emerald-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-emerald-800">Materials and Preparation Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Shape cards and reference materials</li>
              <li>Clipboards and shape hunt worksheets</li>
              <li>Paper, scissors, and glue for collages</li>
              <li>Cameras or drawing materials for recording</li>
              <li>Chart paper for organizing findings</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-700">Preparation Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pre-scout the area for interesting shape discoveries</li>
              <li>Ensure safety of exploration areas</li>
              <li>Prepare shape hunt worksheets with clear categories</li>
              <li>Set up a central display area for shape collections</li>
              <li>Have backup activities ready for indoor exploration</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/mathematics">
          <Button variant="outline" className="mr-4 bg-transparent">
            ← Back to Mathematics Activities
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/mathematics/measurement-olympics">
          <Button className="bg-emerald-600 hover:bg-emerald-700">Next Activity: Measurement Olympics</Button>
        </Link>
      </div>
    </div>
  )
}
