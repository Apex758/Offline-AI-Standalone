import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Clock, Users, BarChart2, FileText, Lightbulb, Zap } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function StateChangersActivity() {
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 2", href: "/curriculum/grade2-subjects" },
          { label: "Science", href: "/curriculum/grade2-subjects/science" },
          { label: "Activities", href: "/curriculum/grade2-subjects/activities/science" },
          { label: "State Changers", href: "/curriculum/grade2-subjects/activities/science/state-changers" },
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
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-xl shadow-md mb-6">
            <h1 className="text-3xl font-bold mb-2 text-blue-700">State Changers</h1>
            <p className="text-gray-700">
              Students observe how materials can change from solid to liquid and back again through heating and cooling,
              exploring the properties of matter and how they can be transformed.
            </p>
          </div>

          <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
            <FallbackImage
              src="/state-changers.png"
              fallbackSrc="/students-state-changes.png"
              alt="Students observing state changes in matter"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              <span>60 minutes</span>
            </div>
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              <span>Groups of 3-4</span>
            </div>
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
              <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
              <span>Medium difficulty</span>
            </div>
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
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
                  <span>Observe how heating and cooling can change materials from solid to liquid and back again</span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Identify the properties of materials in different states</span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Predict and record changes in materials when heated or cooled</span>
                </li>
                <li className="flex items-start">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>Understand that some changes can be reversed and others cannot</span>
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
                  <li>Ice cubes (2-3 per group)</li>
                  <li>Small clear plastic cups (4 per group)</li>
                  <li>Chocolate chips or small chocolate pieces</li>
                  <li>Butter (small piece)</li>
                  <li>Plastic spoons</li>
                  <li>Paper towels</li>
                  <li>Thermometers (if available)</li>
                  <li>Magnifying glasses</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">For Teacher Demonstration</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hot plate or access to warm water</li>
                  <li>Heat-resistant container</li>
                  <li>Ice in a cooler</li>
                  <li>Digital thermometer</li>
                  <li>Chart paper and markers</li>
                  <li>Camera or tablet for documentation</li>
                  <li>Safety equipment (as needed)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold flex items-center mb-2">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Safety Note
            </h4>
            <p>
              Ensure proper supervision when using heat sources. The teacher should handle any hot materials. Remind
              students not to taste any materials used in science experiments.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preparation" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-4">Preparation Steps</h3>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Before the lesson:</strong> Gather all materials and set up stations for each group with the
              required items.
            </li>
            <li>
              <strong>Prepare observation sheets:</strong> Create simple observation sheets with columns for:
              <ul className="list-disc pl-5 mt-2">
                <li>Material name</li>
                <li>Starting state (solid/liquid)</li>
                <li>Prediction (what will happen when heated/cooled)</li>
                <li>Observation (what actually happened)</li>
                <li>Ending state (solid/liquid)</li>
              </ul>
            </li>
            <li>
              <strong>Set up demonstration area:</strong> Prepare a safe area for teacher demonstrations with the hot
              plate or warm water bath.
            </li>
            <li>
              <strong>Create visual aids:</strong> Prepare simple diagrams showing molecules in solids (tightly packed)
              and liquids (more loosely arranged).
            </li>
            <li>
              <strong>Optional:</strong> Prepare a short video clip showing examples of state changes in everyday life
              (ice cream melting, water freezing, etc.).
            </li>
          </ol>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2">Teacher Tip</h4>
            <p>
              Consider conducting this activity in small groups over multiple science periods if time is limited. You
              can also set up a science center where students rotate through during the week to observe changes over
              time.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-4">Activity Steps</h3>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Introduction (10 minutes)</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Begin by asking students what they know about solids and liquids. Create a class chart of their ideas.
                </li>
                <li>
                  Show students an ice cube and ask: "What will happen if we leave this ice cube on the table?" (It will
                  melt)
                </li>
                <li>Ask: "What will happen if we put water in the freezer?" (It will freeze)</li>
                <li>
                  Explain that today they will be investigating how materials can change from one state to another.
                </li>
              </ol>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Exploration (30 minutes)</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Ice Cube Investigation:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Give each group 2-3 ice cubes in a cup.</li>
                    <li>Have students observe and describe the ice cubes (solid, cold, hard, etc.).</li>
                    <li>Ask students to predict what will happen to the ice cubes if left at room temperature.</li>
                    <li>Have students observe the ice cubes at 5-minute intervals and record changes.</li>
                  </ul>
                </li>
                <li>
                  <strong>Chocolate Investigation:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Give each group some chocolate chips in a cup.</li>
                    <li>Have students observe and describe the chocolate (solid, brown, etc.).</li>
                    <li>Teacher demonstration: Place some chocolate in a heat-safe container and warm it gently.</li>
                    <li>Have students observe and record what happens to the chocolate as it warms.</li>
                    <li>
                      Place some of the melted chocolate in a cool place and have students predict what will happen.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Butter Investigation:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Repeat similar steps with the butter samples.</li>
                    <li>Compare how quickly different materials change states.</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Discussion and Reflection (15 minutes)</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Gather students to share their observations and findings.</li>
                <li>Create a class chart comparing what happened to each material.</li>
                <li>Discuss key vocabulary: solid, liquid, melt, freeze, heat, cool.</li>
                <li>Ask: "What made the solids turn into liquids?" (Heat/warming)</li>
                <li>Ask: "What made the liquids turn back into solids?" (Cooling)</li>
                <li>
                  Introduce the concept that these changes can be reversed - we can go back and forth between states.
                </li>
                <li>Connect to everyday examples: ice cream melting, puddles freezing, cooking eggs (irreversible).</li>
              </ol>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Conclusion (5 minutes)</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Have students complete a simple exit ticket: "One thing I learned about solids and liquids today..."
                </li>
                <li>Preview that in the next lesson, they will explore more materials and their properties.</li>
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
                  <li>Provide sentence starters for observations: "The ice is ___. When it melts it ___."</li>
                  <li>Use picture cards to help students identify and describe states of matter</li>
                  <li>Pair students with peer buddies for support</li>
                  <li>Provide pre-drawn observation templates</li>
                </ul>

                <h4 className="font-semibold mb-2">Extension</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Challenge students to test additional materials</li>
                  <li>Have students measure and record temperatures during state changes</li>
                  <li>Introduce the concept of gases as a third state of matter</li>
                  <li>Explore irreversible changes (cooking an egg, mixing baking soda and vinegar)</li>
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
                  <li>Observe students' predictions and explanations</li>
                  <li>Review observation sheets for accuracy and detail</li>
                  <li>Listen to group discussions for understanding of key concepts</li>
                  <li>Exit ticket responses</li>
                </ul>

                <h4 className="font-semibold mb-2">Summative Assessment</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create a simple diagram showing a material changing states</li>
                  <li>Sort pictures of materials into "can change state easily" and "cannot change state easily"</li>
                  <li>Explain in writing or drawing how ice cream melts and how water freezes</li>
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
                      <li>Create a class book about state changes observed in everyday life</li>
                      <li>Set up a "States of Matter" observation station in the classroom</li>
                      <li>Investigate how the size/shape of ice cubes affects melting time</li>
                      <li>Make popsicles to observe liquid to solid changes</li>
                      <li>Explore how salt affects the freezing/melting of ice</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Home Connections</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Send home a "State Changers Scavenger Hunt" to find examples at home</li>
                      <li>Suggest simple kitchen science activities families can do together</li>
                      <li>Ask students to observe and record an example of melting or freezing at home</li>
                      <li>Share a simple recipe families can make together that involves state changes</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2">Cross-Curricular Connections</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Language Arts:</strong> Write a story from the perspective of a snowman melting or water
                      freezing
                    </li>
                    <li>
                      <strong>Math:</strong> Measure and graph melting times under different conditions
                    </li>
                    <li>
                      <strong>Art:</strong> Create before and after drawings of materials changing states
                    </li>
                    <li>
                      <strong>Social Studies:</strong> Explore how people use state changes in cooking across different
                      cultures
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
            This activity helps students develop an understanding of how materials can change from solid to liquid and
            back again. It addresses the Grade 2 science standard related to the structure and properties of matter,
            specifically that some materials can be changed by heating or cooling.
          </p>
          <p>Common misconceptions to address:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Some students may think that all solids melt at the same rate or temperature</li>
            <li>Students might believe that when something melts, it disappears rather than changes state</li>
            <li>Some may confuse dissolving (mixing with a liquid) with melting (changing from solid to liquid)</li>
          </ul>
          <p>
            Vocabulary to emphasize: solid, liquid, melt, freeze, heat, cool, temperature, observe, predict, properties,
            states of matter
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/science/material-explorers">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/science/building-blocks">
          <Button variant="outline">
            Next Activity <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
