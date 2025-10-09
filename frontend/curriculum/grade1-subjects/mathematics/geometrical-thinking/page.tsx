"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function GeometricalThinkingPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Mathematics Curriculum
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Geometrical Thinking</h1>
        <p className="text-gray-600 mb-4">
          Geometry is one of the oldest branches of mathematics and is concerned with the study of shapes, sizes, and
          positions of objects in space. Our world is filled with shapes and objects of different designs; therefore, a
          deep understanding of geometric thinking is important. Geometric thinking is an essential skill that involves
          visualizing, analyzing, and manipulating shapes, objects, and space. It is a critical skill that students need
          to develop to understand many mathematical concepts and to solve real-world problems. To develop geometrical
          thinking students should observe pictures, diagrams and models, participate in hands-on activities, provided
          with the opportunity to make real -life connections, collaborative learning and opportunities to engage in
          technological activities.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Essential Learning Outcome G1.1: Explore and Analyze Geometric Shapes and Relationships - Developing spatial
            sense
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use language that describes 3D objects, such as cube, cone, cylinder, sphere, orally and in writing
                    to describe a picture or object in real-world contexts.
                  </li>
                  <li>
                    Use language that describes polygons, such as square, rectangle, and triangle, orally and in writing
                    to describe a picture or object in real-world contexts.
                  </li>
                  <li>Recognize and name 3D shapes.</li>
                  <li>Recognize and name 2D shapes.</li>
                  <li>Identify 2D shapes in real world context.</li>
                  <li>Identify 3D shapes in real world context.</li>
                  <li>Identify and name the 2D and 3D shapes whenever they undergo transformation.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use real-world examples: Start by using real-world examples of shapes and objects to help students
                    understand their characteristics and properties. For example, showing them a cube-shaped box or a
                    cylindrical can help them understand the properties of a cube and a cylinder.
                  </li>
                  <li>
                    Allow students to create their own story about shape and use the author's chair for students to tell
                    their story about their shape.
                  </li>
                  <li>Use Manipulatives:</li>
                  <li>Have students use cut outs to make solid figures.</li>
                  <li>Students use the given solid figures and make a completely new object.</li>
                  <li>Have students trace the sides and faces of shapes with their fingers.</li>
                  <li>
                    Take students on a "shape hunt" around the school to identify 2D and 3D shapes in their environment.
                  </li>
                  <li>Use digital tools or apps that allow students to manipulate and transform shapes.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Real-World Contexts: Can the student identify the shapes in real-world objects, such as in a
                    classroom, playground, or home?
                  </li>
                  <li>Can the student name the shapes they see correctly?</li>
                  <li>
                    Can the student identify the characteristics of each shape (number of sides, corners, curves, etc.)?
                  </li>
                  <li>
                    Can the student identify the shapes from different perspectives (e.g., recognizing a triangle when
                    it is upside down)?
                  </li>
                  <li>Use a checklist to observe students as they sort shapes into 2D shapes and 3D objects.</li>
                  <li>
                    Have students create a shape book where they identify and describe shapes they find in their
                    environment.
                  </li>
                  <li>
                    Assess students' ability to recognize shapes that have undergone transformation (rotation,
                    reflection, etc.).
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Essential Learning Outcome G1.2: Explore and Analyze Geometric Shapes and Relationships - Sorting,
            patterning, and building with 2D & 3D Shapes
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Recognize and name the basic 2D shapes and 3D objects</li>
                  <li>
                    Represent and construct the basic 2D shapes and 3D objects using appropriate materials and tools
                  </li>
                  <li>
                    Justify the properties of the basic 2D shapes and 3D objects, such as the number of sides, corners,
                    and faces
                  </li>
                  <li>Replicate and construct composite 2D shapes by combining the basic shapes in different ways</li>
                  <li>Replicate and construct 3D objects by combining the basic 3D objects in different ways</li>
                  <li>
                    Compare the characteristics of shapes and objects, such as the number of sides, corners, and faces,
                    and identify similarities and differences between them
                  </li>
                  <li>
                    Sort and pattern shapes and objects based on their characteristics, such as the number of sides,
                    corners, and faces, and create patterns using different shapes and colors
                  </li>
                  <li>Discuss the importance of geometrical shapes in the environment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Games</li>
                  <li>Differentiated Instruction:</li>
                  <li>
                    Geometric Art Project: Assign groups to create a piece of art using geometric shapes. This can be a
                    2D drawing or a 3D sculpture. This activity encourages creativity, visual-spatial skills, and
                    collaboration.
                  </li>
                  <li>Visual aids:</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Play musical chairs and Old Grady on shapes so that students' ability to identify and name shapes
                    will be highlighted.
                  </li>
                  <li>Allow students to draw 2D and 3D shapes.</li>
                  <li>Allow students to create both 2D and 3D shapes using local materials.</li>
                  <li>
                    Use a rubric to assess students' oral presentation, projects, how they present their shapes in their
                    booths, videos created that depict the properties of shapes, as they do show and tell on their
                    selected 3D objects.
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Essential Learning Outcome 2.1: Recognizing, Naming and Describing Shapes - Analysing and describing shapes
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Identify and name 2D shapes and 3D objects, including cubes, cones, cylinders, spheres, squares,
                    rectangles, triangles, and circles
                  </li>
                  <li>
                    Describe the attributes of 2D shapes, including the number of sides and corners, and whether the
                    sides are straight or curved
                  </li>
                  <li>
                    Describe the attributes of 3D objects, including the number of corners, whether they have flat or
                    curved sides, and whether they are uniform in thickness or come to a point
                  </li>
                  <li>Compare and contrast the attributes of different 3D objects</li>
                  <li>
                    Create and extend patterns using 2D shapes, including squares, rectangles, triangles, and circles
                  </li>
                  <li>Sort and classify 2D shapes and 3D objects based on their attributes</li>
                  <li>Use appropriate vocabulary to describe 2D shapes and 3D objects</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use visual aids such as posters and charts to display shapes and their attributes</li>
                  <li>Use guided questions to prompt students to think about shape features</li>
                  <li>Engage students in hands-on activities with manipulatives</li>
                  <li>Use simplified language and clear instructions to explain shape characteristics</li>
                  <li>Incorporate multisensory approaches to accommodate different learning styles</li>
                  <li>Use real-world object exploration to identify shapes in everyday items</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they sort shapes into 2D shapes and 3D objects</li>
                  <li>Use interviews to assess students' understanding of shapes and space</li>
                  <li>
                    Use digital drawing tools to assess students' ability to create representations of 2D shapes and 3D
                    objects
                  </li>
                  <li>Provide real-world objects for students to identify and describe</li>
                  <li>Use games to assess students' understanding of shape attributes</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Essential Learning Outcome 3.1: Combining Shapes</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Construct composite objects using different shapes</li>
                  <li>Identify the different shapes used in the composite objects created</li>
                  <li>State the characteristics of the shapes that make them easy or difficult to build with</li>
                  <li>Discuss and describe the composite objects</li>
                  <li>Compare and contrast different composite objects</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide concrete manipulatives for students to physically create composite objects</li>
                  <li>Use multisensory instruction with songs, chants, or rhymes that involve movement</li>
                  <li>Engage students in hands-on activities with building materials</li>
                  <li>Use guided inquiry approaches to encourage observation and exploration</li>
                  <li>Use simplified language to explain shape characteristics</li>
                  <li>Connect learning to real-world applications</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use a checklist to assess students as they arrange items from greatest to smallest in a graph</li>
                  <li>Observe students working in pairs as they reflect on their peers' work</li>
                  <li>Use games to assess students' ability to arrange themselves according to height</li>
                  <li>Use interviews and anecdotal records to note strategies used to order objects</li>
                  <li>Use oral questioning to assess students' justification for object arrangement</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            Essential Learning Outcome 3.2: Composing, Decomposing and Transforming Shapes – Deconstructing Shapes
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Identify and name at least three different 2D shapes (e.g., circles, squares, rectangles, triangles)
                    that can be found in cubes, cones, cylinders, and spheres.
                  </li>
                  <li>
                    Create and name 2D shapes by using physical objects (such as cubes, cones, cylinders, and spheres)
                    to create "footprints" or "shadows" on paper.
                  </li>
                  <li>
                    Describe the resulting cross-section of slicing a cube, cone, cylinder, or sphere, and the resulting
                    cross-sections can be different 2D shapes, and be able to identify and name these shapes.
                  </li>
                  <li>
                    Use appropriate vocabulary (e.g., edges, vertices, sides, circles, triangles) to describe the
                    features of cubes, cones, cylinders, and spheres, and explain how these features can be used to
                    identify the 2D shapes within them.
                  </li>
                  <li>
                    Apply knowledge of 2D shapes to real-world objects by identifying and naming the 2D shapes that can
                    be found in everyday objects that resemble cubes, cones, cylinders, and spheres, such as a soccer
                    ball (sphere) or a building block (cube).
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Visual Aids:</li>
                  <li>Hands-on Activities:</li>
                  <li>Verbal Prompts:</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Visual Identification:</li>
                  <li>Verbal Descriptions:</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            Essential Learning Outcome 3.3: Composing, Decomposing and Transforming Shapes – Transforming Shapes
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Identify and name common 3D shapes, such as cubes, spheres, cones, and cylinders.</li>
                  <li>Use basic spatial concepts, such as up, down, in front of, behind, and beside correctly.</li>
                  <li>Use concrete materials, such as playdough, sand, or clay, to create 3D shapes and objects.</li>
                  <li>Transform 3D objects by molding, shaping, stretching, and flattening the materials.</li>
                  <li>Identify similarities and differences between transformed and original objects.</li>
                  <li>
                    Use mathematical language to describe the transformations, such as "flattened," "stretched," or
                    "twisted."
                  </li>
                  <li>Explore different ways to transform objects, such as rotating, flipping, or sliding.</li>
                  <li>Use trial and error to solve problems related to transforming objects.</li>
                  <li>Work collaboratively with peers to create and transform 3D objects.</li>
                  <li>
                    Reflect on learning and identify areas for improvement in their ability to transform 3D objects.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Manipulatives:</li>
                  <li>Model the concepts:</li>
                  <li>Play games:</li>
                  <li>Draw or colour:</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe and document:</li>
                  <li>Rubrics:</li>
                  <li>Ask open-ended questions:</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Teacher Resources</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Manipulatives such as pattern blocks, tangrams, and geoboards</li>
                <li>Visual aids such as posters and charts</li>
                <li>Interactive whiteboards and digital tools</li>
                <li>Books and literature that incorporate geometric concepts</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Cross-Curricular Connections</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Art: Creating artwork with geometric shapes</li>
                <li>Science: Identifying shapes in natural objects</li>
                <li>Social Studies: Exploring shapes in architecture and community structures</li>
                <li>Language Arts: Using descriptive language to describe shapes and objects</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
