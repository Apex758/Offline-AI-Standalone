import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Clock, Users, BarChart2, FileText, Lightbulb, Zap } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function BuildingBlocksActivity() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 2", href: "/curriculum/grade2-subjects" },
          { label: "Science", href: "/curriculum/grade2-subjects/science" },
          { label: "Activities", href: "/curriculum/grade2-subjects/activities/science" },
          { label: "Building Blocks", href: "/curriculum/grade2-subjects/activities/science/building-blocks" },
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <Link href="/curriculum/grade2-subjects/activities/science">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Science Activities
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md mb-6">
            <h1 className="text-3xl font-bold mb-2 text-purple-700">Building Blocks</h1>
            <p className="text-gray-700">
              Students explore how small pieces can be assembled to make larger objects with different properties,
              discovering how the structure of an object relates to its function and properties.
            </p>
          </div>

          <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
            <FallbackImage
              src="/colorful-building-blocks.png"
              fallbackSrc="/placeholder-cerz8.png"
              alt="Children building with blocks"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
              <Clock className="mr-2 h-5 w-5 text-purple-500" />
              <span>50 minutes</span>
            </div>
            <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
              <Users className="mr-2 h-5 w-5 text-purple-500" />
              <span>Pairs or small groups</span>
            </div>
            <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
              <BarChart2 className="mr-2 h-5 w-5 text-purple-500" />
              <span>Easy</span>
            </div>
            <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
              <FileText className="mr-2 h-5 w-5 text-purple-500" />
              <span>Structure and Properties of Matter</span>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Understand that small pieces can be assembled to make larger objects</span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>
                    Observe how the properties of a structure depend on the properties and arrangement of its parts
                  </span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>
                    Explore how different arrangements of the same parts can create structures with different properties
                  </span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Connect the structure of objects to their function and stability</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="materials" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="preparation">Preparation</TabsTrigger>
          <TabsTrigger value="activity">Activity Steps</TabsTrigger>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-4">Materials Needed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">For Each Group</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Building blocks (wooden, plastic, or interlocking blocks)</li>
                  <li>Small LEGO® or similar interlocking bricks</li>
                  <li>Craft sticks</li>
                  <li>Clay or playdough</li>
                  <li>Toothpicks</li>
                  <li>Small marshmallows or gumdrops</li>
                  <li>Paper and pencils for drawing designs</li>
                  <li>Rulers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">For Teacher Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Chart paper and markers</li>
                  <li>Examples of objects made from smaller parts (toys, furniture, etc.)</li>
                  <li>Pictures of structures (buildings, bridges, etc.)</li>
                  <li>Digital camera or tablet for documentation</li>
                  <li>Timer</li>
                  <li>Building challenge cards (optional)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold flex items-center mb-2">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Materials Note
            </h4>
            <p>
              If commercial building materials are limited, you can use recycled materials like cardboard pieces, paper
              tubes, bottle caps, or small boxes. Ensure all materials are clean and free of sharp edges.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preparation" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-4">Preparation Steps</h3>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Gather building materials:</strong> Collect a variety of building materials and sort them into
              containers for each group.
            </li>
            <li>
              <strong>Create building challenge cards (optional):</strong> Prepare simple challenge cards with
              structures for students to build (e.g., "Build a tower that can hold a small book," "Create a bridge that
              spans 8 inches," etc.).
            </li>
            <li>
              <strong>Prepare observation sheets:</strong> Create simple worksheets where students can draw their
              structures and answer questions about them.
            </li>
            <li>
              <strong>Set up building stations:</strong> Arrange the classroom with designated areas for each group to
              work.
            </li>
            <li>
              <strong>Gather examples:</strong> Collect or prepare pictures of structures made from smaller parts
              (buildings, bridges, furniture, toys).
            </li>
          </ol>

          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold mb-2">Teacher Tip</h4>
            <p>
              Consider having students work on a tray or large piece of construction paper to contain the building
              materials and make cleanup easier. You might also want to take photos of successful structures before
              disassembly for documentation and future reference.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-4">Activity Steps</h3>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Introduction (10 minutes)</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Show students examples or pictures of objects made from smaller parts (like a chair, toy car, or
                  building).
                </li>
                <li>Ask: "What do you notice about these objects? What are they made of?"</li>
                <li>Guide students to recognize that many objects are made of smaller parts put together.</li>
                <li>
                  Explain that today they will explore how small pieces can be assembled to make larger objects with
                  different properties.
                </li>
                <li>Introduce key vocabulary: parts, whole, structure, properties, stable, unstable.</li>
              </ol>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Exploration Phase 1: Free Building (15 minutes)</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Distribute building materials to each group.</li>
                <li>Allow students time to freely explore and build with the materials.</li>
                <li>Encourage them to try different arrangements and combinations of materials.</li>
                <li>
                  As they work, circulate and ask questions:
                  <ul className="list-disc pl-5 mt-1">
                    <li>"What are you building?"</li>
                    <li>"How are you arranging the pieces?"</li>
                    <li>"What makes your structure stand up (or not stand up)?"</li>
                  </ul>
                </li>
                <li>Have students draw their creations on their observation sheets.</li>
              </ol>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Exploration Phase 2: Building Challenges (15 minutes)</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Introduce building challenges to the class:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Challenge 1: Build the tallest tower you can that stands on its own</li>
                    <li>Challenge 2: Build a structure that can hold a small book or other weight</li>
                    <li>Challenge 3: Build a bridge that spans a certain distance (e.g., 8 inches)</li>
                  </ul>
                </li>
                <li>Allow students time to plan, build, and test their structures.</li>
                <li>Encourage them to modify their designs if they don't work at first.</li>
                <li>Have students record their observations about what worked and what didn't.</li>
              </ol>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Discussion and Reflection (10 minutes)</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Gather students to share their structures and experiences.</li>
                <li>
                  Ask questions to guide reflection:
                  <ul className="list-disc pl-5 mt-1">
                    <li>"How did you arrange the pieces to make your structure stable?"</li>
                    <li>"What happened when you changed the arrangement of the pieces?"</li>
                    <li>"How did the properties of the small pieces affect what you could build?"</li>
                    <li>"How is your structure similar to or different from real-world structures?"</li>
                  </ul>
                </li>
                <li>Create a class chart of "What We Learned About Building Structures"</li>
                <li>
                  Emphasize key concepts:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Small pieces can be assembled to make larger objects</li>
                    <li>The properties of a structure depend on the properties and arrangement of its parts</li>
                    <li>Different arrangements of the same parts can create structures with different properties</li>
                    <li>The shape and stability of a structure relate to its function</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="extensions" className="p-4 border rounded-md mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Differentiation Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Support</h4>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Provide simple building templates or pictures for reference</li>
                  <li>Pre-sort building materials for easier selection</li>
                  <li>Offer partially completed structures that students can finish</li>
                  <li>Pair students with peer buddies for collaborative building</li>
                  <li>Use larger building materials for students with fine motor challenges</li>
                </ul>

                <h4 className="font-semibold mb-2">Extension</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Challenge students to build structures with specific constraints (limited materials, time limits)
                  </li>
                  <li>Have students design and test structures for specific purposes</li>
                  <li>Introduce more complex building challenges (e.g., a structure that can withstand shaking)</li>
                  <li>Encourage students to measure and record dimensions of their structures</li>
                  <li>Have students research and replicate famous architectural structures</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Formative Assessment</h4>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Observe students' building techniques and problem-solving approaches</li>
                  <li>Listen to students' explanations of their building strategies</li>
                  <li>Review students' drawings and notes on their observation sheets</li>
                  <li>Ask questions during building to gauge understanding of key concepts</li>
                </ul>

                <h4 className="font-semibold mb-2">Summative Assessment</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Have students complete a final building challenge that demonstrates understanding of structure and
                    stability
                  </li>
                  <li>
                    Ask students to explain in writing or drawing how the arrangement of parts affects a structure's
                    properties
                  </li>
                  <li>Create a simple matching activity connecting structures to their functions</li>
                  <li>Have students identify examples of structures made from smaller parts in their environment</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Extensions and Home Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Classroom Extensions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Create a "Building Zone" in the classroom where students can continue to explore building
                        concepts
                      </li>
                      <li>Connect to a study of famous structures around the world</li>
                      <li>
                        Explore natural structures (beehives, bird nests, etc.) and how they're built from smaller parts
                      </li>
                      <li>Investigate how different materials affect the properties of structures</li>
                      <li>Design and build a class model of your school or community</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Home Connections</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Send home a "Structure Scavenger Hunt" to find examples of structures made from smaller parts
                      </li>
                      <li>Suggest simple building activities families can do with materials at home</li>
                      <li>Encourage families to notice and discuss structures in their community</li>
                      <li>
                        Share photos of classroom structures and invite families to share photos of structures built at
                        home
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2">Cross-Curricular Connections</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Mathematics:</strong> Measure dimensions of structures, count and sort building pieces,
                      explore geometric shapes
                    </li>
                    <li>
                      <strong>Language Arts:</strong> Write or dictate stories about structures, learn vocabulary
                      related to building
                    </li>
                    <li>
                      <strong>Social Studies:</strong> Explore structures from different cultures and time periods
                    </li>
                    <li>
                      <strong>Art:</strong> Design and create artistic structures, draw plans before building
                    </li>
                    <li>
                      <strong>Engineering:</strong> Introduce simple engineering principles like balance, stability, and
                      load-bearing
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold mb-4">Teacher Notes</h3>
        <div className="space-y-4">
          <p>
            This activity helps students understand that objects can be built from smaller parts, and that the
            properties of those objects depend on the properties and arrangement of their parts. This connects to the
            Grade 2 science standard related to the structure and properties of matter.
          </p>
          <p>Key concepts to emphasize:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Different materials have different properties that make them suitable for different purposes</li>
            <li>The way parts are put together affects the properties of the whole structure</li>
            <li>Engineers design structures based on the function they need to serve</li>
            <li>Testing and improving designs is an important part of building</li>
          </ul>
          <p>
            Vocabulary to emphasize: structure, properties, parts, whole, stable, unstable, balance, support, design,
            engineer
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/science/state-changers">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/science/plant-investigators">
          <Button variant="outline">
            Next Activity <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
