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
            <Link href="/curriculum/grade2-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Shapes className="mr-2 h-7 w-7 text-purple-600" />
            Geometrical Thinking
          </h1>
          <p className="text-gray-700">
            In Grade 2, students deepen their understanding of two-dimensional and three-dimensional shapes. They learn
            to recognize, describe, and compare shapes based on their attributes, and begin to understand spatial
            relationships and basic geometric principles.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Geometrical Thinking
        </h3>

        <Tabs defaultValue="exploring">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="exploring" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Exploring Shapes
            </TabsTrigger>
            <TabsTrigger
              value="recognizing"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Recognizing Shapes
            </TabsTrigger>
            <TabsTrigger value="composing" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Composing Shapes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exploring" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Exploring and Analyzing Geometric Shapes and Relationships
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Use language that describes shapes, objects, and space orally and in writing</li>
              <li>Use gestures that aid in the understanding and communication of a description</li>
              <li>Use positional language</li>
              <li>Find 2D shapes or paths hidden in a picture or space</li>
              <li>Recognize a shape or object seen from various points of view and from various distances</li>
              <li>Draw a picture from a description and vice versa about 3D objects</li>
              <li>Draw, build and make predictions about 2D shapes and 3D objects</li>
              <li>Build a model from a picture or description of 3D objects</li>
              <li>
                Make predictions based on spatial reasoning about what 2D shapes can be created by the footprints of 3D
                solids
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="recognizing" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Recognizing, Naming and Describing Shapes
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Recognize and describe attributes and characteristics of 2D shapes and 3D objects</li>
              <li>Classify two-dimensional figures as polygons or non-polygons</li>
              <li>
                Recognize, name, and classify 3D objects (specifically cube, cone, cylinder, sphere, prism, pyramid) and
                2D shapes
              </li>
              <li>
                Recognize, describe and compare attributes of shapes and objects based on number of sides, corners,
                rolls, or slides, flat sides or curved sides
              </li>
              <li>
                Describe the relative positions of several objects and the movements needed to get from one object to
                another
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="composing" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 3: Composing, Decomposing and Transforming Shapes
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Construct composite objects using cubes, cones, cylinders, spheres, prisms, and pyramids</li>
              <li>Identify characteristics of objects that make them easy to build with or not easy to build with</li>
              <li>Construct composite 2D shapes</li>
              <li>
                Deconstruct shapes identifying 2D shapes that can be found in 3D objects through making footprints,
                making shadows, or slicing
              </li>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Developing Spatial Sense
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Describe orally and written, 2-D and 3-D shapes and/or objects and space</li>
                    <li>Identify 2-D and 3-D shapes in the environment</li>
                    <li>
                      Explain the differences and similarities between and among 2-D shapes using vocabulary associated
                      with properties of shapes
                    </li>
                    <li>
                      Make comparisons between solids and plane shapes in concrete and pictorial forms using formal
                      language
                    </li>
                    <li>
                      Identify 2-D shapes as faces of 3-D shapes in pictures, objects or space from different
                      orientations
                    </li>
                    <li>
                      Classify shapes according to their properties/features and give reasons for the classification
                    </li>
                    <li>Create/build 2-D and 3-D shapes</li>
                    <li>Describe 2-D and 3-D shapes found in the natural environment or in pictures</li>
                    <li>Create 3D shapes using 2D shapes from a description given within a real world context</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Sorting, Patterning, and Building with 2D and 3D Shapes
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify 2D shapes on 3D objects</li>
                    <li>Represent and construct 2D shapes and 3D objects</li>
                    <li>Sort 2D shapes and 3D objects based on their attributes and characteristics</li>
                    <li>Solve repeating patterns using/involving 2D shapes and 3D objects</li>
                    <li>Create repeating patterns using/involving 2D shapes and 3D objects</li>
                    <li>Build composite shapes/structures of 2D and 3D shapes and describe the pattern used</li>
                    <li>Choose to use 2D shapes to create 3D models using pictorial and physical representations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Analyzing and Describing Shapes
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify properties of 2D shapes</li>
                    <li>Justify classification of 2D shapes according to attributes</li>
                    <li>
                      Identify similarities and differences between 2D shapes based on attributes such as sides or
                      corners
                    </li>
                    <li>
                      Identify similarities and differences between 3D objects based on attributes such as sides, edges,
                      rolls/slides, uniform thickness or not
                    </li>
                    <li>Classify 2D shapes as polygons or non-polygons</li>
                    <li>Compare 2-D shapes in the environment</li>
                    <li>Differentiate between polygons and non-polygons in the environment</li>
                    <li>
                      Show an awareness of the existence of 2D shapes by discussing where they are found in everyday
                      life
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Combining and Deconstructing Shapes
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Duplicate composite 2D and 3D shapes that are presented</li>
                    <li>Design composite 2D representations combining the faces of more than one 2D shape</li>
                    <li>Create composite 3D structures using 3D objects in their environment</li>
                    <li>Make composite representations of 2D and 3D shapes using technology</li>
                    <li>Solve problems involving 2D and 3D shapes</li>
                    <li>
                      Justify the use of the shapes used to create their composite 2D and 3D shapes stating the
                      properties of the shapes that make them suitable
                    </li>
                    <li>
                      Identify 2D shapes that are part of the composition of 3D objects using footprints, making
                      shadows, or slicing
                    </li>
                    <li>
                      Deconstruct 3D objects to identify the 2D shapes that constitute their formation through slicing,
                      making shadows and footprints
                    </li>
                    <li>Volunteer to conduct a presentation on 2D shapes in the composition of 3D objects</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-violet-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-violet-50">
              <CardTitle className="text-violet-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-violet-700">Observations:</strong> Teacher observations during shape
                  exploration, sorting activities, and construction of 2D and 3D shapes
                </li>
                <li>
                  <strong className="text-violet-700">Conversations:</strong> Student explanations of shape attributes,
                  classifications, and reasoning about shape relationships
                </li>
                <li>
                  <strong className="text-violet-700">Products:</strong> Student-created shapes, drawings, models, and
                  constructions demonstrating understanding of geometric concepts
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
                <h4 className="font-semibold mb-2 text-violet-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for shape identification and classification</li>
                  <li>Rubrics for evaluating student-created 2D and 3D constructions</li>
                  <li>Performance tasks involving shape sorting and building</li>
                  <li>Exit tickets to assess understanding of shape attributes</li>
                  <li>Geometry portfolios showcasing student work with shapes</li>
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
                  <AccordionTrigger>Developing Spatial Sense</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Shape Hunts:</strong> Take students on "shape hunts" around the school or classroom to
                        identify 2D and 3D shapes in their environment.
                      </li>
                      <li>
                        <strong>Positional Language Activities:</strong> Engage students in activities that require them
                        to use positional language to describe the location of objects.
                      </li>
                      <li>
                        <strong>Drawing from Different Perspectives:</strong> Have students draw objects from different
                        perspectives to develop spatial visualization skills.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Working with 2D and 3D Shapes</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Hands-on Exploration:</strong> Provide a variety of 2D and 3D shapes for students to
                        explore, sort, and classify based on their attributes.
                      </li>
                      <li>
                        <strong>Shape Construction:</strong> Have students create 2D shapes using geoboards, dot paper,
                        or drawing tools, and 3D shapes using clay, toothpicks, or building sets.
                      </li>
                      <li>
                        <strong>Pattern Block Activities:</strong> Use pattern blocks for students to create designs,
                        patterns, and composite shapes.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Analyzing Shape Attributes</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Attribute Sorting:</strong> Provide opportunities for students to sort shapes based on
                        different attributes, such as number of sides, corners, or curved surfaces.
                      </li>
                      <li>
                        <strong>Compare and Contrast:</strong> Have students compare and contrast different shapes,
                        identifying similarities and differences in their attributes.
                      </li>
                      <li>
                        <strong>Shape Riddles:</strong> Create riddles that describe shapes based on their attributes
                        for students to solve.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Composing and Decomposing Shapes</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Shadow Exploration:</strong> Use light sources to create shadows of 3D objects, helping
                        students see the 2D shapes that make up 3D objects.
                      </li>
                      <li>
                        <strong>Footprint Activities:</strong> Have students create "footprints" of 3D objects by
                        dipping them in paint or using them to make impressions in clay.
                      </li>
                      <li>
                        <strong>Building Challenges:</strong> Provide building challenges where students need to create
                        specific structures using given shapes or materials.
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
                <li>2D shape sets and 3D geometric solids</li>
                <li>Pattern blocks and tangrams</li>
                <li>Geoboards and dot paper</li>
                <li>Building sets and construction materials</li>
                <li>OECS Grade 2 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual sets of 2D shapes and 3D objects</li>
                <li>Geometry journals for recording observations and drawings</li>
                <li>Personal geoboards or dot paper</li>
                <li>Clay or playdough for creating 3D shapes</li>
                <li>Shape attribute cards</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Young children first begin forming concepts of shape long before any formal schooling is introduced. They
              are able to recognize and describe objects by their appearance or by qualities; so we hear them refer to a
              ball as 'a circle' or 'the box looks like a rectangle'. All children's informal introduction and
              understanding of shapes should be facilitated through hands-on explorations, investigations and certainly
              discussions of these shapes and their structures. Children need to compare, take apart and sort objects
              based on their attributes as they engage in structured and unstructured play.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
