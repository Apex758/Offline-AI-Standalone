import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Clock, BarChart2, Users, CheckCircle2, Lightbulb, Pencil } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function MaterialExplorersActivity() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 2", href: "/curriculum/grade2-subjects" },
          { label: "Science", href: "/curriculum/grade2-subjects/science" },
          { label: "Activities", href: "/curriculum/grade2-subjects/activities/science" },
          { label: "Material Explorers", href: "/curriculum/grade2-subjects/activities/science/material-explorers" },
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <Link href="/curriculum/grade2-subjects/activities/science">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Science Activities
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-xl shadow-md mb-6">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">Material Explorers</h1>
            <p className="text-gray-700">
              Students investigate and classify different materials based on their observable properties such as color,
              texture, hardness, and flexibility.
            </p>
          </div>

          <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
            <FallbackImage
              src="/material-explorers.png"
              fallbackSrc="/placeholder.svg?height=400&width=800&query=Children%20examining%20different%20materials"
              alt="Material Explorers Activity"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                In this hands-on activity, students will explore a variety of everyday materials and learn to describe
                and classify them based on their observable properties. Through guided exploration and collaborative
                discussion, students will develop their scientific observation skills and begin to understand how the
                properties of materials relate to their uses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Identify and describe observable properties of different materials (color, texture, hardness,
                  flexibility)
                </li>
                <li>Sort and classify materials based on their properties</li>
                <li>Make connections between the properties of materials and their uses</li>
                <li>Use scientific vocabulary to communicate observations</li>
                <li>Work collaboratively to investigate and share findings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Materials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">For the Teacher</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Collection of various materials (see student materials)</li>
                      <li>Property cards (labeled: hard/soft, rough/smooth, flexible/rigid, transparent/opaque)</li>
                      <li>Chart paper and markers</li>
                      <li>Digital camera (optional)</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">For Each Group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Collection tray with 8-10 different materials (e.g., wood, plastic, metal, fabric, paper,
                        rubber, glass, stone)
                      </li>
                      <li>Magnifying glasses</li>
                      <li>Sorting hoops or containers</li>
                      <li>Science notebooks or recording sheets</li>
                      <li>Pencils and colored pencils</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Preparation</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Gather a variety of materials with different properties. Ensure there are enough for each group.
                </li>
                <li>Create property cards for sorting activities.</li>
                <li>Prepare a chart with a simple table for recording class observations.</li>
                <li>Set up exploration stations with trays of materials, magnifying glasses, and sorting tools.</li>
                <li>Make copies of recording sheets if not using science notebooks.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Activity Steps</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2">Introduction (10 minutes)</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Gather students in a circle and show them a mystery bag containing different materials.</li>
                    <li>Ask students to reach in (without looking) and describe what they feel.</li>
                    <li>
                      Introduce the concept of properties and how scientists use properties to describe and classify
                      materials.
                    </li>
                    <li>
                      Explain that today they will be material scientists, exploring and classifying different
                      materials.
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2">Exploration (15 minutes)</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Divide students into small groups and distribute material trays.</li>
                    <li>
                      Allow students time to freely explore the materials using their senses (remind them not to taste).
                    </li>
                    <li>Encourage students to use magnifying glasses to observe details.</li>
                    <li>
                      Ask students to record their observations in their science notebooks or on recording sheets.
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2">Guided Classification (15 minutes)</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Introduce property vocabulary: hard/soft, rough/smooth, flexible/rigid, transparent/opaque.</li>
                    <li>Model how to sort materials based on one property (e.g., hard vs. soft).</li>
                    <li>Have groups sort their materials based on different properties.</li>
                    <li>Ask students to record their classifications in their notebooks.</li>
                  </ol>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2">Discussion and Sharing (10 minutes)</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Bring the class back together to share their findings.</li>
                    <li>Create a class chart of material properties.</li>
                    <li>Discuss how certain properties make materials useful for specific purposes.</li>
                    <li>
                      Ask students to think about why certain materials are used for particular objects in the
                      classroom.
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Differentiation</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="mr-2 h-5 w-5 text-yellow-600" />
                      Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Provide a word bank with property vocabulary</li>
                      <li>Use picture cards to represent properties</li>
                      <li>Work with a smaller set of materials with obvious differences</li>
                      <li>Provide sentence starters for observations</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                      Core
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Complete the activity as described</li>
                      <li>Focus on identifying multiple properties for each material</li>
                      <li>Make connections between properties and uses</li>
                      <li>Record observations in science notebooks</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
                      Extension
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Test materials for additional properties (e.g., waterproof, magnetic)</li>
                      <li>Create a Venn diagram to compare materials with multiple properties</li>
                      <li>Design an object that requires specific material properties</li>
                      <li>Research how materials can change properties</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Assessment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Formative Assessment</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Observe students during exploration and classification activities</li>
                    <li>Listen to students' use of property vocabulary during discussions</li>
                    <li>Review science notebook entries for accurate observations and classifications</li>
                    <li>Use questioning to gauge understanding of how properties relate to uses</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Summative Assessment</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Have students create a "Material Property Book" with drawings and descriptions</li>
                    <li>Ask students to match materials to specific uses based on their properties</li>
                    <li>Create a simple rubric to assess understanding of key concepts</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Extensions</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Material Scavenger Hunt:</strong> Have students find objects made from specific materials
                  around the classroom or school.
                </li>
                <li>
                  <strong>Material Testing Station:</strong> Set up a center where students can test materials for
                  additional properties like waterproof, magnetic, or how they react to heat or cold.
                </li>
                <li>
                  <strong>Design Challenge:</strong> Challenge students to select materials with specific properties to
                  solve a simple problem (e.g., design a waterproof container).
                </li>
                <li>
                  <strong>Material Changes:</strong> Introduce simple ways that materials can be changed (cutting,
                  folding, wetting) and have students observe how properties might change.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Home Connections</h2>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="mb-2">Send home a simple activity sheet encouraging families to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Look for objects made from different materials around their home</li>
                  <li>Discuss why certain materials are used for specific purposes</li>
                  <li>Sort household objects by their material properties</li>
                  <li>Create a "Material Museum" with small samples of different materials found at home</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Teacher Notes</h2>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Safety:</strong> Ensure all materials are safe for handling. Avoid sharp edges or toxic
                    materials.
                  </li>
                  <li>
                    <strong>Vocabulary Development:</strong> Create a word wall with property terms and visual examples.
                  </li>
                  <li>
                    <strong>Cross-Curricular Connections:</strong> Connect to math (sorting, classifying), language arts
                    (descriptive language), and art (textures in artwork).
                  </li>
                  <li>
                    <strong>Background Knowledge:</strong> This activity builds foundational understanding for future
                    learning about states of matter and material changes.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Duration</p>
                  <p>45 minutes</p>
                </div>
              </div>
              <div className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Difficulty</p>
                  <p>Easy</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Group Size</p>
                  <p>Small groups (3-4 students)</p>
                </div>
              </div>
              <div className="flex items-center">
                <Pencil className="mr-2 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Preparation Time</p>
                  <p>20 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Curriculum Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-700">Science Standards</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Observe and describe the properties of different kinds of materials</li>
                    <li>Classify materials based on their observable properties</li>
                    <li>Analyze data obtained from testing different materials</li>
                    <li>Connect the properties of materials to their uses</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">Cross-Curricular</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Math:</strong> Sorting, classifying, and data collection
                    </li>
                    <li>
                      <strong>Language Arts:</strong> Descriptive vocabulary, recording observations
                    </li>
                    <li>
                      <strong>Art:</strong> Exploring textures and materials in artistic creations
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-700">Printables</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Material observation recording sheet</li>
                    <li>Property cards for sorting activities</li>
                    <li>Material classification chart</li>
                    <li>Home connection activity sheet</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">Additional Resources</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Interactive material sorting games</li>
                    <li>Children's books about materials and their uses</li>
                    <li>Videos showing how materials are made or used</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Link href="/curriculum/grade2-subjects/activities/science">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> All Science Activities
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/science/state-changers">
          <Button>
            Next Activity: State Changers <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
